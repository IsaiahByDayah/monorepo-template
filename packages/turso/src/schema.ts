import { relations } from "drizzle-orm"
import {
  index,
  int,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
  type AnySQLiteColumn,
} from "drizzle-orm/sqlite-core"

import { SQL_CURRENT_DATETIME_ISO_8601 } from "./utils"

/**
 * Define tables here
 */
