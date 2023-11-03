import { redisClient } from "../libs/redis-client"
import { Content } from "../services/summarizer"
import { redisKey } from "./constants"

export const setArticles = async (articles: Content[] | undefined) => {
  const redis = redisClient()
  await redis.set(redisKey, articles)
}
