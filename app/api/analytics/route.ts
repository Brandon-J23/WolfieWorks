import { NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET() {
  try {
    const [userStats, portfolioStats] = await Promise.all([
      db.analytics.getUserStats(),
      db.analytics.getPortfolioStats(),
    ])

    return NextResponse.json({
      users: userStats,
      portfolio: portfolioStats,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
