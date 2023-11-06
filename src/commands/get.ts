import { redisClient } from "../app/libs/redis-client"
import { HackerNewsStoryWithParsedContent } from "../services/link-parser"
import { redisKey } from "./constants"

export type ArticlesType = {
  stories: (HackerNewsStoryWithParsedContent | null)[]
  lastFetched: string
}

export const getArticles = async () => {
  const redis = redisClient()
  return await redis.get<ArticlesType>(redisKey)
}
