"use client"

import { AdminNavigation } from "@/components/admin-navigation"
import { DateManagement } from "@/components/date-management"

export default function DatesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <AdminNavigation />
      <DateManagement />
    </div>
  )
}
