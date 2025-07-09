"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import type { Jugador, Fecha, EstadisticasGenerales } from "@/lib/types"

// Hook para jugadores
export function useJugadores() {
  const [jugadores, setJugadores] = useState<Jugador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJugadores = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getJugadores({ activo: true, limit: 100 })
      setJugadores(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando jugadores")
      console.error("Error fetching jugadores:", err)
    } finally {
      setLoading(false)
    }
  }

  const updateJugador = async (id: number, data: Partial<Jugador>) => {
    try {
      await apiClient.updateJugador(id, data)
      await fetchJugadores() // Refrescar lista
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error actualizando jugador")
      return false
    }
  }

  const createJugador = async (data: Omit<Jugador, "id" | "created_at" | "updated_at">) => {
    try {
      await apiClient.createJugador(data)
      await fetchJugadores() // Refrescar lista
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando jugador")
      return false
    }
  }

  const deleteJugador = async (id: number) => {
    try {
      await apiClient.deleteJugador(id)
      await fetchJugadores() // Refrescar lista
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error eliminando jugador")
      return false
    }
  }

  useEffect(() => {
    fetchJugadores()
  }, [])

  return {
    jugadores,
    loading,
    error,
    refetch: fetchJugadores,
    updateJugador,
    createJugador,
    deleteJugador,
  }
}

// Hook para fechas
export function useFechas() {
  const [fechas, setFechas] = useState<Fecha[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFechas = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getFechas({
        activa: true,
        includePartidos: true,
        limit: 100,
      })
      setFechas(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando fechas")
      console.error("Error fetching fechas:", err)
    } finally {
      setLoading(false)
    }
  }

  const createFecha = async (data: Omit<Fecha, "id" | "created_at" | "updated_at">) => {
    try {
      await apiClient.createFecha(data)
      await fetchFechas() // Refrescar lista
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando fecha")
      return false
    }
  }

  useEffect(() => {
    fetchFechas()
  }, [])

  return {
    fechas,
    loading,
    error,
    refetch: fetchFechas,
    createFecha,
  }
}

// Hook para estadísticas
export function useEstadisticas() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasGenerales[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEstadisticas = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getEstadisticasGenerales()
      setEstadisticas(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando estadísticas")
      console.error("Error fetching estadisticas:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEstadisticas()
  }, [])

  return {
    estadisticas,
    loading,
    error,
    refetch: fetchEstadisticas,
  }
}

// Hook para resumen de la liga
export function useResumenLiga() {
  const [resumen, setResumen] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchResumen = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getResumenLiga()
      setResumen(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando resumen")
      console.error("Error fetching resumen:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResumen()
  }, [])

  return {
    resumen,
    loading,
    error,
    refetch: fetchResumen,
  }
}
