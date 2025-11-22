"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Users, Calendar } from "lucide-react"
import Link from "next/link"

export function AdminNavigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <Card className="bg-gradient-to-r from-modern-primary via-modern-secondary to-modern-tertiary text-white py-6 px-4 border-b border-modern-border/30 backdrop-blur-lg mb-3">
      <CardContent className="p-4">
        <nav className="flex flex-wrap gap-2">
          <Link href="/admin">
            <Button
              variant={isActive("/admin") ? "default" : "ghost"}
              className={isActive("/admin")
                ? "bg-gradient text-black hover:shadow-glow bg-white"
                : "hover:bg-white hover:text-black"}
            >
              <Trophy className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/players">
            <Button
              variant={isActive("/admin/players") ? "default" : "ghost"}
              className={isActive("/admin/players")
                ? "bg-gradient text-black hover:shadow-glow bg-white"
                : "hover:bg-white hover:text-black"}
            >
              <Users className="h-4 w-4 mr-2" />
              Jugadores
            </Button>
          </Link>
          <Link href="/admin/dates">
            <Button
              variant={isActive("/admin/dates") ? "default" : "ghost"}
              className={isActive("/admin/dates")
                ? "bg-gradient text-black hover:shadow-glow bg-white"
                : "hover:bg-white hover:text-black"}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Fechas
            </Button>
          </Link>
        </nav>
      </CardContent>
    </Card>
  )
}
