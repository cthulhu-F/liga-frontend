import mysql from "mysql2/promise"

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "liga_neoegoista",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Pool de conexiones
let pool: mysql.Pool | null = null

export function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
  }
  return pool
}

// Función para ejecutar queries
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    const pool = getPool()
    const [rows] = await pool.execute(query, params)
    return rows as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw new Error("Error en la consulta a la base de datos")
  }
}

// Función para obtener una sola fila
export async function executeQuerySingle<T = any>(query: string, params: any[] = []): Promise<T | null> {
  const rows = await executeQuery<T>(query, params)
  return rows.length > 0 ? rows[0] : null
}

// Función para inicializar la base de datos
export async function initializeDatabase() {
  try {
    const pool = getPool()

    // Crear tabla de usuarios
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        activo BOOLEAN DEFAULT true,
        ultimo_login DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Crear tabla de jugadores
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS jugadores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        edad INT NOT NULL,
        equipo VARCHAR(100) NOT NULL,
        imagen TEXT NULL,
        ritmo INT DEFAULT 50,
        pase INT DEFAULT 50,
        regate INT DEFAULT 50,
        defensa INT DEFAULT 50,
        tiro INT DEFAULT 50,
        reflejo INT DEFAULT 50,
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Crear tabla de fechas
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS fechas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fecha DATE NOT NULL,
        nombre VARCHAR(100) NULL,
        descripcion TEXT NULL,
        activa BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Crear tabla de partidos
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS partidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fecha_id INT NOT NULL,
        numero INT NOT NULL,
        completado BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (fecha_id) REFERENCES fechas(id) ON DELETE CASCADE,
        UNIQUE KEY unique_fecha_numero (fecha_id, numero)
      )
    `)

    // Crear tabla de resultados
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS resultados_partidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        partido_id INT NOT NULL,
        jugador_id INT NOT NULL,
        goles INT DEFAULT 0,
        puntos INT DEFAULT 0,
        posicion INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (partido_id) REFERENCES partidos(id) ON DELETE CASCADE,
        FOREIGN KEY (jugador_id) REFERENCES jugadores(id) ON DELETE CASCADE,
        UNIQUE KEY unique_partido_jugador (partido_id, jugador_id)
      )
    `)

    console.log("✅ Base de datos inicializada correctamente")
  } catch (error) {
    console.error("❌ Error inicializando base de datos:", error)
    throw error
  }
}
