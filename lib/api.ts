const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Tipos de datos
export interface Jugador {
  id: number
  nombre: string
  edad: number
  equipo: string
  imagen?: string
  ritmo: number
  pase: number
  regate: number
  defensa: number
  tiro: number
  reflejo: number
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface Fecha {
  id: number
  fecha: string
  nombre?: string
  descripcion?: string
  activa: boolean
  partidos?: Partido[]
  createdAt: string
  updatedAt: string
}

export interface Partido {
  id: number
  fechaId: number
  numero: number
  completado: boolean
  fecha?: Fecha
  resultados?: ResultadoPartido[]
  createdAt: string
  updatedAt: string
}

export interface ResultadoPartido {
  id: number
  partidoId: number
  jugadorId: number
  goles: number
  puntos: number
  posicion: number
  jugador?: Jugador
  partido?: Partido
  createdAt: string
  updatedAt: string
}

export interface Usuario {
  id: number
  username: string
  role: "admin" | "user"
  activo: boolean
  ultimoLogin?: string
}

export interface EstadisticasGenerales {
  jugadorId: number
  partidosJugados: number
  golesTotales: number
  puntosTotales: number
  primerosPuestos: number
  segundosPuestos: number
  tercerosPuestos: number
  fechasJugadas: number
  promedioGoles: string
  promedioPuntos: string
  jugador: Jugador
}

// Clase para manejar las peticiones HTTP
class ApiService {
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      throw error
    }
  }

  // Métodos de autenticación
  async login(username: string, password: string) {
    const response = await this.request<{
      message: string
      token: string
      usuario: Usuario
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })

    this.setToken(response.token)
    return response
  }

  async register(username: string, password: string, role: "admin" | "user" = "user") {
    const response = await this.request<{
      message: string
      token: string
      usuario: Usuario
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password, role }),
    })

    this.setToken(response.token)
    return response
  }

  async getProfile() {
    return this.request<{ usuario: Usuario }>("/auth/profile")
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
    return this.request<{
      jugadores: Jugador[]
      pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
      }
    }>(`/jugadores${query ? `?${query}` : ""}`)
  }

  async getJugador(id: number) {
    return this.request<{ jugador: Jugador }>(`/jugadores/${id}`)
  }

  async createJugador(jugador: Omit<Jugador, "id" | "createdAt" | "updatedAt">) {
    return this.request<{ message: string; jugador: Jugador }>("/jugadores", {
      method: "POST",
      body: JSON.stringify(jugador),
    })
  }

  async updateJugador(id: number, jugador: Partial<Jugador>) {
    return this.request<{ message: string; jugador: Jugador }>(`/jugadores/${id}`, {
      method: "PUT",
      body: JSON.stringify(jugador),
    })
  }

  async deleteJugador(id: number) {
    return this.request<{ message: string }>(`/jugadores/${id}`, {
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
    return this.request<{
      fechas: Fecha[]
      pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
      }
    }>(`/fechas${query ? `?${query}` : ""}`)
  }

  async getFecha(id: number) {
    return this.request<{ fecha: Fecha }>(`/fechas/${id}`)
  }

  async createFecha(fecha: Omit<Fecha, "id" | "createdAt" | "updatedAt">) {
    return this.request<{ message: string; fecha: Fecha }>("/fechas", {
      method: "POST",
      body: JSON.stringify(fecha),
    })
  }

  async updateFecha(id: number, fecha: Partial<Fecha>) {
    return this.request<{ message: string; fecha: Fecha }>(`/fechas/${id}`, {
      method: "PUT",
      body: JSON.stringify(fecha),
    })
  }

  async deleteFecha(id: number) {
    return this.request<{ message: string }>(`/fechas/${id}`, {
      method: "DELETE",
    })
  }

  // Métodos de partidos
  async getPartidos(params?: {
    fechaId?: number
    completado?: boolean
    page?: number
    limit?: number
  }) {
    const searchParams = new URLSearchParams()
    if (params?.fechaId) searchParams.set("fechaId", params.fechaId.toString())
    if (params?.completado !== undefined) searchParams.set("completado", params.completado.toString())
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())

    const query = searchParams.toString()
    return this.request<{
      partidos: Partido[]
      pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
      }
    }>(`/partidos${query ? `?${query}` : ""}`)
  }

  async getPartido(id: number) {
    return this.request<{ partido: Partido }>(`/partidos/${id}`)
  }

  async createPartido(partido: Omit<Partido, "id" | "createdAt" | "updatedAt">) {
    return this.request<{ message: string; partido: Partido }>("/partidos", {
      method: "POST",
      body: JSON.stringify(partido),
    })
  }

  async updatePartido(id: number, partido: Partial<Partido>) {
    return this.request<{ message: string; partido: Partido }>(`/partidos/${id}`, {
      method: "PUT",
      body: JSON.stringify(partido),
    })
  }

  async updateResultados(
    partidoId: number,
    resultados: Array<{
      jugadorId: number
      goles: number
    }>,
  ) {
    return this.request<{
      message: string
      resultados: ResultadoPartido[]
    }>(`/partidos/${partidoId}/resultados`, {
      method: "PUT",
      body: JSON.stringify({ resultados }),
    })
  }

  async deletePartido(id: number) {
    return this.request<{ message: string }>(`/partidos/${id}`, {
      method: "DELETE",
    })
  }

  // Métodos de estadísticas
  async getEstadisticasGenerales() {
    return this.request<{ estadisticas: EstadisticasGenerales[] }>("/estadisticas/generales")
  }

  async getEstadisticasPorFecha(fechaId: number) {
    return this.request<{
      fecha: Fecha
      estadisticas: EstadisticasGenerales[]
    }>(`/estadisticas/fecha/${fechaId}`)
  }

  async getEstadisticasJugador(jugadorId: number) {
    return this.request<{
      jugador: Jugador
      estadisticasGenerales: any
      estadisticasPorFecha: any[]
      ultimosPartidos: ResultadoPartido[]
    }>(`/estadisticas/jugador/${jugadorId}`)
  }

  async getResumenLiga() {
    return this.request<{
      resumen: {
        totalJugadores: number
        totalFechas: number
        totalPartidos: number
        totalGoles: number
        jugadorMasGoles: any
        jugadorMasPuntos: any
        partidoMasGoles: any
      }
    }>("/estadisticas/resumen")
  }
}

// Instancia singleton del servicio API
export const apiService = new ApiService()

// Hook personalizado para usar la API
export function useApi() {
  return apiService
}
