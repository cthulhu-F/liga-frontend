"use client"

import { AdminNavigation } from "@/components/admin-navigation"
import { PlayerManagement } from "@/components/player-management"

export default function PlayersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <AdminNavigation />
      <PlayerManagement />
    </div>
  )
}
