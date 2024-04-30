// import { constants } from "@repo/utils"
// import type { BatchItem } from "drizzle-orm/batch"

// import { db } from "../src/db"
// import { table } from "../src/schema"

// type Batch = [BatchItem<"sqlite">, ...BatchItem<"sqlite">[]]

// const TABLE_INSERTS: (typeof table.$inferInsert)[] = [
//   {
//     ...some data
//   },
//   {
//     ...some data
//   },
//   ...
// ]

// const seed = async () =>
//   db.batch(
//     TABLE_INSERTS.map(
//       (insertData) =>
//         db.insert(table).values(insertData).onConflictDoUpdate({
//           target: table.id,
//           set: insertData,
//         }) as BatchItem<"sqlite">,
//     ) as Batch,
//   )

// export default seed
