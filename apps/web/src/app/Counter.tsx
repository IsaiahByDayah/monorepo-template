"use client"

import { Button } from "@repo/ui"
import { useState } from "react"

export const Counter = () => {
  const [count, setCount] = useState(0)
  return (
    <Button
      onClick={() => {
        setCount((curr) => curr + 1)
      }}
      type="button"
    >
      Clicked {count} time{count === 1 ? "" : "s"}
    </Button>
  )
}
