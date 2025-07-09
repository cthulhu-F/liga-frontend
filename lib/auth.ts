import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { executeQuerySingle } from "./database"
import type { Usuario } from "./types"

const JWT_SECRET = process.env.JWT_SECRET || "liga-neoegoista-secret-key"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

export interface JWTPayload {
  id: number
  username: string
  role: string
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function authenticateUser(username: string, password: string): Promise<Usuario | null> {
  try {
    const user = await executeQuerySingle<Usuario>("SELECT * FROM usuarios WHERE username = ? AND activo = true", [
      username,
    ])

    if (!user || !user.password) {
      return null
    }

    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      return null
    }

    // Actualizar último login
    await executeQuerySingle("UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?", [user.id])

    // Remover password del objeto retornado
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword as Usuario
  } catch (error) {
    console.error("Error authenticating user:", error)
    return null
  }
}

export async function getUserById(id: number): Promise<Usuario | null> {
  try {
    const user = await executeQuerySingle<Usuario>(
      "SELECT id, username, role, activo, ultimo_login, created_at, updated_at FROM usuarios WHERE id = ? AND activo = true",
      [id],
    )
    return user
  } catch (error) {
    console.error("Error getting user by id:", error)
    return null
  }
}
