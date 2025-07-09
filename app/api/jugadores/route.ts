import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import { requireAuth, requireAdmin } from "@/lib/middleware"
import type { Jugador, ApiResponse, PaginatedResponse } from "@/lib/types"

export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const activo = searchParams.get("activo")
    const search = searchParams.get("search")
    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 10

    let whereClause = "1=1"
    const params: any[] = []

    if (activo !== null) {
      whereClause += " AND activo = ?"
      params.push(activo === "true")
    }

    if (search) {
      whereClause += " AND (nombre LIKE ? OR equipo LIKE ?)"
      params.push(`%${search}%`, `%${search}%`)
    }

    // Contar total
    const [{ total }] = await executeQuery<{ total: number }>(
      `SELECT COUNT(*) as total FROM jugadores WHERE ${whereClause}`,
      params,
    )

    // Obtener jugadores paginados
    const offset = (page - 1) * limit
    const jugadores = await executeQuery<Jugador>(
      `SELECT * FROM jugadores WHERE ${whereClause} ORDER BY nombre ASC LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    )

    const response: PaginatedResponse<Jugador> = {
      data: jugadores,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }

    return NextResponse.json<ApiResponse<PaginatedResponse<Jugador>>>({
      success: true,
      data: response,
    })
  } catch (error) {
    console.error("Error getting jugadores:", error)
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
    const jugadorData = await request.json()
    const { nombre, edad, equipo, imagen, ritmo, pase, regate, defensa, tiro, reflejo } = jugadorData

    if (!nombre || !edad || !equipo) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Nombre, edad y equipo son requeridos",
        },
        { status: 400 },
      )
    }

    const result = await executeQuery(
      `INSERT INTO jugadores (nombre, edad, equipo, imagen, ritmo, pase, regate, defensa, tiro, reflejo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        edad,
        equipo,
        imagen || null,
        ritmo || 50,
        pase || 50,
        regate || 50,
        defensa || 50,
        tiro || 50,
        reflejo || 50,
      ],
    )

    const insertId = (result as any).insertId
    const jugador = await executeQuery<Jugador>("SELECT * FROM jugadores WHERE id = ?", [insertId])

    return NextResponse.json<ApiResponse<Jugador>>(
      {
        success: true,
        message: "Jugador creado exitosamente",
        data: jugador[0],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating jugador:", error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
})
