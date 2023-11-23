import { requester } from "@/app/libs/requester"

type HackerNewsStoryRaw = {
  id: number
  by: string // Author of the story
  score: number
  time: number
  title: string
  url: string
  descendants: number // Number of comments
  type: "story" | "comment" // Ensures the type is strictly 'story'
  kids: number[]
}

type HackerNewsComment = {
  id: number
  by: string // Author of the story
  time: string
  type: "story" | "comment"
  text: string
}

export type HackerNewsStory = {
  author: string
  score: number
  title: string
  url: string
  numOfComments: number
  commentUrl: string
  postedDate: string
  comments: (HackerNewsComment | null)[]
}

// Fetch the top story IDs
async function fetchTopStoryIds(): Promise<number[]> {
  const storyIds: number[] = await requester.get(`topstories.json`).json()
  return storyIds
}

// Fetch story details by ID
async function fetchStoryDetails(id: number): Promise<HackerNewsStoryRaw | null> {
  const story: HackerNewsStoryRaw | null = await requester.get(`item/${id}.json`).json()
  // Check if the story has a URL and is of type 'story'
  if (story && story.url && story.type === "story") {
    return story
  }
  return null
}

// Fetch top 3 comments by ID
async function fetchTopThreeComments(ids: number[]): Promise<HackerNewsComment[]> {
  const comments = (await Promise.all(
    ids.map((id) => requester.get(`item/${id}.json`).json())
  )) as HackerNewsComment[]

  return comments
    .map(
      (comment) =>
        comment && {
          by: comment.by,
          //@ts-ignore
          time: timeSince((comment.time as number) * 1000),
          id: comment.id,
          type: comment.type,
          text: comment.text,
        }
    )
    .filter(Boolean)
}

// Fetch top stories from the last 12 hours
export async function fetchTopStoriesFromLast12Hours(
  limit: number = 10
): Promise<HackerNewsStory[]> {
  const twelveHoursAgoTimestamp = Date.now() - 12 * 60 * 60 * 1000
  const topStoryIds = await fetchTopStoryIds()

  const storyDetailsPromises = topStoryIds.map(fetchStoryDetails)
  const allStories = (await Promise.all(storyDetailsPromises)).filter((story) => story !== null)

  const topStoriesFromLast12Hours = allStories
    .filter((story) => story && story.time * 1000 >= twelveHoursAgoTimestamp)
    .sort((a, b) => b!.score - a!.score)
    .slice(0, limit) as HackerNewsStoryRaw[]

  const topStoriesWithCommentsPromises = topStoriesFromLast12Hours.map(async (story) => {
    const comments = await fetchTopThreeComments(story.kids.slice(0, 3))
    return {
      comments,
      commentUrl: `https://news.ycombinator.com/item?id=${story.id}`,
      postedDate: timeSince(story.time * 1000),
      numOfComments: story.descendants,
      author: story.by,
      url: story.url,
      title: story.title,
      score: story.score,
    }
  })

  const topStoriesWithComments = await Promise.all(topStoriesWithCommentsPromises)

  return topStoriesWithComments
}

export function timeSince(date: number) {
  var seconds = Math.floor((new Date().valueOf() - date) / 1000)

  var interval = seconds / 31536000

  if (interval > 1) {
    return Math.floor(interval) + " year(s) ago"
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + " month(s) ago"
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + " day(s) ago"
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + " hour(s) ago"
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + " minute(s) ago"
  }
  return Math.floor(seconds) + " second(s) ago"
}
