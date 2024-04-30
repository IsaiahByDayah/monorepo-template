import { sql } from "drizzle-orm"

export const SQL_CURRENT_DATETIME_ISO_8601 = sql`(strftime('%Y-%m-%dT%H:%M:%fZ'))`
