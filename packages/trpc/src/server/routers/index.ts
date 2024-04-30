import { type OpenApiRouter } from "trpc-openapi"

import { router } from "../trpc"
import { v1Router } from "./v1"

export const appRouter = router({
  v1: v1Router,
})

export const openApiRouter = appRouter as OpenApiRouter

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
