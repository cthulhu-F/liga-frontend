import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import { requireAuth, requireAdmin } from "@/lib/middleware"
import type { Fecha, Partido, ResultadoPartido, Jugador, ApiResponse, PaginatedResponse } from "@/lib/types"

export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const activa = searchParams.get("activa")
    const includePartidos = searchParams.get("includePartidos") === "true"
    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 10

    let whereClause = "1=1"
    const params: any[] = []

    if (activa !== null) {
      whereClause += " AND activa = ?"
      params.push(activa === "true")
    }

    // Contar total
    const [{ total }] = await executeQuery<{ total: number }>(
      `SELECT COUNT(*) as total FROM fechas WHERE ${whereClause}`,
      params,
    )

    // Obtener fechas paginadas
    const offset = (page - 1) * limit
    const fechas = await executeQuery<Fecha>(
      `SELECT * FROM fechas WHERE ${whereClause} ORDER BY fecha DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    )

    // Si se solicitan partidos, cargarlos
    if (includePartidos && fechas.length > 0) {
      for (const fecha of fechas) {
        // Obtener partidos de la fecha
        const partidos = await executeQuery<Partido>("SELECT * FROM partidos WHERE fecha_id = ? ORDER BY numero ASC", [
          fecha.id,
        ])

        // Para cada partido, obtener resultados
        for (const partido of partidos) {
          const resultados = await executeQuery<ResultadoPartido & { jugador: Jugador }>(
            `SELECT r.*, j.nombre as jugador_nombre, j.equipo as jugador_equipo 
             FROM resultados_partidos r 
             JOIN jugadores j ON r.jugador_id = j.id 
             WHERE r.partido_id = ? 
             ORDER BY r.posicion ASC`,
            [partido.id],
          )

          // Formatear resultados
          partido.resultados = resultados.map((r) => ({
            id: r.id,
            partido_id: r.partido_id,
            jugador_id: r.jugador_id,
            goles: r.goles,
            puntos: r.puntos,
            posicion: r.posicion,
            created_at: r.created_at,
            updated_at: r.updated_at,
            jugador: {
              id: r.jugador_id,
              nombre: r.jugador_nombre,
              equipo: r.jugador_equipo,
            } as Jugador,
          }))
        }

        fecha.partidos = partidos
      }
    }

    const response: PaginatedResponse<Fecha> = {
      data: fechas,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }

    return NextResponse.json<ApiResponse<PaginatedResponse<Fecha>>>({
      success: true,
      data: response,
    })
  } catch (error) {
    console.error("Error getting fechas:", error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
})

export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    const fechaData = await request.json()
    const { fecha, nombre, descripcion } = fechaData

    if (!fecha) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "La fecha es requerida",
        },
        { status: 400 },
      )
    }

    const result = await executeQuery("INSERT INTO fechas (fecha, nombre, descripcion) VALUES (?, ?, ?)", [
      fecha,
      nombre || null,
      descripcion || null,
    ])

    const insertId = (result as any).insertId
    const nuevaFecha = await executeQuery<Fecha>("SELECT * FROM fechas WHERE id = ?", [insertId])

    return NextResponse.json<ApiResponse<Fecha>>(
      {
        success: true,
        message: "Fecha creada exitosamente",
        data: nuevaFecha[0],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating fecha:", error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
})
