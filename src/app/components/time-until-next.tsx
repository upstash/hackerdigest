"use client"

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

export const TimeUntilNext = () => {
  return <div className="absolute right-5 top-5 text-sm">{timeUntilNextFetch()}</div>
}
