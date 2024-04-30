import { router } from "../../../trpc"
import { devAuthRouter } from "./auth"
import { devUserRouter } from "./users"

export const devRouter = router({
  auth: devAuthRouter,
  users: devUserRouter,
})
