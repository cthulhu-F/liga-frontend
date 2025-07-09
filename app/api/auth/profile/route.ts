import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, getUserById } from "@/lib/auth"
import type { ApiResponse } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Token no proporcionado",
        },
        { status: 401 },
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Token inválido",
        },
        { status: 401 },
      )
    }

    const user = await getUserById(payload.id)
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Usuario no encontrado",
        },
        { status: 404 },
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { user },
    })
  } catch (error) {
    console.error("Profile error:", error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
