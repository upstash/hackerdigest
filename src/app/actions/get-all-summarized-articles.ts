import { getArticles } from "../../commands/get"

export async function getAllSummarizedArticles() {
  const res = await getArticles()
  return { stories: res?.stories, lastFetched: res?.lastFetched }
}
