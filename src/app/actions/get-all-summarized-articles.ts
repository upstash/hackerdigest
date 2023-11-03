import { getArticles } from "../commands/get"
import { redisClient } from "../libs/redis-client"
import { Content } from "../services/summarizer"

export async function getAllSummarizedArticles() {
  const articlesFromCache = await getArticles()

  if (!articlesFromCache) {
    throw new Error("Failed to fetch data")
  }

  return articlesFromCache
}
