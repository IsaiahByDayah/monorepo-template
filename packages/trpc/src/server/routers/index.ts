import { type OpenApiRouter } from "trpc-openapi"

import { router } from "../trpc"
import { testRouter } from "./test"

export const appRouter = router({
  test: testRouter,
})

export const openApiRouter = appRouter as OpenApiRouter

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
