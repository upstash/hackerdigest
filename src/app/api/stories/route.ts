import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0]

  return NextResponse.json({ ip })
}
