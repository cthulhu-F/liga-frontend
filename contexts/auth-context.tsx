"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import type { Usuario } from "@/lib/types"

interface AuthContextType {
  isAuthenticated: boolean
  usuario: Usuario | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar si hay un token guardado y validarlo
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("liga-auth-token")
        if (token) {
          apiClient.setToken(token)
          const response = await apiClient.getProfile()
          setIsAuthenticated(true)
          setUser(response.user)
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error)
        // Token inválido, limpiar
        apiClient.removeToken()
        localStorage.removeItem("liga-auth-token")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setError(null)
      setIsLoading(true)

      const response = await apiClient.login(username, password)

      setIsAuthenticated(true)
      setUser(response.usuario as Usuario)

      console.log("Login exitoso:", response.usuario)
      return true
    } catch (error) {
      console.error("Error en login:", error)
      setError(error instanceof Error ? error.message : "Error al iniciar sesión")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    setError(null)
    apiClient.removeToken()
    console.log("Logout exitoso")
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
