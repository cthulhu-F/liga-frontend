"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Target, Calendar, Users, TrendingUp, ChevronDown, ChevronUp, Zap, Star, Loader2 } from "lucide-react"
import { MainNavigation } from "@/components/main-navigation"
import { useFechas, useEstadisticas, useResumenLiga } from "@/hooks/use-api-data"

export default function HomePage() {
  const { fechas, loading: loadingFechas, refetch: refetchFechas, setParams: setParamsFechas, params: paramsFechas } = useFechas()
  const { estadisticas, loading: loadingEstadisticas, refetch, setParams, params } = useEstadisticas()
  const { resumen: data, loading: loadingResumen, refetch: refetchResumen, setParams: setParamsResumen, params: paramsResumen } = useResumenLiga()
  const [filtroJugador, setFiltroJugador] = useState("")
  const [filtroTemporada, setFiltroTemporada] = useState("2025-01-01,2025-07-13")
  const [fechasExpandidas, setFechasExpandidas] = useState<Record<string, boolean>>({})

  const loading = loadingFechas || loadingEstadisticas || loadingResumen

  const toggleFechaExpandida = (fechaId: string) => {
    setFechasExpandidas((prev) => ({
      ...prev,
      [fechaId]: !prev[fechaId],
    }))
  }

  const getPosicionIcon = (posicion: number) => {
    switch (posicion) {
      case 1:
        return "🥇"
      case 2:
        return "🥈"
      case 3:
        return "🥉"
      default:
        return "⚽"
    }
  }

  const getPosicionColor = (posicion: number) => {
    switch (posicion) {
      case 1:
        return "text-yellow-400 font-bold"
      case 2:
        return "text-modern-textSecondary font-semibold"
      case 3:
        return "text-amber-500 font-semibold"
      default:
        return "text-modern-textMuted"
    }
  }

  const getEscudo = (jugadorId) => {
    switch (jugadorId) {
      case 1: return (
        <img
          src="https://liga.franco.in.net/upload/escudo-axel.png?3"
          alt="Fondo difuminado"
          className="w-[100%]"
        />
      )
        break;
      case 2: return <img
        src="https://liga.franco.in.net/upload/escudo-fede.png?3"
        alt="Fondo difuminado"
          className="w-[100%]"
      />
        break;
      case 3: return <img
        src="https://liga.franco.in.net/upload/escudo-joaquin.png?3"
        alt="Fondo difuminado"
          className="w-[100%]"
      />
        break;
      case 4: return <img
        src="https://liga.franco.in.net/upload/escudo-marcos.png?3"
        alt="Fondo difuminado"
          className="w-[100%]"
      />
        break;

      default:
        break;
    }
  }

  // Obtener todos los jugadores únicos
  const todosLosJugadores = Array.from(new Set(estadisticas.map((e) => e.jugador.nombre)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-modern">
        <MainNavigation />
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-modern-accent" />
          <span className="ml-2 text-white">Cargando datos de la liga...</span>
        </div>
      </div>
    )
  }

  const resumen = data?.data;

  return (
    <div className="min-h-screen bg-gradient-modern">
      <MainNavigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Banner ganador */}
        <Card className="relative w-full h-[250px] mb-8 overflow-hidden">
          {/* Imagen de fondo difuminada */}
          <img
            src="https://liga.franco.in.net/upload/ganador.jpeg"
            alt="Fondo difuminado"
            className="absolute inset-0 w-full h-full object-cover blur-md scale-110"
          />

          {/* Imagen principal centrada */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <img
              src="https://liga.franco.in.net/upload/ganador.jpeg"
              alt="Ganador"
              className="h-full object-contain"
            />
          </div>
        </Card>

        {/* Filtros */}
        <Card className="mb-8 modern-card">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-modern-accent to-modern-accent2 bg-clip-text text-transparent flex items-center gap-2">
              <Zap className="h-5 w-5 text-modern-accent" />
              Filtra la temporada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filtroTemporada === "2025-07-14,2026-01-01" ? "default" : "outline"}
                onClick={() => {

                  setParams({
                    ...params,
                    fechaInicio: '2025-07-14', fechaFin: '2026-01-01'
                  })
                  setParamsResumen({
                    ...paramsResumen,
                    fechaInicio: '2025-07-14', fechaFin: '2026-01-01'
                  })
                  setParamsFechas({
                    ...paramsFechas,
                    fechaInicio: '2025-07-14', fechaFin: '2026-01-01'
                  })
                  setFiltroTemporada("2025-07-14,2026-01-01")

                  refetch({
                    fechaInicio: '2025-07-14', fechaFin: '2026-01-01'
                  })
                  refetchResumen({
                    fechaInicio: '2025-07-14', fechaFin: '2026-01-01'
                  })
                  refetchFechas({
                    fechaInicio: '2025-07-14', fechaFin: '2026-01-01'
                  })
                }}
                className={`transition-all duration-300 ${filtroTemporada === "2025-07-14,2026-01-01"
                  ? "bg-gradient-to-r from-modern-accent to-modern-accent2 hover:shadow-glow text-white"
                  : "border-modern-border text-modern-textSecondary hover:bg-modern-accent/10 hover:border-modern-accent"
                  }`}
              >
                Temporada 2025/2026
              </Button>
              <Button
                variant={filtroTemporada === "2025-01-01,2025-07-13" ? "default" : "outline"}
                onClick={() => {
                  setParams({
                    ...params,
                    fechaInicio: '2025-01-01', fechaFin: '2025-07-13'
                  })
                  setParamsResumen({
                    ...paramsResumen,
                    fechaInicio: '2025-01-01', fechaFin: '2025-07-13'
                  })
                  setParamsFechas({
                    ...paramsFechas,
                    fechaInicio: '2025-01-01', fechaFin: '2025-07-13'
                  })
                  setFiltroTemporada("2025-01-01,2025-07-13")
                  refetch({
                    fechaInicio: '2025-01-01', fechaFin: '2025-07-13'
                  })
                  refetchResumen({
                    fechaInicio: '2025-01-01', fechaFin: '2025-07-13'
                  })
                  refetchFechas({
                    fechaInicio: '2025-01-01', fechaFin: '2025-07-13'
                  })
                }}
                className={`transition-all duration-300 ${filtroTemporada === "2025-01-01,2025-07-13"
                  ? "bg-gradient-to-r from-modern-accent to-modern-accent2 hover:shadow-glow text-white"
                  : "border-modern-border text-modern-textSecondary hover:bg-modern-accent/10 hover:border-modern-accent"
                  }`}
              >
                Temporada 2025/2024
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">

          <Card className="modern-card hover:shadow-modern-lg transition-all duration-300 group">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-modern-accent mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl font-bold bg-gradient-to-r from-modern-accent to-modern-accent2 bg-clip-text text-transparent">
                {resumen?.totalFechas || 0}
              </div>
              <div className="text-sm text-modern-textSecondary">Fechas Jugadas</div>
            </CardContent>
          </Card>

          <Card className="modern-card hover:shadow-modern-lg transition-all duration-300 group">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-modern-accent2 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl font-bold bg-gradient-to-r from-modern-accent2 to-modern-success bg-clip-text text-transparent">
                {resumen?.totalPartidos || 0}
              </div>
              <div className="text-sm text-modern-textSecondary">Partidos Totales</div>
            </CardContent>
          </Card>

          <Card className="modern-card hover:shadow-modern-lg transition-all duration-300 group">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-modern-warning mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl font-bold bg-gradient-to-r from-modern-warning to-modern-danger bg-clip-text text-transparent">
                {resumen?.totalGoles || 0}
              </div>
              <div className="text-sm text-modern-textSecondary">Goles Totales</div>
            </CardContent>
          </Card>

          <Card className="modern-card hover:shadow-modern-lg transition-all duration-300 group">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-modern-success mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl font-bold bg-gradient-to-r from-modern-success to-modern-accent2 bg-clip-text text-transparent">
                {resumen?.totalJugadores || 0}
              </div>
              <div className="text-sm text-modern-textSecondary">Jugadores</div>
            </CardContent>
          </Card>

          <Card className="modern-card hover:shadow-modern-lg transition-all duration-300 group">
            <CardContent className="p-4 text-center">
              <div className="relative">
                <TrendingUp className="h-8 w-8 text-modern-accent mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                <Star className="h-3 w-3 text-modern-accent2 absolute top-0 right-1/2 animate-pulse" />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-modern-accent to-modern-accent2 bg-clip-text text-transparent">
                {estadisticas[0]?.jugador?.nombre || "N/A"}
              </div>
              <div className="text-sm text-modern-textSecondary">Líder General</div>
            </CardContent>
          </Card>
        </div>


        {/* Tabla General Acumulativa */}
        <Card className="modern-card mb-8">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-modern-accent to-modern-accent2 bg-clip-text text-transparent flex items-center gap-2">
              <Trophy className="h-5 w-5 text-modern-accent" />
              Tabla General - Estadísticas Acumuladas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-modern-secondary to-modern-tertiary">
                    <th className="border border-modern-border/30 p-3 text-left font-semibold text-modern-accent">
                      Pos
                    </th>
                    <th className="border border-modern-border/30 p-3 text-left font-semibold text-modern-accent">
                      Equipo
                    </th>
                    <th className="border border-modern-border/30 p-3 text-center font-semibold text-modern-accent">
                      Fechas
                    </th>
                    <th className="border border-modern-border/30 p-3 text-center font-semibold text-modern-accent">
                      Partidos
                    </th>
                    <th className="border border-modern-border/30 p-3 text-center font-semibold text-modern-accent">
                      Goles
                    </th>
                    <th className="border border-modern-border/30 p-3 text-center font-semibold text-modern-accent">
                      Puntos
                    </th>
                    <th className="border border-modern-border/30 p-3 text-center font-semibold text-modern-accent">
                      Prom/Fecha
                    </th>
                    <th className="border border-modern-border/30 p-3 text-center font-semibold text-modern-accent">
                      🥇
                    </th>
                    <th className="border border-modern-border/30 p-3 text-center font-semibold text-modern-accent">
                      🥈
                    </th>
                    <th className="border border-modern-border/30 p-3 text-center font-semibold text-modern-accent">
                      🥉
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {estadisticas.map((jugador, index) => (
                    <tr
                      key={jugador.jugadorId}
                      className={`hover:bg-modern-accent/5 transition-all duration-300 ${index === 0 ? "bg-gradient-to-r from-yellow-500/10 to-yellow-600/10" : ""
                        } ${filtroJugador === "" || filtroJugador === jugador.jugador.nombre ? "" : "opacity-50"}`}
                    >
                      <td className="border border-modern-border/30 p-3 text-center font-bold text-white">
                        {index === 0 && <Trophy className="h-4 w-4 text-yellow-400 inline mr-1" />}
                        {index + 1}
                      </td>
                      <td className="flex border border-modern-border/30 p-3 font-semibold bg-gradient-to-r from-modern-accent to-modern-accent2 bg-clip-text text-transparent">
                        <div className="w-[30px] text-center px-1">
                          {getEscudo(jugador.jugador.id)}
                        </div>
                        {jugador.jugador.equipo}
                      </td>
                      <td className="border border-modern-border/30 p-3 text-center text-white">
                        {jugador.fechasJugadas}
                      </td>
                      <td className="border border-modern-border/30 p-3 text-center text-white">
                        {jugador.partidosJugados}
                      </td>
                      <td className="border border-modern-border/30 p-3 text-center font-semibold text-white">
                        {jugador.golesTotales}
                      </td>
                      <td className="border border-modern-border/30 p-3 text-center font-bold bg-gradient-to-r from-modern-accent to-modern-accent2 bg-clip-text text-transparent">
                        {jugador.puntosTotales}
                      </td>
                      <td className="border border-modern-border/30 p-3 text-center text-sm text-modern-textSecondary">
                        {jugador.fechasJugadas > 0 ? (jugador.puntosTotales / jugador.fechasJugadas).toFixed(1) : "0.0"}
                      </td>
                      <td className="border border-modern-border/30 p-3 text-center text-white">
                        {jugador.primerosPuestos}
                      </td>
                      <td className="border border-modern-border/30 p-3 text-center text-white">
                        {jugador.segundosPuestos}
                      </td>
                      <td className="border border-modern-border/30 p-3 text-center text-white">
                        {jugador.tercerosPuestos}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Filtros */}
        <Card className="mb-8 modern-card">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-modern-accent to-modern-accent2 bg-clip-text text-transparent flex items-center gap-2">
              <Zap className="h-5 w-5 text-modern-accent" />
              Filtros Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filtroJugador === "" ? "default" : "outline"}
                onClick={() => setFiltroJugador("")}
                className={`transition-all duration-300 ${filtroJugador === ""
                  ? "bg-gradient-to-r from-modern-accent to-modern-accent2 hover:shadow-glow text-white"
                  : "border-modern-border text-modern-textSecondary hover:bg-modern-accent/10 hover:border-modern-accent"
                  }`}
              >
                Todos
              </Button>
              {todosLosJugadores.map((jugador) => (
                <Button
                  key={jugador}
                  variant={filtroJugador === jugador ? "default" : "outline"}
                  onClick={() => setFiltroJugador(jugador)}
                  className={`transition-all duration-300 ${filtroJugador === jugador
                    ? "bg-gradient-to-r from-modern-accent to-modern-accent2 hover:shadow-glow text-white"
                    : "border-modern-border text-modern-textSecondary hover:bg-modern-accent/10 hover:border-modern-accent"
                    }`}
                >
                  {jugador}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Registro por Fechas */}
        <div className="space-y-6 mb-8">
          {fechas.map((fecha) => {
            const isExpanded = fechasExpandidas[fecha.id.toString()]
            const totalGoles =
              fecha.partidos?.reduce(
                (total, partido) => total + (partido.resultados?.reduce((sum, r) => sum + r.goles, 0) || 0),
                0,
              ) || 0

            return (
              <Card key={fecha.id} className="modern-card">
                <CardHeader
                  className="cursor-pointer hover:bg-modern-accent/5 transition-all duration-300 rounded-t-lg"
                  onClick={() => toggleFechaExpandida(fecha.id.toString())}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="bg-gradient-to-r from-modern-accent to-modern-accent2 bg-clip-text text-transparent flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-modern-accent" />
                      Fecha: {new Date(fecha.fecha + " 00:00:00").toLocaleDateString("es-ES")}
                      {fecha.nombre && ` - ${fecha.nombre}`}
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-modern-textSecondary bg-modern-tertiary/50 px-3 py-1 rounded-full">
                        {fecha.partidos?.length || 0} partidos • {totalGoles} goles
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-modern-accent transition-transform duration-300" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-modern-accent transition-transform duration-300" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Partidos detallados (expandible) */}
                  {isExpanded && fecha.partidos && (
                    <div className="space-y-4 animate-in slide-in-from-top duration-300">
                      <h4 className="font-semibold bg-gradient-to-r from-modern-accent to-modern-accent2 bg-clip-text text-transparent">
                        Detalle de los {fecha.partidos.length} Partidos:
                      </h4>
                      <div className="grid gap-4">
                        {fecha.partidos.map((partido) => (
                          <div
                            key={partido.id}
                            className="bg-gradient-to-br from-modern-secondary to-modern-tertiary rounded-lg p-4 border border-modern-border/30 hover:shadow-modern transition-all duration-300"
                          >
                            <h5 className="font-semibold text-start mb-3 bg-gradient-to-r from-modern-accent to-modern-accent2 bg-clip-text text-transparent">
                              Partido {partido.numero}
                            </h5>
                            <div className="space-y-2">
                              {partido.resultados
                                ?.sort((a, b) => a.posicion - b.posicion)
                                .map((resultado) => (
                                  <div
                                    key={`${partido.id}-${resultado.jugadorId}`}
                                    className={`flex justify-between items-center p-2 rounded transition-all duration-300 hover:bg-modern-accent/5 ${filtroJugador === "" || filtroJugador === resultado.jugador?.nombre
                                      ? ""
                                      : "opacity-50"
                                      }`}
                                  >
                                    <div className={`font-medium ${getPosicionColor(resultado.posicion)}`}>
                                      {getPosicionIcon(resultado.posicion)} {resultado.jugador?.nombre}
                                    </div>
                                    <div className="text-sm text-modern-textSecondary bg-modern-tertiary/50 px-2 py-1 rounded">
                                      {resultado.goles}G - {resultado.puntos}P
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-modern-textSecondary">
          <p className="flex items-center justify-center gap-2">
            <Zap className="h-4 w-4 text-modern-accent" />
            Liga Neoegoísta - Sistema de gestión moderna
            <Zap className="h-4 w-4 text-modern-accent" />
          </p>
        </div>
      </div>
    </div>
  )
}
