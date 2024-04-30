import {
  createTRPCProxyClient,
  httpBatchLink,
  type HTTPBatchLinkOptions,
} from "@trpc/client"
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"
import superjson from "superjson"

import { TRPC_PATH } from "../constants"
import type { AppRouter } from "../server"

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>

//     👆 **type-only** import
// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.

const getBaseUrl = () => {
  const baseUrl = process.env.API_BASE_URL ?? "http://localhost"
  const port = process.env.API_PORT
  return `${baseUrl}${port ? `:${port}` : ""}`
}

export const createClient = (
  options: Partial<Omit<HTTPBatchLinkOptions, "url">>,
) =>
  createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}${TRPC_PATH}`,
        ...options,
      }),
    ],
  })
