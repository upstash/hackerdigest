import { NextRequest, NextResponse } from "next/server"
import { setArticles } from "@/commands/set"
import { getSummarizedArticles } from "@/services/summarizer"
import { Receiver } from "@upstash/qstash/."

export const maxDuration = 299
export const dynamic = "force-dynamic"

async function handler(req: NextRequest) {
  console.log("Starting to summarize data from HackerNews")

  const receiver = new Receiver({
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
  })

  // @ts-ignore This can throw errors during vercel build
  const signature = req.headers.get("upstash-signature")
  console.log({ signature })
  if (!signature) {
    return new NextResponse(new TextEncoder().encode("`Upstash-Signature` header is missing"), {
      status: 403,
    })
  }
  if (typeof signature !== "string") {
    throw new Error("`Upstash-Signature` header is not a string")
  }

  const body = await req.text()
  const isValid = await receiver.verify({
    signature,
    body,
  })
  console.log({ isValid })
  if (!isValid) {
    return new NextResponse(new TextEncoder().encode("invalid signature"), { status: 403 })
  }

  const articles = await getSummarizedArticles(10)
  if (articles) {
    await setArticles(articles)
    return NextResponse.json({ articles })
  } else {
    console.error("Something went wrong articles are missing!")
    return NextResponse.json({})
  }
}

export const POST = handler
