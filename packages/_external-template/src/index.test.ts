import assert from "node:assert/strict"
import test, { describe } from "node:test"

import { goodbye } from "./index.js"

void describe("External Template", () => {
  void test("goodbye", () => {
    const msg = goodbye()
    assert(typeof msg === "string")
  })
})
