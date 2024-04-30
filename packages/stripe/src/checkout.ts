import type Stripe from "stripe"

import { getClient } from "./client"

export interface CreateCheckoutSessionParams {
  customerId: string
  priceId: string
  successUrl: `${string}?session_id={CHECKOUT_SESSION_ID}`
  cancelUrl: string
  trialDays?: number
}

export const createSession = ({
  cancelUrl,
  customerId,
  priceId,
  successUrl,
  trialDays,
}: CreateCheckoutSessionParams) => {
  const params: Stripe.Checkout.SessionCreateParams = {
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
    success_url: successUrl,
    cancel_url: cancelUrl,
  }

  if (trialDays && trialDays > 0) {
    params.subscription_data = {
      trial_period_days: trialDays,
    }
  }

  return getClient().checkout.sessions.create(params)
}
