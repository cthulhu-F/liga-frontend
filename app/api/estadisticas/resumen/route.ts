import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, executeQuerySingle } from "@/lib/database"
import { requireAuth } from "@/lib/middleware"
import type { ApiResponse } from "@/lib/types"

export const GET = requireAuth(async (request: NextRequest) => {
  try {
    // Totales generales
    const [totalJugadores] = await executeQuery<{ count: number }>(
      "SELECT COUNT(*) as count FROM jugadores WHERE activo = true",
    )

    const [totalFechas] = await executeQuery<{ count: number }>(
      "SELECT COUNT(*) as count FROM fechas WHERE activa = true",
    )

    const [totalPartidos] = await executeQuery<{ count: number }>("SELECT COUNT(*) as count FROM partidos")

    const [totalGoles] = await executeQuery<{ total: number }>(
      "SELECT COALESCE(SUM(goles), 0) as total FROM resultados_partidos",
    )

    // Jugador con más goles
    const jugadorMasGoles = await executeQuerySingle<{
      jugador_id: number
      total_goles: number
      jugador_nombre: string
      jugador_equipo: string
    }>(`
      SELECT 
        r.jugador_id,
        SUM(r.goles) as total_goles,
        j.nombre as jugador_nombre,
        j.equipo as jugador_equipo
      FROM resultados_partidos r
      JOIN jugadores j ON r.jugador_id = j.id
      WHERE j.activo = true
      GROUP BY r.jugador_id, j.id
      ORDER BY total_goles DESC
      LIMIT 1
    `)

    // Jugador con más puntos
    const jugadorMasPuntos = await executeQuerySingle<{
      jugador_id: number
      total_puntos: number
      jugador_nombre: string
      jugador_equipo: string
    }>(`
      SELECT 
        r.jugador_id,
        SUM(r.puntos) as total_puntos,
        j.nombre as jugador_nombre,
        j.equipo as jugador_equipo
      FROM resultados_partidos r
      JOIN jugadores j ON r.jugador_id = j.id
      WHERE j.activo = true
      GROUP BY r.jugador_id, j.id
      ORDER BY total_puntos DESC
      LIMIT 1
    `)

    // Partido con más goles
    const partidoMasGoles = await executeQuerySingle<{
      partido_id: number
      total_goles: number
      partido_numero: number
      fecha_fecha: string
      fecha_nombre: string
    }>(`
      SELECT 
        r.partido_id,
        SUM(r.goles) as total_goles,
        p.numero as partido_numero,
        f.fecha as fecha_fecha,
        f.nombre as fecha_nombre
      FROM resultados_partidos r
      JOIN partidos p ON r.partido_id = p.id
      JOIN fechas f ON p.fecha_id = f.id
      GROUP BY r.partido_id, p.id, f.id
      ORDER BY total_goles DESC
      LIMIT 1
    `)

    const resumen = {
      totalJugadores: totalJugadores.count,
      totalFechas: totalFechas.count,
      totalPartidos: totalPartidos.count,
      totalGoles: totalGoles.total,
      jugadorMasGoles: jugadorMasGoles
        ? {
            jugador: {
              nombre: jugadorMasGoles.jugador_nombre,
              equipo: jugadorMasGoles.jugador_equipo,
            },
            totalGoles: jugadorMasGoles.total_goles,
          }
        : null,
      jugadorMasPuntos: jugadorMasPuntos
        ? {
            jugador: {
              nombre: jugadorMasPuntos.jugador_nombre,
              equipo: jugadorMasPuntos.jugador_equipo,
            },
            totalPuntos: jugadorMasPuntos.total_puntos,
          }
        : null,
      partidoMasGoles: partidoMasGoles
        ? {
            partido: {
              numero: partidoMasGoles.partido_numero,
            },
            fecha: {
              fecha: partidoMasGoles.fecha_fecha,
              nombre: partidoMasGoles.fecha_nombre,
            },
            totalGoles: partidoMasGoles.total_goles,
          }
        : null,
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: resumen,
    })
  } catch (error) {
    console.error("Error getting resumen liga:", error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
})
