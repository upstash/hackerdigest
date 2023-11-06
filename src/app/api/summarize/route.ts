import { NextRequest, NextResponse } from "next/server"
import { setArticles } from "@/commands/set"
import { getSummarizedArticles } from "@/services/summarizer"
import { Receiver } from "@upstash/qstash/."

export const maxDuration = 150

async function handler(req: NextRequest) {
  console.log("Starting to summarize data from HackerNews")
  const startDate = Date.now()

  const receiver = new Receiver({
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
  })

  const signature = req.headers.get("Upstash-Signature")
  if (!signature) {
    return new NextResponse(new TextEncoder().encode("`Upstash-Signature` header is missing"), {
      status: 403,
    })
  }
  if (typeof signature !== "string") {
    throw new Error("`Upstash-Signature` header is not a string")
  }
  const body = await req.text()
  await receiver.verify({
    signature,
    body,
  })

  const articles = await getSummarizedArticles(10)

  if (articles) {
    console.log(articles, { elapsedTimeInMS: startDate - Date.now() })
    await setArticles(articles)
    return NextResponse.json({})
  } else {
    console.error("Something went wrong articles are missing!")
    return NextResponse.json({})
  }
}

export const POST = handler
