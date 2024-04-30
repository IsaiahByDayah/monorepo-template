import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import * as schema from "./schema"

// TODO: remove this once confirmed I dont need it. I think this was needed when originally tried to include db in trpc context
// export { type LibSQLDatabase } from "drizzle-orm/libsql"

const client = createClient({
  url: process.env.DATABASE_URL ?? "",
  authToken: process.env.DATABASE_AUTH_TOKEN,
})

export const db = drizzle(client, { schema })
