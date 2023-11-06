import parse from "node-html-parser"

import { fetchTopStoriesFromLast12Hours, HackerNewsStory } from "./hackernews"

type Content = (string | string[]) | null
export type HackerNewsStoryWithRawContent = HackerNewsStory & { rawContent: Content }
export type HackerNewsStoryWithParsedContent = HackerNewsStory & { parsedContent: Content }

async function fetchInnerContent(url?: string): Promise<Content> {
  try {
    if (!url) throw new Error("URL is missing!")
    if (!isValidUrl(url)) throw new Error("URL is not valid")

    const response = await fetch(url)
    const html = await response.text()
    const root = parse(html)
    const paragraphs = root.querySelectorAll("p")

    return chunkString(paragraphs.map((p) => p.innerText).join(" "))
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function getContentsOfArticles(): Promise<
  HackerNewsStoryWithRawContent[] | undefined
> {
  const articleLinksAndTitles = await fetchTopStoriesFromLast12Hours(3)
  return await Promise.all(
    articleLinksAndTitles.map(async (article) => ({
      ...article,
      rawContent: await fetchInnerContent(article.url),
    }))
  )
}

function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString)
    return true
  } catch (err) {
    return false
  }
}

function chunkString(inputString: string, chunkSize = 4000) {
  if (inputString.length <= chunkSize) return inputString
  else {
    const chunks = []
    for (let i = 0; i < inputString.length; i += chunkSize) {
      chunks.push(inputString.slice(i, i + chunkSize))
    }
    return chunks
  }
}
