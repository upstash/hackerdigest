import { redisClient } from "../libs/redis-client"
import { HackerNewsStoryWithParsedContent } from "../services/link-parser"
import { redisKey } from "./constants"

export const getArticles = async () => {
  const redis = redisClient()
  return await redis.get<(HackerNewsStoryWithParsedContent | null)[]>(redisKey)
}
