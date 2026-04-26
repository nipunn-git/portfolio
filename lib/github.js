// GitHub API client — server-side only
const GITHUB_USERNAME = "nipunn-git"
const GITHUB_API = "https://api.github.com"

// Simple in-memory cache  (resets on server restart)
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

async function ghFetch(path) {
  const headers = { "Accept": "application/vnd.github+json" }
  // Add token if available (set GITHUB_TOKEN env var to avoid rate limits)
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  const res = await fetch(`${GITHUB_API}${path}`, { headers, next: { revalidate: 600 } })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  return res.json()
}

export async function getGitHubProfile() {
  const cacheKey = "gh_profile"
  const cached = getCached(cacheKey)
  if (cached) return cached

  const data = await ghFetch(`/users/${GITHUB_USERNAME}`)
  const result = {
    login: data.login,
    name: data.name || "Nipun",
    bio: data.bio || "Data Science Student | Frontend Developer | AI Explorer",
    avatar_url: data.avatar_url,
    html_url: data.html_url,
    public_repos: data.public_repos,
    followers: data.followers,
    following: data.following,
    location: data.location || "India",
    blog: data.blog || "",
    created_at: data.created_at,
  }
  setCache(cacheKey, result)
  return result
}

export async function getGitHubRepos() {
  const cacheKey = "gh_repos"
  const cached = getCached(cacheKey)
  if (cached) return cached

  const data = await ghFetch(
    `/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20&type=owner`
  )

  const result = data
    .filter((r) => !r.fork)
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 6)
    .map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description || "No description",
      html_url: r.html_url,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      language: r.language,
      updated_at: r.updated_at,
      topics: r.topics || [],
    }))

  setCache(cacheKey, result)
  return result
}
