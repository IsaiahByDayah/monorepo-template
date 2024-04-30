import { getClient } from "./client"

export const createCustomer = (userId: string) =>
  getClient().customers.create({
    metadata: {
      userId,
    },
  })

export const deleteCustomer = (customerId: string) =>
  getClient().customers.del(customerId)

export const createBillingPortalSession = (
  customerId: string,
  returnUrl?: string,
) =>
  getClient().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
