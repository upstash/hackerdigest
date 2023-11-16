// import { NextResponse } from "next/server"
// import { setArticles } from "@/commands/set"
// import { getSummarizedArticles } from "@/services/summarizer"

import { NextResponse } from "next/server"
import { fetchTopStoriesFromLast12Hours } from "@/services/hackernews"

export const maxDuration = 300

async function handler() {
  return NextResponse.json(await fetchTopStoriesFromLast12Hours())
  //   try {
  //     const articles = await getSummarizedArticles(10)
  //     if (articles) {
  //       await setArticles(articles)
  //       return NextResponse.json({ articles })
  //     } else {
  //       return NextResponse.json({}, { status: 400 })
  //     }
  //   } catch (error) {
  //     return NextResponse.json({}, { status: 400 })
  //   }
}

export const GET = handler
