import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { getAllSummarizedArticles } from "@/app/actions/get-all-summarized-articles";

export async function GET(req: NextRequest) {
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "10s"),
    prefix: "hackerdigest-stories",
    analytics: true,
  });

  const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ message: "You shall not pass!" });
  }
  const { stories } = await getAllSummarizedArticles();

  return NextResponse.json({ stories });
}
