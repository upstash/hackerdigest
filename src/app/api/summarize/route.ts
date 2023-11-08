import { NextResponse } from "next/server"
import { setArticles } from "@/commands/set"
import { getSummarizedArticles } from "@/services/summarizer"

export const maxDuration = 300

async function handler() {
  try {
    const articles = await getSummarizedArticles(10)

    if (articles) {
      await setArticles(articles)
      return NextResponse.json({ articles })
    } else {
      return NextResponse.json({}, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({}, { status: 400 })
  }
}

export const POST = handler
