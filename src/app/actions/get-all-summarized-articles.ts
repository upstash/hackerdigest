import { getArticles } from "../commands/get"

export async function getAllSummarizedArticles() {
  const articlesFromCache = await getArticles()

  if (!articlesFromCache) {
    return []
  }

  return articlesFromCache
}
