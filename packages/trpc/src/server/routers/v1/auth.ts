import {
  createAccount,
  deleteAccount,
  isAdminError,
} from "@repo/firebase-admin";
import { createCustomer, deleteCustomer } from "@repo/stripe";
import { LibsqlError, users } from "@repo/turso";
import { IdTypes, generateId, schemas } from "@repo/utils";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure, router } from "../../trpc";

export const authRouter = router({
  createAccount: publicProcedure
    .input(
      z.object({
        email: schemas.emailSchema,
        password: schemas.passwordSchema,
        firstName: schemas.nameSchema,
        lastName: schemas.nameSchema,
        username: schemas.usernameSchema,
      })
    )
    .output(
      z.object({
        accountCreated: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      console.info("Creating account with input:", input);

      const throwDefaultError = (err: unknown): never => {
        console.error("Unhandled error creating account:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Could not create account. Please try again later or contact support for help.",
        });
      };

      // Firebase Auth Account
      const newUserId = await (async () => {
        try {
          const createdUserId = await createAccount({
            userId: generateId(IdTypes.USER),
            email: input.email,
            password: input.password,
          });
          return createdUserId;
        } catch (err) {
          // Cleanup

          // Custom error handling
          if (isAdminError(err)) {
            console.error("Unhandled AdminError:", err);
            switch (err.code) {
              case "auth/email-already-exists":
                throw new TRPCError({
                  code: "CONFLICT",
                  message: "Email already in use.",
                });
              case "auth/invalid-email":
                throw new TRPCError({
                  code: "BAD_REQUEST",
                  message: "Invalid email provided.",
                });
              case "auth/invalid-password":
                throw new TRPCError({
                  code: "BAD_REQUEST",
                  message: "Invalid password provided.",
                });
              default:
                throw new TRPCError({
                  code: "BAD_REQUEST",
                  message:
                    "Could not create account. Please check credentials and try again later or contact support for help.",
                });
            }
          }

          // Default error handling
          return throwDefaultError(err);
        }
      })();

      const cleanupFirebaseAccount = async (context?: unknown) => {
        try {
          await deleteAccount(newUserId);
        } catch (deleteAccountError) {
          console.error(
            "Could not delete account:",
            newUserId,
            deleteAccountError,
            context
          );
        }
      };

      // Stripe Customer
      const stripeCustomerId = await (async () => {
        try {
          const newStripeCustomer = await createCustomer(newUserId);
          return newStripeCustomer.id;
        } catch (err) {
          console.error(
            "Could not create stripe customer for new account:",
            err
          );

          // Cleanup
          const context = { location: "Stripe customer creation" };
          await cleanupFirebaseAccount(context);

          // Custom error handling

          // Default error handling
          return throwDefaultError(err);
        }
      })();

      const cleanupStripeCustomer = async (context?: unknown) => {
        try {
          await deleteCustomer(stripeCustomerId);
        } catch (deleteCustomerError) {
          console.error(
            "Could not delete stripe customer:",
            newUserId,
            deleteCustomerError,
            context
          );
        }
      };

      // repo User
      const createdAccountId = await (async () => {
        try {
          const user = await users.createUser({
            userId: newUserId,
            username: input.username,
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            stripeCustomerId,
          });

          return user.userId;
        } catch (err) {
          console.error("Could not create user for new account:", err);

          // Cleanup
          const context = { location: "repo user creation" };
          await cleanupFirebaseAccount(context);
          await cleanupStripeCustomer(context);

          // Custom error handling
          if (err instanceof LibsqlError) {
            if (
              err.code === "SQLITE_CONSTRAINT_UNIQUE" &&
              err.message.includes(
                "UNIQUE constraint failed: profiles.username"
              )
            ) {
              throw new TRPCError({
                code: "CONFLICT",
                message: "Username already in use.",
              });
            }
          }

          // Default error handling
          return throwDefaultError(err);
        }
      })();

      return {
        accountCreated: createdAccountId,
      };
    }),
});
