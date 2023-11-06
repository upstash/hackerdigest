import { NextResponse } from "next/server"
import { setArticles } from "@/commands/set"
import { getSummarizedArticles } from "@/services/summarizer"
import { verifySignatureEdge } from "@upstash/qstash/dist/nextjs"

async function handler() {
  console.log("Starting to summarize data from HackerNews")

  const articles = await getSummarizedArticles(10)
  if (articles) {
    await setArticles(articles)
    return NextResponse.json({ articles })
  } else {
    console.error("Something went wrong articles are missing!")
    return NextResponse.json({})
  }
}

export const POST = verifySignatureEdge(handler)

export const runtime = "edge"
