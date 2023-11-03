import { getArticles } from "../commands/get"

export async function getAllSummarizedArticles() {
  const articlesFromCache = await getArticles()

  if (!articlesFromCache) {
    throw new Error("Failed to fetch data")
  }

  return articlesFromCache
}
