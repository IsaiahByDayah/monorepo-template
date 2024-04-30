import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export { type z } from "zod"

/**
 * Add helper schemas here
 */

// import { users } from "./schema"

// export const userSchema = createSelectSchema(users)

// export const userPublicSchema = userSchema.pick({
//   // Public Knowledge
//   userId: true,
//   username: true,
//   displayName: true,
//   bio: true,
//   avatar: true,
//   createdAt: true,
// })

// export const userSensitiveSchema = userPublicSchema.extend(
//   userSchema.pick({
//     // Sensitive Information
//     email: true,
//     emailVerified: true,
//     firstName: true,
//     lastName: true,
//     updatedAt: true,
//     stripeCustomerId: true,
//     stripeSubscriptionId: true,
//     stripeSubscriptionStatus: true,
//     stripeCurrentPeriodEnd: true,
//     stripeCancelAtPeriodEnd: true,
//     stripeProductId: true,
//     stripePriceId: true,
//     isTrialAvailable: true,
//   }).shape,
// )
