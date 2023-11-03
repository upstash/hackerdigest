import { redisClient } from "../libs/redis-client"
import { Content } from "../services/summarizer"
import { redisKey } from "./constants"

export const getArticles = async () => {
  const redis = redisClient()
  return await redis.get<(Content | null)[]>(redisKey)
}
