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
    .input(
      z.object({
        message: z.string(),
      }),
    )
    .query(
      ({ input: { message } }) => `${message}\n  ${message}\n    ${message}`,
    ),
  error: publicProcedure.input(z.void()).query(() => {
    throw new Error("Test Error in tRPC!")
  }),
  trpcError: publicProcedure.input(z.void()).query(() => {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Test TRPCError in tRPC!",
      cause: new Error("Sample cause error"),
    })
  }),
})
