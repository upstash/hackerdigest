import { redisClient } from "../libs/redis-client"
import { HackerNewsStoryWithParsedContent } from "../services/link-parser"
import { redisKey } from "./constants"

export const setArticles = async (articles: HackerNewsStoryWithParsedContent[] | undefined) => {
  const redis = redisClient()
  await redis.set(redisKey, articles)
}
