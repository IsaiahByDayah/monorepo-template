import assert from "node:assert/strict"
import test, { describe } from "node:test"

import { hello } from "./index"

void describe("Library Template", () => {
  void test("hello", () => {
    const str = hello()
    assert(typeof str === "string")
  })
})
