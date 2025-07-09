import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, executeQuerySingle } from "@/lib/database"
import { requireAuth, requireAdmin } from "@/lib/middleware"
import type { Jugador, ApiResponse } from "@/lib/types"

export const GET = requireAuth(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    const id = Number(params.id)

    if (isNaN(id)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "ID inválido",
        },
        { status: 400 },
      )
    }

    const jugador = await executeQuerySingle<Jugador>("SELECT * FROM jugadores WHERE id = ?", [id])

    if (!jugador) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Jugador no encontrado",
        },
        { status: 404 },
      )
    }

    return NextResponse.json<ApiResponse<Jugador>>({
      success: true,
      data: jugador,
    })
  } catch (error) {
    console.error("Error getting jugador:", error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
})

export const PUT = requireAdmin(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    const id = Number(params.id)
    const jugadorData = await request.json()

    if (isNaN(id)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "ID inválido",
        },
        { status: 400 },
      )
    }

    // Verificar que el jugador existe
    const existingJugador = await executeQuerySingle<Jugador>("SELECT * FROM jugadores WHERE id = ?", [id])

    if (!existingJugador) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Jugador no encontrado",
        },
        { status: 404 },
      )
    }

    // Construir query de actualización dinámicamente
    const updateFields: string[] = []
    const updateValues: any[] = []

    const allowedFields = [
      "nombre",
      "edad",
      "equipo",
      "imagen",
      "ritmo",
      "pase",
      "regate",
      "defensa",
      "tiro",
      "reflejo",
      "activo",
    ]

    for (const field of allowedFields) {
      if (jugadorData[field] !== undefined) {
        updateFields.push(`${field} = ?`)
        updateValues.push(jugadorData[field])
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "No hay campos para actualizar",
        },
        { status: 400 },
      )
    }

    updateValues.push(id)

    await executeQuery(`UPDATE jugadores SET ${updateFields.join(", ")}, updated_at = NOW() WHERE id = ?`, updateValues)

    const updatedJugador = await executeQuerySingle<Jugador>("SELECT * FROM jugadores WHERE id = ?", [id])

    return NextResponse.json<ApiResponse<Jugador>>({
      success: true,
      message: "Jugador actualizado exitosamente",
      data: updatedJugador!,
    })
  } catch (error) {
    console.error("Error updating jugador:", error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
})

export const DELETE = requireAdmin(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    const id = Number(params.id)

    if (isNaN(id)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "ID inválido",
        },
        { status: 400 },
      )
    }

    // Verificar que el jugador existe
    const existingJugador = await executeQuerySingle<Jugador>("SELECT * FROM jugadores WHERE id = ?", [id])

    if (!existingJugador) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Jugador no encontrado",
        },
        { status: 404 },
      )
    }

    // Soft delete - marcar como inactivo
    await executeQuery("UPDATE jugadores SET activo = false, updated_at = NOW() WHERE id = ?", [id])

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Jugador eliminado exitosamente",
    })
  } catch (error) {
    console.error("Error deleting jugador:", error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
})
