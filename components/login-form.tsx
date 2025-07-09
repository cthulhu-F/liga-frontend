"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Lock, User, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [success, setSuccess] = useState("")
  const { login, isLoading, error } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess("")


    try {
      const success = await login(username.trim(), password.trim())
      if (success) {
        setSuccess("¡Login exitoso! Redirigiendo...")
        setTimeout(() => {
          router.push("/admin")
        }, 1000)
      }
    } catch (err) {
      console.error("Login error:", err)
    }
  }

  const handleQuickLogin = (user: string, pass: string) => {
    setUsername(user)
    setPassword(pass)
    setSuccess("")
  }

  return (
    <div className="min-h-screen bg-primary-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-primary-graphite border-primary-silver/30 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-scarlet p-3 rounded-full">
              <Trophy className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Liga Neoegoísta</CardTitle>
          <p className="text-white">Panel de Administración</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white font-medium">
                Usuario
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-modern-textSecondary" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-primary-black border-primary-silver/50 text-black placeholder:text-primary-silver/70 focus:border-primary-scarlet"
                  placeholder="Ingresa tu usuario"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-modern-textSecondary" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-primary-black border-primary-silver/50 text-black placeholder:text-primary-silver/70 focus:border-primary-scarlet"
                  placeholder="Ingresa tu contraseña"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-white text-sm bg-primary-scarlet/10 p-3 rounded-lg border border-primary-scarlet/30">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-green-400 text-sm bg-green-400/10 p-3 rounded-lg border border-green-400/30">
                <CheckCircle className="h-4 w-4" />
                {success}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-modern-accent to-modern-accent2 hover:shadow-glow text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
