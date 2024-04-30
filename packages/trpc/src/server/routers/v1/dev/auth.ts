import { connectEmulators, login } from "@repo/firebase-client";
import { schemas } from "@repo/utils";
import { z } from "zod";

import { devProcedure, router } from "../../../trpc";

export const devAuthRouter = router({
  loginByEmailAndPassword: devProcedure
    .input(
      z.object({
        email: schemas.emailSchema,
        password: schemas.passwordSchema,
      })
    )
    .query(async ({ input }) => {
      connectEmulators();
      const { user } = await login(input.email, input.password);

      return {
        user,
      };
    }),
});
