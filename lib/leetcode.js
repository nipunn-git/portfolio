// LeetCode API client — uses the unofficial public GraphQL endpoint
const LEETCODE_USERNAME = "nipunndhiman"
const LEETCODE_GRAPHQL = "https://leetcode.com/graphql"

const cache = {}
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

function getCached(key) {
  const entry = cache[key]
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    delete cache[key]
    return null
  }
  return entry.data
}

function setCache(key, data) {
  cache[key] = { data, timestamp: Date.now() }
}

async function lcQuery(query, variables = {}) {
  const res = await fetch(LEETCODE_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Referer": "https://leetcode.com",
      "x-csrftoken": "dummy",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 600 },
  })
  if (!res.ok) throw new Error(`LeetCode API error: ${res.status}`)
  return res.json()
}

export async function getLeetCodeStats() {
  const cacheKey = "lc_stats"
  const cached = getCached(cacheKey)
  if (cached) return cached

  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        profile {
          ranking
          reputation
          starRating
        }
      }
      userContestRanking(username: $username) {
        rating
        globalRanking
        totalParticipants
        topPercentage
      }
      recentSubmissionList(username: $username, limit: 20) {
        title
        statusDisplay
        lang
        time
      }
      matchedUser(username: $username) {
        userCalendar {
          submissionCalendar
        }
      }
    }
  `

  const json = await lcQuery(query, { username: LEETCODE_USERNAME })
  const user = json?.data?.matchedUser
  const calendar = user?.userCalendar?.submissionCalendar ? JSON.parse(user.userCalendar.submissionCalendar) : {}

  if (!user) {
    return getFallbackLeetCode()
  }

  const submissions = user.submitStatsGlobal?.acSubmissionNum || []
  const easyCount = submissions.find((s) => s.difficulty === "Easy")?.count || 0
  const mediumCount = submissions.find((s) => s.difficulty === "Medium")?.count || 0
  const hardCount = submissions.find((s) => s.difficulty === "Hard")?.count || 0
  const total = easyCount + mediumCount + hardCount

  const result = {
    username: LEETCODE_USERNAME,
    ranking: user.profile?.ranking || 0,
    totalSolved: total,
    easySolved: easyCount,
    mediumSolved: mediumCount,
    hardSolved: hardCount,
    contestRating: json?.data?.userContestRanking?.rating || 0,
    topPercentage: json?.data?.userContestRanking?.topPercentage || 0,
    profileUrl: `https://leetcode.com/u/${LEETCODE_USERNAME}/`,
    calendar: calendar,
    recentSubmissions: json?.data?.recentSubmissionList || []
  }

  setCache(cacheKey, result)
  return result
}

// Fallback data if LeetCode API is unavailable
function getFallbackLeetCode() {
  return {
    username: LEETCODE_USERNAME,
    ranking: 0,
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    contestRating: 0,
    topPercentage: 0,
    profileUrl: `https://leetcode.com/u/${LEETCODE_USERNAME}/`,
    isFallback: true,
  }
}
