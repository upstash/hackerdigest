import { NextRequest, NextResponse } from "next/server"
import { Receiver } from "@upstash/qstash/."

export const maxDuration = 150

async function handler(req: NextRequest) {
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
  const isValid = await receiver.verify({
    signature,
    body,
  })

  console.log({ body, signature, isValid })
  return NextResponse.json({})
  //
  //   const articles = await getSummarizedArticles(10)

  //   if (articles) {
  //     console.log(articles)
  //     await setArticles(articles)
  //     return NextResponse.json({})
  //   } else {
  //     console.error("Something went wrong articles are missing!")
  //     return NextResponse.json({})
  //   }
}

export const POST = handler
