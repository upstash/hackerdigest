import { redisClient } from "../app/libs/redis-client"
import { HackerNewsStoryWithParsedContent } from "../services/link-parser"
import { redisKey } from "./constants"
import { ArticlesType } from "./get"

export const setArticles = async (stories: HackerNewsStoryWithParsedContent[]) => {
  const redis = redisClient()
  await redis.set<ArticlesType>(redisKey, { stories, lastFetched: new Date().toJSON() })
}
