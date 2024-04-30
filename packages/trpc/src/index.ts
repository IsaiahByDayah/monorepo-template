/**
 * NOTE: this is a fix for issue when importing `trpc-openapi`. Not sure why (my guess is they internally reference "\@trpc/server/src" cirectly and that causes issues)
 * REF: https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1885252911
 */
declare module "@trpc/server/src" {}

export * from "./client"
export * from "./constants"
export * from "./server"
