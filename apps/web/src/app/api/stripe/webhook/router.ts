import "@repo/stripe"

import { NextResponse, type NextRequest } from "next/server"

export const POST = (req: NextRequest) => {
  console.log("[stripe webhook request]: ", req)
  return new NextResponse("", { status: 200, statusText: "success" })
}
