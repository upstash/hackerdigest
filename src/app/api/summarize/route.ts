import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 299

async function handler(req: NextRequest) {
  console.log("Starting to summarize data from HackerNews")

  //   const receiver = new Receiver({
  //     currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  //     nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
  //   })

  const signature = req.headers.get("Upstash-Signature")
  if (!signature) {
    return new NextResponse(new TextEncoder().encode("`Upstash-Signature` header is missing"), {
      status: 403,
    })
  }
  if (typeof signature !== "string") {
    throw new Error("`Upstash-Signature` header is not a string")
  }
  NextResponse.json({ hello: "world", signature })
  //   const body = await req.text()
  //   const isValid = await receiver.verify({
  //     signature,
  //     body,
  //   })

  //   if (!isValid) {
  //     return new NextResponse(new TextEncoder().encode("invalid signature"), { status: 403 })
  //   }
  //   NextResponse.json({ hello: "world" })
  //   const articles = await getSummarizedArticles(10)
  //   if (articles) {
  //     await setArticles(articles)
  //     return
  //   } else {
  //     console.error("Something went wrong articles are missing!")
  //     return NextResponse.json({})
  //   }
}

export const POST = handler
