import { listUsers } from "@repo/firebase-admin";
import { z } from "zod";

import { devProcedure, router } from "../../../trpc";

export const devUserRouter = router({
  list: devProcedure.input(z.number()).query(({ input }) => listUsers(input)),
});
