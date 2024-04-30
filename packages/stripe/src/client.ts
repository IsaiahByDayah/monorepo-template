import Stripe from "stripe"

let _client: Stripe | undefined

export const getClient = () => {
  if (_client) {
    return _client
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "Could not create stripe sdk instance. STRIPE_SECRET_KEY env missing.",
    )
  }

  _client = new Stripe(process.env.STRIPE_SECRET_KEY)

  return _client
}
