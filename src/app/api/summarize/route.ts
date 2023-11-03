import { getArticles } from "@/app/commands/get"
import { setArticles } from "@/app/commands/set"
import { redisClient } from "@/app/libs/redis-client"
import { finalize } from "@/app/services/summarizer"

export async function GET() {
  const redis = redisClient()
  const articlesFromCache = await getArticles()
  if (articlesFromCache) return Response.json({ articlesFromCache })

  const articles = await finalize()
  await setArticles(articles)

  return Response.json({ articles })
}
