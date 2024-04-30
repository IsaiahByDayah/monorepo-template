import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { publicProcedure, router } from "../trpc"

export const testRouter = router({
  now: publicProcedure.query(() => {
    return Date.now()
  }),
  hello: publicProcedure.input(z.string().optional()).query(({ input }) => {
    return `Hello, ${input ?? "World"}!`
  }),
  echo: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/echo",
      },
    })
    .input(
      z.object({
        message: z.string(),
      }),
    )
    .output(z.string())
    .query(
      ({ input: { message } }) => `${message}\n  ${message}\n    ${message}`,
    ),
  error: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/error",
      },
    })
    .input(z.void())
    .output(z.void())
    .query(() => {
      throw new Error("Test Error in tRPC!")
    }),
  trpcError: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/trpc-error",
      },
    })
    .input(z.void())
    .output(z.void())
    .query(() => {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Test TRPCError in tRPC!",
        cause: new Error("Sample cause error"),
      })
    }),
})
