import ky from "ky"

const HN_BASE_URL = "https://hacker-news.firebaseio.com/v0/"

export const requester = ky.create({
  cache: "no-cache",
  prefixUrl: HN_BASE_URL,
  headers: {
    pragma: "no-cache",
  },
})
