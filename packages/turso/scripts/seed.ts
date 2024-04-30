import fs from "node:fs/promises"
import path from "node:path"

console.info("Seeding database...")

try {
  const seedsDirectoryPath = path.resolve(process.cwd(), "./seeds")

  const files = await fs.readdir(seedsDirectoryPath)

  files.sort()

  for (const file of files) {
    const filePath = path.join(seedsDirectoryPath, file)
    const relativeFilePath = path.relative(process.cwd(), filePath)

    if (file.endsWith(".ts")) {
      // eslint-disable-next-line no-await-in-loop -- Needed for lazy importing of seed scripts
      const module = (await import(filePath)) as NodeModule

      if ("default" in module && typeof module.default === "function") {
        // eslint-disable-next-line no-await-in-loop -- Needed to wait for seeds to finish before continuing to next
        await module.default()

        console.info(relativeFilePath)
      }
    }
  }
} catch (error) {
  console.info("Error seeding database:", error)
  process.exit(1)
}

console.info("Seeding finished!")
process.exit(0)
