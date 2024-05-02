import { relations } from "drizzle-orm"
import {
  index,
  int,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core"

import { SQL_CURRENT_DATETIME_ISO_8601 } from "./utils"

export const users = sqliteTable(
  "users",
  {
    // Public Knowledge
    userId: text("user_id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    username: text("username").unique().notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(SQL_CURRENT_DATETIME_ISO_8601),
    // Sensitive Information
    email: text("email").unique().notNull(),
    emailVerified: int("email_verified", { mode: "boolean" })
      .notNull()
      .default(false),
    // Internal Data
    updatedAt: text("updated_at")
      .notNull()
      .$onUpdate(() => SQL_CURRENT_DATETIME_ISO_8601),
    isAdmin: int("is_admin", { mode: "boolean" }).notNull().default(false),
  },
  (table) => ({
    usernameIdx: uniqueIndex("users_username_idx").on(table.username),
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
  }),
)

export const usersRelations = relations(users, ({ one }) => ({
  stripeCustomer: one(stripeCustomers),
}))

export const stripeCustomers = sqliteTable(
  "stripe_customers",
  {
    // Sensitive Information
    stripeCustomerId: text("stripe_customer_id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => users.userId),
    stripeSubscriptionId: text("stripe_subscription_id"),
    stripeSubscriptionStatus: text("stripe_subscription_status", {
      enum: [
        "incomplete",
        "incomplete_expired",
        "trialing",
        "active",
        "past_due",
        "canceled",
        "unpaid",
      ],
    }),
    stripeCurrentPeriodEnd: int("stripe_current_period_end", {
      mode: "timestamp",
    }),
    stripeCancelAtPeriodEnd: int("stripe_cancel_at_period_end", {
      mode: "boolean",
    }),
    stripeProductId: text("stripe_product_id"),
    stripePriceId: text("stripe_price_id"),
    isTrialAvailable: int("is_trial_available", { mode: "boolean" })
      .notNull()
      .default(true),
    // Internal Data
    createdAt: text("created_at")
      .notNull()
      .default(SQL_CURRENT_DATETIME_ISO_8601),
    updatedAt: text("updated_at")
      .notNull()
      .$onUpdate(() => SQL_CURRENT_DATETIME_ISO_8601),
  },
  (table) => ({
    userIdIdx: uniqueIndex("stripe_customers_user_id_idx").on(table.userId),
    stripeSubscriptionIdIdx: uniqueIndex(
      "stripe_customers_stripe_subscription_id_idx",
    ).on(table.stripeSubscriptionId),
    stripeSubscriptionStatusIdx: index(
      "stripe_customers_stripe_subscription_status_idx",
    ).on(table.stripeSubscriptionStatus),
    stripeCurrentPeriodEndIdx: index(
      "stripe_customers_stripe_current_period_end_idx",
    ).on(table.stripeCurrentPeriodEnd),
    stripeCancelAtPeriodEndIdx: index(
      "stripe_customers_stripe_cancel_at_period_end_idx",
    ).on(table.stripeCancelAtPeriodEnd),
    stripeProductIdIdx: index("stripe_customers_stripe_product_id_idx").on(
      table.stripeProductId,
    ),
    stripePriceIdIdx: index("stripe_customers_stripe_price_id_idx").on(
      table.stripePriceId,
    ),
    isTrialAvailableIdx: index("stripe_customers_is_trial_available_idx").on(
      table.isTrialAvailable,
    ),
  }),
)

export const stripeCustomersRelations = relations(
  stripeCustomers,
  ({ one }) => ({
    user: one(users),
  }),
)
