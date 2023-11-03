import { OpenAI } from "openai"

import { getContentsOfArticles, SummarizedArticle } from "@/app/services/utils"

export type Content = { content: string | null; title: string; originalLink?: string }
export type ContentWithoutLink = Omit<Content, "originalLink">
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION_API,
})

async function summarizeText(
  title: string,
  content: string
): Promise<ContentWithoutLink | undefined> {
  const prompt = `
  Title: "${title}"
  Can you summarize the key points and main ideas of the following text in a concise and clear manner without omitting any important information? '${content}'`

  try {
    const chatCompletion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      temperature: 0.3,
      top_p: 0.95,
      frequency_penalty: 0.5,
      presence_penalty: 0,
      max_tokens: 200,
      stream: false,
      n: 1,
    })
    return { content: chatCompletion.choices[0]?.text || null, title }
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
    temperature: 0.3,
    top_p: 0.95,
    frequency_penalty: 0.5,
    presence_penalty: 0,
    max_tokens: 200,
    stream: false,
    n: 1,
  })
  return chatCompletion.choices[0]?.text
}

async function summarizeArticles(article: SummarizedArticle): Promise<Content | undefined> {
  if (!Array.isArray(article.content)) {
    try {
      if (!article.content) throw new Error("Content is missing from summarizeArticles!")
      const summarizedText = await summarizeText(article.title, article.content)
      if (!summarizedText) throw new Error("summarizedText is missing!")
      return { ...summarizedText, originalLink: article.href }
    } catch (error) {
      console.error(
        `Something went wrong when summarizing single article ${(error as Error).message}`
      )
    }
  } else {
    const summarizedChunks = await Promise.all(
      article.content.map((chunk) => summarizeChunk(chunk))
    )

    try {
      const summarizedText = await summarizeText(
        article.title,
        summarizedChunks.filter(Boolean).join(" ")
      )
      if (!summarizedText) throw new Error("chunkedSummarizedText is missing!")
      return { ...summarizedText, originalLink: article.href }
    } catch (error) {
      console.error(
        `Something went wrong when summarizing chunked articles ${(error as Error).message}`
      )
    }
  }
}

export async function finalize() {
  const res = await getContentsOfArticles()
  if (res && res.length > 0) {
    // Summarize all articles in parallel
    const summarizedArticles = await Promise.all(
      res.map((article) => {
        if (article.title && article.content) {
          return summarizeArticles(article)
        }
        return null
      })
    )

    return summarizedArticles.filter(Boolean) as Content[]
  }
}
