import { router } from "../../../trpc"
import { adminManagementRouter } from "./management"
import { adminUsersRouter } from "./users"

export const adminRouter = router({
  users: adminUsersRouter,
  management: adminManagementRouter,
})
