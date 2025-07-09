"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trophy, Settings, LogOut, Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function MainNavigation() {
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuth()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="bg-gradient-to-r from-modern-primary via-modern-secondary to-modern-tertiary text-white py-6 px-4 border-b border-modern-border/30 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group">
            <div className="relative">
              <Trophy className="h-10 w-10 text-modern-accent group-hover:animate-pulse-glow transition-all duration-300" />
              <Sparkles className="h-4 w-4 text-modern-accent2 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-modern-accent to-modern-accent2 bg-clip-text text-transparent">
                Liga Neoegoísta
              </h1>
              <p className="text-modern-textSecondary text-lg">Sistema de gestión moderna</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {/* Navegación principal */}
            <nav className="flex items-center gap-2">
              <Link href="/">
                <Button
                  variant={isActive("/") ? "default" : "ghost"}
                  className={`text-white transition-all duration-300 ${
                    isActive("/")
                      ? "bg-gradient-to-r from-modern-accent to-modern-accent2 hover:shadow-glow"
                      : "hover:bg-white/10 hover:backdrop-blur-sm"
                  }`}
                >
                  📊 Liga
                </Button>
              </Link>
              <Link href="/stats">
                <Button
                  variant={isActive("/stats") ? "default" : "ghost"}
                  className={`text-white transition-all duration-300 ${
                    isActive("/stats")
                      ? "bg-gradient-to-r from-modern-accent to-modern-accent2 hover:shadow-glow"
                      : "hover:bg-white/10 hover:backdrop-blur-sm"
                  }`}
                >
                  🎯 Estadísticas
                </Button>
              </Link>
              {isAuthenticated ? (
                <Link href="/admin">
                  <Button
                    variant={isActive("/admin") ? "default" : "ghost"}
                    className={`text-white transition-all duration-300 ${
                      isActive("/admin")
                        ? "bg-gradient-to-r from-modern-accent to-modern-accent2 hover:shadow-glow"
                        : "hover:bg-white/10 hover:backdrop-blur-sm"
                    }`}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button
                    variant={isActive("/login") ? "default" : "ghost"}
                    className={`text-white transition-all duration-300 ${
                      isActive("/login")
                        ? "bg-gradient-to-r from-modern-accent to-modern-accent2 hover:shadow-glow"
                        : "hover:bg-white/10 hover:backdrop-blur-sm"
                    }`}
                  >
                    🔐 Login
                  </Button>
                </Link>
              )}
            </nav>

            {/* Info de usuario */}
            {isAuthenticated && (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/20">
                <div className="text-right">
                  <p className="font-medium text-white">Bienvenido, {user?.username}</p>
                  <p className="text-sm text-modern-textSecondary">Administrador</p>
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-modern-border text-white hover:bg-modern-accent/20 hover:border-modern-accent transition-all duration-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Salir
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
