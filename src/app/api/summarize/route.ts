import { NextResponse } from "next/server"
import { setArticles } from "@/commands/set"
import { getSummarizedArticles } from "@/services/summarizer"

async function handler() {
  //   console.log("starting")
  //   const receiver = new Receiver({
  //     currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  //     nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
  //   })

  //   const signature = req.headers.get("Upstash-Signature")
  //   if (!signature) {
  //     return new NextResponse(new TextEncoder().encode("`Upstash-Signature` header is missing"), {
  //       status: 403,
  //     })
  //   }
  //   if (typeof signature !== "string") {
  //     throw new Error("`Upstash-Signature` header is not a string")
  //   }
  //   const body = await req.text()
  //   await receiver.verify({
  //     signature,
  //     body,
  //   })

  try {
    const articles = await getSummarizedArticles(1)

    if (articles) {
      console.log("articles", articles)
      await setArticles(articles)
      console.log("returning articles")
      return NextResponse.json({}, { status: 204 })
    } else {
      console.error("Something went wrong articles are missing!")
      return NextResponse.json({ message: "asdasdas" }, { status: 400 })
    }
  } catch (error) {
    console.log("error", (error as Error).message)
    return NextResponse.json({}, { status: 400 })
  }
}

export const POST = handler
