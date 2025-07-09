import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import { requireAuth } from "@/lib/middleware"
import type { EstadisticasGenerales, ApiResponse } from "@/lib/types"

export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const estadisticas = await executeQuery<
      EstadisticasGenerales & {
        jugador_nombre: string
        jugador_equipo: string
      }
    >(`
      SELECT 
        r.jugador_id,
        COUNT(r.id) as partidos_jugados,
        SUM(r.goles) as goles_totales,
        SUM(r.puntos) as puntos_totales,
        SUM(CASE WHEN r.posicion = 1 THEN 1 ELSE 0 END) as primeros_puestos,
        SUM(CASE WHEN r.posicion = 2 THEN 1 ELSE 0 END) as segundos_puestos,
        SUM(CASE WHEN r.posicion = 3 THEN 1 ELSE 0 END) as terceros_puestos,
        COUNT(DISTINCT p.fecha_id) as fechas_jugadas,
        AVG(r.goles) as promedio_goles,
        AVG(r.puntos) as promedio_puntos,
        j.nombre as jugador_nombre,
        j.equipo as jugador_equipo,
        j.edad as jugador_edad,
        j.imagen as jugador_imagen,
        j.ritmo, j.pase, j.regate, j.defensa, j.tiro, j.reflejo
      FROM resultados_partidos r
      JOIN partidos p ON r.partido_id = p.id
      JOIN jugadores j ON r.jugador_id = j.id
      WHERE j.activo = true
      GROUP BY r.jugador_id, j.id
      ORDER BY puntos_totales DESC, goles_totales DESC
    `)

    // Formatear datos
    const estadisticasFormateadas = estadisticas.map((e) => ({
      jugador_id: e.jugador_id,
      partidos_jugados: e.partidos_jugados,
      goles_totales: e.goles_totales || 0,
      puntos_totales: e.puntos_totales || 0,
      primeros_puestos: e.primeros_puestos || 0,
      segundos_puestos: e.segundos_puestos || 0,
      terceros_puestos: e.terceros_puestos || 0,
      fechas_jugadas: e.fechas_jugadas || 0,
      promedio_goles: Number((e.promedio_goles || 0).toFixed(2)),
      promedio_puntos: Number((e.promedio_puntos || 0).toFixed(2)),
      jugador: {
        id: e.jugador_id,
        nombre: e.jugador_nombre,
        equipo: e.jugador_equipo,
        edad: e.jugador_edad,
        imagen: e.jugador_imagen,
        ritmo: e.ritmo,
        pase: e.pase,
        regate: e.regate,
        defensa: e.defensa,
        tiro: e.tiro,
        reflejo: e.reflejo,
        activo: true,
        created_at: "",
        updated_at: "",
      },
    }))

    return NextResponse.json<ApiResponse<EstadisticasGenerales[]>>({
      success: true,
      data: estadisticasFormateadas,
    })
  } catch (error) {
    console.error("Error getting estadisticas generales:", error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
})
