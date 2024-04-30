import assert from "node:assert/strict"
import test, { describe } from "node:test"

import { hello } from "./index.js"

void describe("Internal Template", () => {
  void test("hello", () => {
    const msg = hello()
    assert(typeof msg === "string")
  })
})
