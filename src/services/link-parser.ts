import parse, { HTMLElement } from "node-html-parser"

import { fetchTopStoriesFromLast12Hours, HackerNewsStory } from "./hackernews"

type Content = (string | string[]) | null
export type HackerNewsStoryWithRawContent = HackerNewsStory & { rawContent: Content }
export type HackerNewsStoryWithParsedContent = HackerNewsStory & {
  parsedContent: Content
}

async function fetchInnerContent(url?: string): Promise<string | string[] | null> {
  if (!url) throw new Error("URL is missing!")
  if (!isValidUrl(url)) throw new Error("URL is not valid")

  try {
    const response = await fetch(url)
    const html = await response.text()
    const root = parse(html)

    let content = extractText(root.querySelectorAll("p"))

    if (!content) {
      // If no content was found in <p> tags, fallback to <div> tags
      content = extractText(root.querySelectorAll("div"))
    }

    // Assuming chunkString splits the string into manageable pieces
    return chunkString(content) // Ensure chunkString handles an empty string properly
  } catch (error) {
    console.error("Error fetching content:", error)
    return null
  }
}

export async function getContentsOfArticles(
  articleLimit: number
): Promise<HackerNewsStoryWithRawContent[] | undefined> {
  const articleLinksAndTitles = await fetchTopStoriesFromLast12Hours(articleLimit)
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

// A function to clean and prepare text content
function cleanText(text: string) {
  return text.replace(/\s+/g, " ").trim()
}

// A function to extract text from a collection of nodes
function extractText(nodes: HTMLElement[]) {
  return nodes.map((node) => cleanText(node.innerText)).join(" ")
}
