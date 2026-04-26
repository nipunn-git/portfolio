import { getLeetCodeStats } from "@/lib/leetcode"

export async function GET() {
  try {
    const stats = await getLeetCodeStats()
    return Response.json(stats)
  } catch (err) {
    console.error("LeetCode API route error:", err)
    return Response.json(
      { error: "Failed to fetch LeetCode data", totalSolved: 0 },
      { status: 500 }
    )
  }
}
