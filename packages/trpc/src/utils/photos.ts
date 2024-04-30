import type { helpers } from "@repo/turso";
import { constants } from "@repo/utils";
import { type z } from "zod";

import { isUserPremium } from "./subscriptions";

export const parseRemainingUploads = (
  user: z.infer<typeof helpers.userSchema>
) => {
  const { photosCount } = user;

  const uploadCount = isUserPremium(user)
    ? constants.photos.UploadCounts.PREMIUM
    : constants.photos.UploadCounts.BASIC;
  // MARK: Handle additional uploads earned

  return uploadCount - photosCount;
};
