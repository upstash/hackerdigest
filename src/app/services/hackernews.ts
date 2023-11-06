const HN_BASE_URL = "https://hacker-news.firebaseio.com/v0"

type HackerNewsStoryRaw = {
  id: number
  by: string // Author of the story
  score: number
  time: number
  title: string
  url: string
  descendants: number // Number of comments
  type: "story" // Ensures the type is strictly 'story'
}

export type HackerNewsStory = {
  author: string
  score: number
  title: string
  url: string
  numOfComments: number
  commentUrl: string
  postedDate: string
}

// Fetch the top story IDs
async function fetchTopStoryIds(): Promise<number[]> {
  const response = await fetch(`${HN_BASE_URL}/topstories.json`)
  const storyIds: number[] = await response.json()
  return storyIds
}

// Fetch story details by ID
async function fetchStoryDetails(id: number): Promise<HackerNewsStoryRaw | null> {
  const response = await fetch(`${HN_BASE_URL}/item/${id}.json`)
  const story = await response.json()
  // Check if the story has a URL and is of type 'story'
  if (story && story.url && story.type === "story") {
    return story
  }
  return null
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

  return topStoriesFromLast12Hours.map((story) => ({
    commentUrl: `https://news.ycombinator.com/item?id=${story.id}`,
    postedDate: timeSince(story.time * 1000),
    numOfComments: story.descendants,
    author: story.by,
    url: story.url,
    title: story.title,
    score: story.score,
  }))
}

function timeSince(date: number) {
  var seconds = Math.floor((new Date().valueOf() - date) / 1000)

  var interval = seconds / 31536000

  if (interval > 1) {
    return Math.floor(interval) + " year(s)"
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + " month(s)"
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + " day(s)"
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + " hour(s)"
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + " minute(s)"
  }
  return Math.floor(seconds) + " second(s)"
}
