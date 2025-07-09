export interface Usuario {
  id: number
  username: string
  password?: string
  role: "admin" | "user"
  activo: boolean
  ultimo_login?: string
  created_at: string
  updated_at: string
}

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
  created_at: string
  updated_at: string
}

export interface Fecha {
  id: number
  fecha: string
  nombre?: string
  descripcion?: string
  activa: boolean
  partidos?: Partido[]
  created_at: string
  updated_at: string
}

export interface Partido {
  id: number
  fecha_id: number
  numero: number
  completado: boolean
  fecha?: Fecha
  resultados?: ResultadoPartido[]
  created_at: string
  updated_at: string
}

export interface ResultadoPartido {
  id: number
  partido_id: number
  jugador_id: number
  goles: number
  puntos: number
  posicion: number
  jugador?: Jugador
  partido?: Partido
  created_at: string
  updated_at: string
}

export interface EstadisticasGenerales {
  jugador_id: number
  partidos_jugados: number
  goles_totales: number
  puntos_totales: number
  primeros_puestos: number
  segundos_puestos: number
  terceros_puestos: number
  fechas_jugadas: number
  promedio_goles: number
  promedio_puntos: number
  jugador: Jugador
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
