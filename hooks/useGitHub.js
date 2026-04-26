"use client"
import { useState, useEffect } from "react"

export function useGitHub() {
  const [data, setData] = useState({ profile: null, repos: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchData() {
      try {
        setLoading(true)
        const res = await fetch("/api/github", { signal: controller.signal })
        if (!res.ok) throw new Error("Failed to fetch")
        const json = await res.json()
        setData({ profile: json.profile, repos: json.repos || [] })
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    return () => controller.abort()
  }, [])

  return { ...data, loading, error }
}
