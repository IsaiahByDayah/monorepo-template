import { getClient } from "./client"

export const constructWebhookEvent = (
  payload: string | Buffer,
  signiture: string | Buffer | string[],
) => {
  if (!process.env.STRIPE_ENDPOINT_SECRET) {
    throw new Error(
      "Could not create stripe sdk instance. STRIPE_ENDPOINT_SECRET env missing.",
    )
  }

  return getClient().webhooks.constructEvent(
    payload,
    signiture,
    process.env.STRIPE_ENDPOINT_SECRET,
  )
}
