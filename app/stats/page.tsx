"use client"

import { MainNavigation } from "@/components/main-navigation"
import { PlayerStatsView } from "@/components/player-stats-view"

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-gradient-modern">
      <MainNavigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <PlayerStatsView />
      </div>
    </div>
  )
}
