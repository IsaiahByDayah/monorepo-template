import type { inferAsyncReturnType } from "@trpc/server"
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express"

const parseBearerToken = (opts: CreateExpressContextOptions) => {
  const authorizationHeader = opts.req.headers.authorization
  if (authorizationHeader?.startsWith("Bearer ")) {
    return authorizationHeader.substring(7, authorizationHeader.length)
  }
  return undefined
}

export const createContext = (opts: CreateExpressContextOptions) => {
  return {
    token: parseBearerToken(opts),
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
