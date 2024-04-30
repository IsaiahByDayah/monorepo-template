import { users } from "@repo/turso";
import { z } from "zod";

import { adminProcedure, router } from "../../../trpc";

export const adminUsersRouter = router({
  byId: adminProcedure
    .input(z.string())
    .query(async ({ input }) => users.getUserByUserId(input)),
  byUsername: adminProcedure
    .input(z.string())
    .query(async ({ input }) => users.getUserByUsername(input)),
});
