import { getGitHubProfile, getGitHubRepos } from "@/lib/github"

export async function GET() {
  try {
    const [profile, repos] = await Promise.all([
      getGitHubProfile(),
      getGitHubRepos(),
    ])
    return Response.json({ profile, repos })
  } catch (err) {
    console.error("GitHub API route error:", err)
    return Response.json(
      { error: "Failed to fetch GitHub data", profile: null, repos: [] },
      { status: 500 }
    )
  }
}
