import { router } from "../../trpc"
import { adminRouter } from "./admin"
import { authRouter } from "./auth"
import { devRouter } from "./dev"
import { photosRouter } from "./photos"
import { testRouter } from "./test"
import { usersRouter } from "./users"

export const v1Router = router({
  admin: adminRouter,
  auth: authRouter,
  dev: devRouter,
  photos: photosRouter,
  test: testRouter,
  users: usersRouter,
})
