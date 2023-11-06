import { NextResponse } from "next/server"
import { verifySignatureEdge } from "@upstash/qstash/dist/nextjs"

import { setArticles } from "@/app/commands/set"
import { getSummarizedArticles } from "@/app/services/summarizer"

async function handler() {
  console.log("Starting to summarize data from HackerNews")

  const articles = await getSummarizedArticles(10)
  await setArticles(articles)

  return NextResponse.json({ articles })
}

export const POST = verifySignatureEdge(handler)

export const runtime = "edge"
