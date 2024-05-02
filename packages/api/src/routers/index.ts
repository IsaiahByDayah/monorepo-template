import { router } from "../trpc"
import { testRouter } from "./test"

export const appRouter = router({
  test: testRouter,
})

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
