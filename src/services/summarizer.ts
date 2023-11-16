import {
  getContentsOfArticles,
  HackerNewsStoryWithParsedContent,
  HackerNewsStoryWithRawContent,
} from "@/services/link-parser"
import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION_API,
})

async function summarizeText(title: string, content: string): Promise<string | undefined> {
  const prompt = `
  Title: "${title}"
  Summarize the following news article in 2-3 clear and concise sentences without repetition: "${content}"`

  try {
    const chatCompletion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      temperature: 0.2,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 150,
      stream: false,
      n: 1,
    })
    return chatCompletion.choices[0]?.text
  } catch (error) {
    console.error("summarizeText failed", (error as Error).message)
  }
}

async function summarizeChunk(chunk?: string) {
  if (!chunk) return null

  const prompt = `
      Please provide a concise summary of the following text and please ensure that the summary avoids any unnecessary information or repetition: "${chunk}"
      `
  const chatCompletion = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt,
    temperature: 0.2,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 300,
    stream: false,
    n: 1,
  })
  return chatCompletion.choices[0]?.text
}

async function summarizeArticles(
  article: HackerNewsStoryWithRawContent
): Promise<string | undefined> {
  if (!Array.isArray(article.rawContent)) {
    try {
      if (!article.rawContent) throw new Error("Content is missing from summarizeArticles!")
      const summarizedText = await summarizeText(article.title, article.rawContent)
      if (!summarizedText) throw new Error("summarizedText is missing!")
      return summarizedText
    } catch (error) {
      console.error(
        `Something went wrong when summarizing single article ${(error as Error).message}`
      )
    }
  } else {
    const summarizedChunks = await Promise.all(
      article.rawContent.map((chunk) => summarizeChunk(chunk))
    )

    try {
      const summarizedText = await summarizeText(
        article.title,
        summarizedChunks.filter(Boolean).join(" ")
      )
      if (!summarizedText) throw new Error("chunkedSummarizedText is missing!")
      return summarizedText
    } catch (error) {
      console.error(
        `Something went wrong when summarizing chunked articles ${(error as Error).message}`
      )
    }
  }
}

export async function getSummarizedArticles(
  articleLimit: number
): Promise<HackerNewsStoryWithParsedContent[] | undefined> {
  const res = await getContentsOfArticles(articleLimit)
  if (res && res.length > 0) {
    const summarizedArticlesPromises = res.map(async (article) => {
      if (article.rawContent) {
        // eslint-disable-next-line no-unused-vars
        const { rawContent, ...articleWithoutRawContent } = article
        const parsedContent = await summarizeArticles(article)
        return { parsedContent, ...articleWithoutRawContent }
      }
      return null
    })

    const summarizedArticles = await Promise.all(summarizedArticlesPromises)

    return summarizedArticles.filter(Boolean) as HackerNewsStoryWithParsedContent[]
  }
}
