import { type NextRequest, NextResponse } from "next/server"
import { initializeDatabase, executeQuery } from "@/lib/database"
import { hashPassword } from "@/lib/auth"
import type { ApiResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Inicializando base de datos...")

    // Inicializar tablas
    await initializeDatabase()

    // Crear usuarios administradores
    const adminUsers = [
      { username: "admin", password: "admin123", role: "admin" },
      { username: "liga", password: "neoegoista", role: "admin" },
    ]

    for (const userData of adminUsers) {
      const existingUser = await executeQuery("SELECT id FROM usuarios WHERE username = ?", [userData.username])

      if (existingUser.length === 0) {
        const hashedPassword = await hashPassword(userData.password)
        await executeQuery("INSERT INTO usuarios (username, password, role) VALUES (?, ?, ?)", [
          userData.username,
          hashedPassword,
          userData.role,
        ])
        console.log(`✅ Usuario ${userData.username} creado`)
      }
    }

    // Crear jugadores de ejemplo
    const jugadores = [
      {
        nombre: "Carlos",
        edad: 28,
        equipo: "Los Cracks",
        imagen: "/placeholder.svg?height=150&width=150",
        ritmo: 85,
        pase: 78,
        regate: 82,
        defensa: 65,
        tiro: 88,
        reflejo: 70,
      },
      {
        nombre: "Miguel",
        edad: 26,
        equipo: "Tigres FC",
        imagen: "/placeholder.svg?height=150&width=150",
        ritmo: 90,
        pase: 85,
        regate: 75,
        defensa: 60,
        tiro: 80,
        reflejo: 72,
      },
      {
        nombre: "Diego",
        edad: 30,
        equipo: "Águilas United",
        imagen: "/placeholder.svg?height=150&width=150",
        ritmo: 75,
        pase: 88,
        regate: 85,
        defensa: 70,
        tiro: 85,
        reflejo: 68,
      },
      {
        nombre: "Andrés",
        edad: 24,
        equipo: "Leones FC",
        imagen: "/placeholder.svg?height=150&width=150",
        ritmo: 80,
        pase: 70,
        regate: 78,
        defensa: 85,
        tiro: 65,
        reflejo: 88,
      },
      {
        nombre: "Luis",
        edad: 27,
        equipo: "Halcones SC",
        imagen: "/placeholder.svg?height=150&width=150",
        ritmo: 70,
        pase: 82,
        regate: 68,
        defensa: 90,
        tiro: 70,
        reflejo: 85,
      },
    ]

    for (const jugadorData of jugadores) {
      const existingJugador = await executeQuery("SELECT id FROM jugadores WHERE nombre = ?", [jugadorData.nombre])

      if (existingJugador.length === 0) {
        await executeQuery(
          `INSERT INTO jugadores (nombre, edad, equipo, imagen, ritmo, pase, regate, defensa, tiro, reflejo) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            jugadorData.nombre,
            jugadorData.edad,
            jugadorData.equipo,
            jugadorData.imagen,
            jugadorData.ritmo,
            jugadorData.pase,
            jugadorData.regate,
            jugadorData.defensa,
            jugadorData.tiro,
            jugadorData.reflejo,
          ],
        )
        console.log(`✅ Jugador ${jugadorData.nombre} creado`)
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Base de datos inicializada correctamente",
    })
  } catch (error) {
    console.error("❌ Error inicializando base de datos:", error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Error inicializando base de datos",
      },
      { status: 500 },
    )
  }
}
