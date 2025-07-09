"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayerStatsCard } from "./player-stats-card"
import { BarChart3, Users, TrendingUp, Award, Loader2 } from "lucide-react"
import { useJugadores, useEstadisticas } from "@/hooks/use-api-data"

export function PlayerStatsView() {
  const { jugadores, loading: loadingJugadores } = useJugadores()
  const { estadisticas, loading: loadingEstadisticas } = useEstadisticas()
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState("")
  const [ordenarPor, setOrdenarPor] = useState("promedio")

  const loading = loadingJugadores || loadingEstadisticas

  // Convertir datos de la API al formato esperado por el componente
  const jugadoresStats = jugadores.map((jugador) => {
    const stats = estadisticas.find((e) => e.jugadorId === jugador.id)
    return {
      nombre: jugador.nombre,
      edad: jugador.edad,
      equipo: jugador.equipo,
      imagen: jugador.imagen || "/placeholder.svg?height=150&width=150",
      stats: {
        ritmo: jugador.ritmo,
        pase: jugador.pase,
        regate: jugador.regate,
        defensa: jugador.defensa,
        tiro: jugador.tiro,
        reflejo: jugador.reflejo,
      },
      estadisticas: stats,
    }
  })

  // Calcular estadísticas de comparación
  const calcularComparaciones = () => {
    const stats = ["ritmo", "pase", "regate", "defensa", "tiro", "reflejo"]
    const comparaciones: any = {}

    stats.forEach((stat) => {
      const valores = jugadoresStats.map((j) => j.stats[stat as keyof typeof j.stats])
      const maximo = Math.max(...valores)
      const minimo = Math.min(...valores)
      const promedio = valores.reduce((a, b) => a + b, 0) / valores.length

      comparaciones[stat] = {
        maximo: {
          valor: maximo,
          jugador: jugadoresStats.find((j) => j.stats[stat as keyof typeof j.stats] === maximo)?.nombre,
        },
        minimo: {
          valor: minimo,
          jugador: jugadoresStats.find((j) => j.stats[stat as keyof typeof j.stats] === minimo)?.nombre,
        },
        promedio: Math.round(promedio),
      }
    })

    return comparaciones
  }

  // Ordenar jugadores
  const jugadoresOrdenados = [...jugadoresStats].sort((a, b) => {
    if (ordenarPor === "promedio") {
      const promedioA = Object.values(a.stats).reduce((sum, val) => sum + val, 0) / 6
      const promedioB = Object.values(b.stats).reduce((sum, val) => sum + val, 0) / 6
      return promedioB - promedioA
    }
    if (ordenarPor === "edad") {
      return a.edad - b.edad
    }
    if (ordenarPor === "nombre") {
      return a.nombre.localeCompare(b.nombre)
    }
    if (ordenarPor === "puntos" && a.estadisticas && b.estadisticas) {
      return b.estadisticas.puntosTotales - a.estadisticas.puntosTotales
    }
    return 0
  })

  // Filtrar jugadores
  const jugadoresFiltrados = jugadorSeleccionado
    ? jugadoresOrdenados.filter((j) => j.nombre === jugadorSeleccionado)
    : jugadoresOrdenados

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-modern-accent">Cargando estadísticas...</span>
      </div>
    )
  }

  const comparaciones = calcularComparaciones()

  return (
    <div className="space-y-8">
      {/* Header de estadísticas */}
      <Card className="modern-card text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-modern-accent">
            <BarChart3 className="h-8 w-8" />
            Estadísticas Individuales de Jugadores
          </CardTitle>
          <p className="text-green-100 text-modern-textSecondary">Análisis detallado del rendimiento de cada integrante</p>
        </CardHeader>
      </Card>

      {/* Estadísticas comparativas */}
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="text-modern-accent flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Comparativas por Habilidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(comparaciones).map(([stat, data]: [string, any]) => (
              <div key={stat} className="modern-card p-4 rounded-lg">
                <h4 className="font-semibold text-modern-accent capitalize mb-2">{stat}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-modern-accent">🏆 Mejor:</span>
                    <span className="font-medium text-white">
                      {data.maximo.jugador} ({data.maximo.valor})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-modern-accent">📊 Promedio:</span>
                    <span className="text-white">{data?.promedio}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Controles de filtrado y ordenamiento */}
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="text-modern-accent flex items-center gap-2">
            <Users className="h-5 w-5" />
            Filtros y Ordenamiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 self-center">Mostrar:</span>
              <Button
                variant={jugadorSeleccionado === "" ? "default" : "outline"}
                onClick={() => setJugadorSeleccionado("")}
                size="sm"
                className="bg-gradient-to-r from-modern-accent to-modern-accent2 hover:shadow-glow text-white"
              >
                Todos
              </Button>
              {jugadoresStats.map((jugador) => (
                <Button
                  key={jugador.nombre}
                  variant={jugadorSeleccionado === jugador.nombre ? "default" : "outline"}
                  onClick={() => setJugadorSeleccionado(jugador.nombre)}
                  size="sm"
                  className="bg-gradient-to-r from-modern-accent to-modern-accent2 hover:shadow-glow text-white"
                >
                  {jugador.nombre}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 self-center">Ordenar por:</span>
              <Button
                variant={ordenarPor === "promedio" ? "default" : "outline"}
                onClick={() => setOrdenarPor("promedio")}
                size="sm"
                className="bg-gradient-to-r from-modern-accent to-modern-accent2 hover:shadow-glow text-white"
              >
                Promedio Stats
              </Button>
              <Button
                variant={ordenarPor === "puntos" ? "default" : "outline"}
                onClick={() => setOrdenarPor("puntos")}
                size="sm"
                className="bg-gradient-to-r from-modern-accent to-modern-accent2 hover:shadow-glow text-white"
              >
                Puntos Liga
              </Button>
              <Button
                variant={ordenarPor === "edad" ? "default" : "outline"}
                onClick={() => setOrdenarPor("edad")}
                size="sm"
                className="bg-gradient-to-r from-modern-accent to-modern-accent2 hover:shadow-glow text-white"
              >
                Edad
              </Button>
              <Button
                variant={ordenarPor === "nombre" ? "default" : "outline"}
                onClick={() => setOrdenarPor("nombre")}
                size="sm"
                className="bg-gradient-to-r from-modern-accent to-modern-accent2 hover:shadow-glow text-white"
              >
                Nombre
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de tarjetas de jugadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jugadoresFiltrados.map((jugador) => (
          <PlayerStatsCard key={jugador.nombre} player={jugador} />
        ))}
      </div>

      {/* Resumen de mejores jugadores por categoría */}
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="text-modern-accent flex items-center gap-2">
            <Award className="h-5 w-5" />
            Mejores por Categoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(comparaciones).map(([stat, data]: [string, any]) => (
              <div
                key={stat}
                className="text-center p-4 modern-card rounded-lg border "
              >
                <div className="text-2xl mb-2">🏆</div>
                <h4 className="font-bold text-modern-accent capitalize">{stat}</h4>
                <p className="text-lg font-semibold text-modern-accent">{data.maximo.jugador}</p>
                <p className="text-sm text-white">{data.maximo.valor} puntos</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
