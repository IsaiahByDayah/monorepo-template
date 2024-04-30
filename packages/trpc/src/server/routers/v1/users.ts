import { helpers, users } from "@repo/turso";
import { schemas } from "@repo/utils";
import { z } from "zod";

import {
  possiblyAuthenticatedProcedure,
  publicProcedure,
  router,
} from "../../trpc";

export const usersRouter = router({
  byUsername: publicProcedure
    .input(schemas.usernameSchema)
    .output(helpers.userPublicSchema.optional())
    .query(async ({ input }) => {
      const foundUser = await users.getUserByUsername(input);
      if (foundUser) {
        const publicUser = helpers.userPublicSchema.parse(foundUser);
        console.info(publicUser);
        return publicUser;
      }

      return undefined;
    }),
  me: possiblyAuthenticatedProcedure
    .output(helpers.userSensitiveSchema.optional())
    .query(({ ctx: { user } }) => {
      if (!user) {
        return undefined;
      }

      return helpers.userSensitiveSchema.parse(user);
    }),
  socialLinksByUserId: publicProcedure
    .input(z.string())
    .query(({ input }) => users.getSocialLinksByUserId(input)),
  socialLinksByUsername: publicProcedure
    .input(schemas.usernameSchema)
    .query(({ input }) => users.getSocialLinksByUsername(input)),
  supportLinksByUserId: publicProcedure
    .input(z.string())
    .query(({ input }) => users.getSupportLinksByUserId(input)),
  supportLinksByUsername: publicProcedure
    .input(schemas.usernameSchema)
    .query(({ input }) => users.getSupportLinksByUsername(input)),
});
