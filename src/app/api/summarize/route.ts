import { NextResponse } from "next/server"
import { setArticles } from "@/commands/set"
import { getSummarizedArticles } from "@/services/summarizer"
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs"

export const maxDuration = 300

async function handler() {
  try {
    const articles = await getSummarizedArticles(15)
    if (articles) {
      await setArticles(articles)
      return NextResponse.json({ articles })
    } else {
      console.error("Stories are missing!")
      return NextResponse.json({}, { status: 400 })
    }
  } catch (error) {
    console.error(
      `Something went wrong when saving to cache or retriving stories ${(error as Error).message}`
    )
    return NextResponse.json({}, { status: 400 })
  }
}

export const POST = verifySignatureAppRouter(handler)
