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

export function timeUntilNextFetch(): string {
  const now = new Date()
  let nextFetchDate = new Date()

  nextFetchDate.setHours(0, 0, 0, 0)

  while (nextFetchDate <= now) {
    nextFetchDate.setHours(nextFetchDate.getHours() + 6)
  }

  const diff = nextFetchDate.getTime() - now.getTime()

  const hoursLeft = Math.floor(diff / (3600 * 1000))
  const minutesLeft = Math.floor((diff % (3600 * 1000)) / (60 * 1000))

  let timeLeftString = ""
  if (hoursLeft > 0) {
    timeLeftString += hoursLeft + " hour(s) "
  }
  if (minutesLeft > 0) {
    timeLeftString += "and " + minutesLeft + " minute(s) "
  }

  timeLeftString = timeLeftString.trim() + " left until refresh"

  return timeLeftString
}