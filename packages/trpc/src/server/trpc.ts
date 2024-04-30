import { getUserInfoIdFromToken, isAdminError } from "@repo/firebase-admin";
import { users } from "@repo/turso";
import * as Sentry from "@sentry/node";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { OpenApiMeta } from "trpc-openapi";

import type { Context } from "./context";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().meta<OpenApiMeta>().create({
  transformer: superjson,
});
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const middleware = t.middleware;

// Setup Sentry logging
const serntryMiddleware = middleware(
  Sentry.Handlers.trpcMiddleware({
    attachRpcInput: true,
  })
);

export const publicProcedure = t.procedure.use(serntryMiddleware);

const parseAuthenticationMiddleware = middleware(async ({ ctx, next }) => {
  const { token } = ctx;

  let _user: Awaited<ReturnType<typeof users.getUserByUserId>>;
  let _isEmailVerified = false;

  if (token) {
    const { uid: userId, isEmailVerified } = await (async () => {
      try {
        return getUserInfoIdFromToken(token);
      } catch (err) {
        if (isAdminError(err)) {
          console.error("Unhandled AdminError:", err);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Could not get valid user ID from provided token.",
          });
        }
        console.error("Unhandled error getting userId from token:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not validate provided authorization token.",
        });
      }
    })();

    _user = await users.getUserByUserId(userId);
    _isEmailVerified = isEmailVerified;
  }

  return next({
    ctx: {
      user: _user,
      isEmailVerified: _isEmailVerified,
    },
  });
});
export const possiblyAuthenticatedProcedure = publicProcedure.use(
  parseAuthenticationMiddleware
);

const isAuthenticatedMiddleware = parseAuthenticationMiddleware.unstable_pipe(
  async ({ ctx, next }) => {
    const { user } = ctx;

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Requires authentication.",
      });
    }

    return next({
      ctx: {
        user,
      },
    });
  }
);
export const authenticatedProcedure = publicProcedure.use(
  isAuthenticatedMiddleware
);

const hasVerifiedEmailMiddleware = isAuthenticatedMiddleware.unstable_pipe(
  async ({ ctx, next }) => {
    const { isEmailVerified } = ctx;

    if (!isEmailVerified) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Requires verified email.",
      });
    }

    return next({
      ctx: {
        isEmailVerified,
      },
    });
  }
);
export const verfiedEmailProcedure = authenticatedProcedure.use(
  hasVerifiedEmailMiddleware
);

const isAdminMiddleware = isAuthenticatedMiddleware.unstable_pipe(
  ({ ctx, next }) => {
    if (!ctx.user.isAdmin) {
      throw new TRPCError({
        code: "FORBIDDEN",
      });
    }

    return next();
  }
);
export const adminProcedure = publicProcedure.use(isAdminMiddleware);

const isDevMiddleware = middleware(async ({ next }) => {
  if (process.env.NODE_ENV === "production") {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }

  return next();
});
export const devProcedure = publicProcedure.use(isDevMiddleware);
