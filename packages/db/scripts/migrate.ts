import { migrate } from "drizzle-orm/libsql/migrator"

import { db } from "../src/db"

migrate(db, { migrationsFolder: "./migrations" })
  .then(() => {
    console.info("migrations finished!")
    process.exit(0)
  })
  .catch((err) => {
    console.info(err)
    process.exit(1)
  })
