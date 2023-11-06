import { NextResponse } from "next/server"
import { verifySignatureEdge } from "@upstash/qstash/dist/nextjs"

import { getArticles } from "@/app/commands/get"
import { setArticles } from "@/app/commands/set"
import { getSummarizedArticles } from "@/app/services/summarizer"

async function handler() {
  console.log("Starting to summarize data from HackerNews")
  const articlesFromCache = await getArticles()
  if (articlesFromCache) return NextResponse.json({ articlesFromCache })

  const articles = await getSummarizedArticles(8)
  await setArticles(articles)

  return NextResponse.json({ articles })
}

export const POST = verifySignatureEdge(handler)

export const runtime = "edge"
