import { users } from "@repo/turso";
import { z } from "zod";

import { adminProcedure, router } from "../../../trpc";

export const adminManagementRouter = router({
  grantAdminStatus: adminProcedure
    .input(z.string())
    .mutation(({ input }) => users.grantAdminStatus(input)),
  revokeAdminStatus: adminProcedure
    .input(z.string())
    .mutation(({ input }) => users.revokeAdminStatus(input)),
  verifyUser: adminProcedure
    .input(z.string())
    .mutation(({ input }) => users.verifyUser(input)),
});
