import * as Sentry from "@sentry/node"
import { initTRPC } from "@trpc/server"
import superjson from "superjson"
import type { OpenApiMeta } from "trpc-openapi"

import type { Context } from "./context"

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().meta<OpenApiMeta>().create({
  transformer: superjson,
})
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router
export const middleware = t.middleware

// Setup Sentry logging
const serntryMiddleware = middleware(
  Sentry.Handlers.trpcMiddleware({
    attachRpcInput: true,
  }),
)

export const publicProcedure = t.procedure.use(serntryMiddleware)
