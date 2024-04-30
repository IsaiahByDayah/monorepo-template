import { buildObjectS3Url, getUploadUrl } from "@repo/b2-storage";
import { analyzeImagery } from "@repo/cloud-vision";
import {
  db,
  filters,
  helpers,
  schema,
  sql,
  utils,
  type SQL,
} from "@repo/turso";
import {
  checkIfResourceExist,
  constants,
  generateId,
  generateStorageKey,
  IdTypes,
} from "@repo/utils";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { parseRemainingUploads } from "../../../utils";
import {
  authenticatedProcedure,
  publicProcedure,
  router,
  verfiedEmailProcedure,
} from "../../trpc";

export const photosRouter = router({
  requestUpload: verfiedEmailProcedure
    .input(
      z.object({
        file: helpers.imageInputFileSchema,
      })
    )
    .output(
      z.object({
        uploadUrl: z.string(),
        imageId: z.string(),
      })
    )
    .mutation(async ({ input: { file }, ctx: { user } }) => {
      const newImage = await db.transaction(async (tx) => {
        const freshUser = await tx.query.users.findFirst({
          where: filters.eq(schema.users.userId, user.userId),
        });
        if (!freshUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Could not get user",
          });
        }

        // MARK: Check remaining uploads
        const remainingUploads = parseRemainingUploads(freshUser);
        if (remainingUploads < 1) {
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            message: "No photo uploads remaining.",
          });
        }

        //  Create image
        const imageId = generateId(IdTypes.IMAGE);
        const imageTypeId = constants.api.ImageTypes.PHOTO;
        const imageExtension = file.fileExtension;
        const [image] = await tx
          .insert(schema.images)
          .values({
            imageId,
            userId: user.userId,
            altText: file.altText,
            fileExtension: imageExtension,
            mimeType: file.mimeType,
            heightPx: file.heightPx,
            widthPx: file.widthPx,
            sizeBytes: file.sizeBytes,
            imageStatusId: constants.api.ImageStatuses.PENDING_UPLOAD,
            imageTypeId,
            storageSourceId: constants.api.StorageSources.BACKBLAZE_B2,
            storageKey: generateStorageKey({
              fileType: "image",
              imageId,
              imageTypeId,
              imageExtension,
            }),
          })
          .returning();

        return image;
      });

      const uploadUrl = await getUploadUrl({
        storageKey: newImage.storageKey,
        contentLength: newImage.sizeBytes,
        ttl: 60 * 5, // 5 min
      });

      return { uploadUrl, imageId: newImage.imageId };
    }),

  createPhoto: verfiedEmailProcedure
    .input(
      z.object({
        imageId: z.string(),
      })
    )
    .output(
      z.object({
        photo: helpers.photoSensitiveSchema,
      })
    )
    .mutation(async ({ input: { imageId }, ctx: { user } }) => {
      const newPhoto = await db.transaction(async (tx) => {
        const image = await tx.query.images.findFirst({
          where: filters.eq(schema.images.imageId, imageId),
        });

        if (!image) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Image does not exist.",
          });
        }

        if (image.userId !== user.userId) {
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            message: "Image does not belong to user.",
          });
        }

        if (image.imageTypeId !== constants.api.ImageTypes.PHOTO) {
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            message: "Image is not a photo.",
          });
        }

        const url = buildObjectS3Url(image.storageKey);
        const exists = await checkIfResourceExist(url);
        if (!exists) {
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            message: "Image resource does not exist.",
          });
        }

        const freshUser = await tx.query.users.findFirst({
          where: filters.eq(schema.users.userId, user.userId),
        });
        if (!freshUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Could not get user",
          });
        }

        // MARK: Check remaining uploads
        const remainingUploads = parseRemainingUploads(freshUser);
        if (remainingUploads < 1) {
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            message: "No photo uploads remaining.",
          });
        }

        // TODO: make this an async job?
        // Analyze and update image
        const { adult, medical, racy, spoof, violence } =
          await analyzeImagery(url);
        const newImageStatusId = (() => {
          if (
            adult === constants.api.Likelihoods.VERY_LIKELY ||
            adult === constants.api.Likelihoods.LIKELY
          ) {
            return constants.api.ImageStatuses.REJECTED;
          }

          if (
            adult === constants.api.Likelihoods.POSSIBLE ||
            adult === constants.api.Likelihoods.UNKNOWN
          ) {
            return constants.api.ImageStatuses.UNDER_REVIEW;
          }

          return constants.api.ImageStatuses.APPROVED;
        })();

        await tx.update(schema.images).set({
          imageStatusId: newImageStatusId,
          adultLikelihoodId: adult,
          medicalLikelihoodId: medical,
          racyLikelihoodId: racy,
          spoofLikelihoodId: spoof,
          violenceLikelihoodId: violence,
        });

        //  Create photo
        const photoStatusId = (() => {
          if (newImageStatusId === constants.api.ImageStatuses.REJECTED) {
            return constants.api.PhotoStatuses.INELIGIBLE;
          }

          if (newImageStatusId === constants.api.ImageStatuses.UNDER_REVIEW) {
            return constants.api.PhotoStatuses.UNDER_REVIEW;
          }

          return constants.api.PhotoStatuses.PENDING;
        })();

        const [photo] = await tx
          .insert(schema.photos)
          .values({
            photoId: generateId(IdTypes.PHOTO),
            userId: user.userId,
            licenseId: constants.api.Licenses.ALL_RIGHTS_RESERVED,
            photoImageId: imageId,
            photoStatusId,
            visibilityId: constants.api.Visibilities.PUBLIC,
          })
          .returning();

        //  increment upload count
        await tx
          .update(schema.users)
          .set({
            photosCount: sql`${schema.users.photosCount} + 1`,
          })
          .where(filters.eq(schema.users.userId, user.userId));

        // Return new image and photo
        return photo;
      });

      // TODO: kick off photo colors job?

      return { photo: helpers.photoSensitiveSchema.parse(newPhoto) };
    }),

  updatePhoto: authenticatedProcedure
    .input(helpers.photoUserUpdateInputSchema)
    .output(
      z.object({
        photo: helpers.photoSensitiveSchema,
      })
    )
    .mutation(async ({ input: { photoId, ...rest }, ctx: { user } }) => {
      const updatedPhoto = await db.transaction(async (tx) => {
        const photo = await tx.query.photos.findFirst({
          where: filters.and(
            filters.eq(schema.photos.userId, user.userId),
            filters.eq(schema.photos.photoId, photoId)
          ),
        });

        if (!photo) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User does not have photo with specified photoId.",
          });
        }

        const { publishedAt, ..._rest } = rest;
        const updateData: typeof rest = { ..._rest };
        let canUpdatePublishedAt = false;

        // Want to set published at
        if (publishedAt !== undefined) {
          // if no existing published at
          if (photo.publishedAt === null) {
            canUpdatePublishedAt = true;
          } else {
            const publishedAtDate = new Date(photo.publishedAt).getTime();

            // if old in future
            if (Date.now() < publishedAtDate) {
              // if new at in future
              if (typeof publishedAt === "string") {
                const updatedPublishedAtDate = new Date(publishedAt).getTime();
                canUpdatePublishedAt = Date.now() < updatedPublishedAtDate;
              } else {
                // or new is null
                canUpdatePublishedAt = true;
              }
            }
          }
        }

        if (canUpdatePublishedAt) {
          updateData.publishedAt = publishedAt;
        }

        const [_updatedPhoto] = await tx
          .update(schema.photos)
          .set(updateData)
          .where(
            filters.and(
              filters.eq(schema.photos.userId, user.userId),
              filters.eq(schema.photos.photoId, photoId)
            )
          )
          .returning();

        return _updatedPhoto;
      });

      return { photo: helpers.photoSensitiveSchema.parse(updatedPhoto) };
    }),

  publishPhoto: verfiedEmailProcedure
    .input(z.string())
    .output(
      z.object({
        photo: helpers.photoSensitiveSchema,
      })
    )
    .mutation(async ({ input: photoId, ctx: { user } }) => {
      const updatedPhoto = await db.transaction(async (tx) => {
        const photo = await tx.query.photos.findFirst({
          where: filters.and(
            filters.eq(schema.photos.userId, user.userId),
            filters.eq(schema.photos.photoId, photoId)
          ),
        });

        if (!photo) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User does not have photo with specified photoId.",
          });
        }

        const canPublish =
          photo.photoStatusId === constants.api.PhotoStatuses.PENDING;

        if (!canPublish) {
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            message: "Photo is not able to be published.",
          });
        }

        const [_updatedPhoto] = await tx
          .update(schema.photos)
          .set({
            photoStatusId: constants.api.PhotoStatuses.PUBLISHED,
            publishedAt: !photo.publishedAt
              ? utils.SQL_CURRENT_DATETIME_ISO_8601
              : undefined,
          })
          .where(
            filters.and(
              filters.eq(schema.photos.userId, user.userId),
              filters.eq(schema.photos.photoId, photoId)
            )
          )
          .returning();

        return _updatedPhoto;
      });

      return { photo: helpers.photoSensitiveSchema.parse(updatedPhoto) };
    }),

  sensitivePhotoById: authenticatedProcedure
    .input(z.string())
    .output(
      helpers.photoSensitiveSchema
        .extend({
          image: helpers.imagePublicSchema,
        })
        .optional()
    )
    .query(async ({ input: photoId, ctx: { user } }) => {
      const photo = await db.query.photos.findFirst({
        where: filters.and(
          filters.eq(schema.photos.userId, user.userId),
          filters.eq(schema.photos.photoId, photoId)
        ),
        with: {
          image: true,
        },
      });

      if (photo) {
        return helpers.photoSensitiveSchema
          .extend({ image: helpers.imagePublicSchema })
          .parse(photo);
      }

      return undefined;
    }),

  photoById: publicProcedure
    .input(z.string())
    .output(
      helpers.photoPublicSchema
        .extend({
          image: helpers.imagePublicSchema,
        })
        .optional()
    )
    .query(async ({ input: photoId }) => {
      const photo = await db.query.photos.findFirst({
        where: filters.eq(schema.photos.photoId, photoId),
        with: {
          image: true,
        },
      });

      if (photo) {
        return helpers.photoPublicSchema
          .extend({ image: helpers.imagePublicSchema })
          .parse(photo);
      }

      return undefined;
    }),

  list: publicProcedure
    .input(
      z
        .object({
          userId: z.string().optional(),
          isSpoiler: z.boolean().optional(),
          licenseId: z.union([z.number(), z.number().array()]).optional(),
          gameId: z.union([z.string(), z.string().array()]).optional(),
          platformId: z.union([z.string(), z.string().array()]).optional(),
          query: z.string().trim().optional(),
          orderBy: z
            .enum(["NEWEST_FIRST", "OLDEST_FIRST"])
            .default("NEWEST_FIRST"),
          offset: z.number().optional(),
          limit: z.number().max(100).default(10),
        })
        .default({})
    )
    .output(
      z.array(
        helpers.photoPublicSchema.extend({
          image: helpers.imagePublicSchema,
        })
      )
    )
    .query(async ({ input }) => {
      const offset = input.offset;
      const limit = input.limit;

      const orderBy =
        input.orderBy === "NEWEST_FIRST"
          ? [filters.desc(schema.photos.publishedAt)]
          : [filters.asc(schema.photos.publishedAt)];

      const userFilters: SQL[] = [];
      if (input.userId) {
        userFilters.push(filters.eq(schema.photos.userId, input.userId));
      }
      if (input.isSpoiler !== undefined) {
        userFilters.push(filters.eq(schema.photos.isSpoiler, input.isSpoiler));
      }
      if (input.licenseId) {
        if (Array.isArray(input.licenseId)) {
          userFilters.push(
            filters.inArray(schema.photos.licenseId, input.licenseId)
          );
        } else {
          userFilters.push(
            filters.eq(schema.photos.licenseId, input.licenseId)
          );
        }
      }
      if (input.gameId) {
        if (Array.isArray(input.gameId)) {
          userFilters.push(filters.inArray(schema.photos.gameId, input.gameId));
        } else {
          userFilters.push(filters.eq(schema.photos.gameId, input.gameId));
        }
      }
      if (input.platformId) {
        if (Array.isArray(input.platformId)) {
          userFilters.push(
            filters.inArray(schema.photos.platformId, input.platformId)
          );
        } else {
          userFilters.push(
            filters.eq(schema.photos.platformId, input.platformId)
          );
        }
      }
      if (input.query) {
        userFilters.push(
          filters.like(schema.photos.caption, `%${input.query}%`)
        );
      }

      const queryResults = await db.query.photos.findMany({
        with: {
          image: true,
        },
        where: filters.and(
          // Is published
          filters.or(
            filters.eq(
              schema.photos.photoStatusId,
              constants.api.PhotoStatuses.PUBLISHED
            ),
            filters.eq(
              schema.photos.photoStatusId,
              constants.api.PhotoStatuses.REVIEWED_AND_PUBLISHED
            )
          ),
          // Published before now
          filters.lte(
            schema.photos.publishedAt,
            utils.SQL_CURRENT_DATETIME_ISO_8601
          ),
          // Visibility is public
          filters.eq(
            schema.photos.visibilityId,
            constants.api.Visibilities.PUBLIC
          ),
          // User filters
          ...userFilters
        ),
        orderBy,
        offset,
        limit,
      });

      const photos = queryResults.map((photo) =>
        helpers.photoPublicSchema
          .extend({ image: helpers.imagePublicSchema })
          .parse(photo)
      );

      return photos;
    }),
  photoLike: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        photoId: z.string(),
      })
    )
    .output(helpers.photoLikePublicSchema.optional())
    .query(async ({ input: { photoId, userId } }) => {
      const photoLike = await db.query.photoLikes.findFirst({
        where: filters.and(
          filters.eq(schema.photoLikes.userId, userId),
          filters.eq(schema.photoLikes.photoId, photoId)
        ),
      });

      if (photoLike) {
        return helpers.photoPublicSchema.parse(photoLike);
      }

      return undefined;
    }),
  photoLikesByPhotoId: publicProcedure
    .input(z.string())
    .output(z.array(helpers.photoLikePublicSchema))
    .query(async ({ input: photoId }) => {
      const photoLikes = await db.query.photoLikes.findMany({
        where: filters.eq(schema.photoLikes.photoId, photoId),
      });

      return photoLikes.map((photoLike) =>
        helpers.photoPublicSchema.parse(photoLike)
      );
    }),
  photoLikesByUserId: publicProcedure
    .input(z.string())
    .output(z.array(helpers.photoLikePublicSchema))
    .query(async ({ input: userId }) => {
      const photoLikes = await db.query.photoLikes.findMany({
        where: filters.eq(schema.photoLikes.userId, userId),
      });

      return photoLikes.map((photoLike) =>
        helpers.photoPublicSchema.parse(photoLike)
      );
    }),
  like: authenticatedProcedure
    .input(z.string())
    .output(helpers.photoLikePublicSchema)
    .mutation(async ({ input: photoId, ctx: { user } }) => {
      const photoLike = await db.transaction(async (tx) => {
        const existingPhotoLike = await tx.query.photoLikes.findFirst({
          where: filters.and(
            filters.eq(schema.photoLikes.userId, user.userId),
            filters.eq(schema.photoLikes.photoId, photoId)
          ),
        });

        if (existingPhotoLike) {
          return existingPhotoLike;
        }

        const [newPhotoLike] = await tx
          .insert(schema.photoLikes)
          .values({
            photoId,
            userId: user.userId,
          })
          .returning();

        //  increment like count
        await tx
          .update(schema.photos)
          .set({
            likesCount: sql`${schema.photos.likesCount} + 1`,
          })
          .where(filters.eq(schema.photos.photoId, photoId));

        return newPhotoLike;
      });

      return helpers.photoPublicSchema.parse(photoLike);
    }),
  unlike: authenticatedProcedure
    .input(z.string())
    .output(z.undefined())
    .mutation(async ({ input: photoId, ctx: { user } }) => {
      await db.transaction(async (tx) => {
        const deletedPhotoLikes = await tx
          .delete(schema.photoLikes)
          .where(
            filters.and(
              filters.eq(schema.photoLikes.userId, user.userId),
              filters.eq(schema.photoLikes.photoId, photoId)
            )
          )
          .returning();

        if (deletedPhotoLikes.length) {
          //  decrement like count
          await tx
            .update(schema.photos)
            .set({
              likesCount: sql`${schema.photos.likesCount} - ${deletedPhotoLikes.length}`,
            })
            .where(filters.eq(schema.photos.photoId, photoId));
        }
      });
    }),
});
