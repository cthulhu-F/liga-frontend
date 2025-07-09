import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, generateToken } from "@/lib/auth"
import type { ApiResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Username y password son requeridos",
        },
        { status: 400 },
      )
    }

    const user = await authenticateUser(username, password)

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Credenciales inválidas",
        },
        { status: 401 },
      )
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Login exitoso",
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
