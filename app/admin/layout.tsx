"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/protected-route"
import { MainNavigation } from "@/components/main-navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-modern">
        <MainNavigation />
        {children}
      </div>
    </ProtectedRoute>
  )
}
