const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Tipos de datos (reutilizamos los mismos)
export type { Usuario, Jugador, Fecha, Partido, ResultadoPartido, EstadisticasGenerales } from "./types"
import type { ApiResponse, PaginatedResponse } from "./types"

// Clase para manejar las peticiones HTTP
class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = API_BASE_URL
    // Obtener token del localStorage si existe
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("liga-auth-token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("liga-auth-token", token)
    }
  }

  removeToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("liga-auth-token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const config: RequestInit = {
      ...options,
      headers,
    }

    try {
      const response = await fetch(url, config)
      const data: ApiResponse<T> = await response.json()

      if (!data.success) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }


      return data as T
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      throw error
    }
  }

  // Métodos de autenticación
  async login(username: string, password: string) {
    const response = await this.request<{
      token: string
      usuario: {
        id: number
        username: string
        role: string
      }
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })



    this.setToken(response.token)
    return response
  }

  async getProfile() {
    return this.request<{ usuario: any }>("/auth/profile")
  }

  // Métodos de jugadores
  async getJugadores(params?: {
    activo?: boolean
    search?: string
    page?: number
    limit?: number
  }) {
    const searchParams = new URLSearchParams()
    if (params?.activo !== undefined) searchParams.set("activo", params.activo.toString())
    if (params?.search) searchParams.set("search", params.search)
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())

    const query = searchParams.toString()
    return this.request<PaginatedResponse>(`/jugadores${query ? `?${query}` : ""}`)
  }

  async getJugador(id: number) {
    return this.request<any>(`/jugadores/${id}`)
  }

  async createJugador(jugador: any) {
    return this.request<any>("/jugadores", {
      method: "POST",
      body: JSON.stringify(jugador),
    })
  }

  async updateJugador(id: number, jugador: any) {
    return this.request<any>(`/jugadores/${id}`, {
      method: "PUT",
      body: JSON.stringify(jugador),
    })
  }

  async deleteJugador(id: number) {
    return this.request<any>(`/jugadores/${id}`, {
      method: "DELETE",
    })
  }

  // Métodos de fechas
  async getFechas(params?: {
    activa?: boolean
    page?: number
    limit?: number
    includePartidos?: boolean
  }) {
    const searchParams = new URLSearchParams()
    if (params?.activa !== undefined) searchParams.set("activa", params.activa.toString())
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.includePartidos) searchParams.set("includePartidos", params.includePartidos.toString())

    const query = searchParams.toString()
    return this.request<PaginatedResponse>(`/fechas${query ? `?${query}` : ""}`)
  }

  async createFecha(fecha: any) {
    const response = await this.request<any>("/fechas", {
      method: "POST",
      body: JSON.stringify(fecha),
    })
    
    return response.data;
  }

  // Métodos de partidos

  async createPartido(partido: any) {
    const response = await this.request<any>("/partidos", {
      method: "POST",
      body: JSON.stringify(partido),
    })
    return response.data;
  }

  // Métodos de estadísticas
  async getEstadisticasGenerales() {
    return this.request<any>("/estadisticas/generales")
  }

  async getResumenLiga() {
    return this.request<any>("/estadisticas/resumen")
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient()

// Hook personalizado para usar la API
export function useApi() {
  return apiClient
}
