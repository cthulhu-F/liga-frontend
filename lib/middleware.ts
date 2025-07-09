import type { NextRequest } from "next/server"
import { verifyToken, getUserById } from "./auth"
import type { Usuario } from "./types"

export interface AuthenticatedRequest extends NextRequest {
  user?: Usuario
}

export async function authenticateRequest(request: NextRequest): Promise<Usuario | null> {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return null
    }

    const payload = verifyToken(token)
    if (!payload) {
      return null
    }

    const user = await getUserById(payload.id)
    return user
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export function requireAuth(handler: (request: NextRequest, user: Usuario) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await authenticateRequest(request)

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Acceso no autorizado",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    return handler(request, user)
  }
}

export function requireAdmin(handler: (request: NextRequest, user: Usuario) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await authenticateRequest(request)

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Acceso no autorizado",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    if (user.role !== "admin") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Se requieren permisos de administrador",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    return handler(request, user)
  }
}
