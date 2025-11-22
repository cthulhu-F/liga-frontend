"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { RadarChart } from "./radar-chart"
import { Trophy, Target, Shield, Zap, Eye, Footprints } from "lucide-react"

interface PlayerStatsCardProps {
  player: {
    nombre: string
    edad: number
    equipo: string
    imagen: string
    stats: {
      ritmo: number
      pase: number
      regate: number
      defensa: number
      tiro: number
      reflejo: number
    }
  }
}

export function PlayerStatsCard({ player }: PlayerStatsCardProps) {
  const getStatIcon = (statName: string) => {
    switch (statName) {
      case "ritmo":
        return <Footprints className="h-4 w-4 text-white" />
      case "pase":
        return <Target className="h-4 w-4 text-white" />
      case "regate":
        return <Zap className="h-4 w-4 text-white" />
      case "defensa":
        return <Shield className="h-4 w-4 text-white" />
      case "tiro":
        return <Trophy className="h-4 w-4 text-white" />
      case "reflejo":
        return <Eye className="h-4 w-4 text-white" />
      default:
        return null
    }
  }

  const getStatColor = (value: number) => {
    if (value >= 80) return " text-green-600 bg-white"
    if (value >= 60) return " text-yellow-600 bg-white"
    if (value >= 40) return " text-orange-600 bg-white"
    return "text-red-600 bg-white"
  }

  const statEntries = Object.entries(player.stats)

  return (
    <Card className="bg-modern-primary hover:shadow-lg transition-shadow duration-300 p-0">
      <CardHeader className="text-center p-0">
        <div className="relative">
          <div className="overflow-hidden h-[550px]">
            <img
              src={player.imagen || "/placeholder.svg"}
              alt={player.nombre}
              className="w-full  rounded-sm object-top border-1 border-white shadow-lg"
            />
          </div>
        </div>
        <h3 className="text-xl font-bold text-modern-accent">{player.nombre}</h3>
        <p className="text-modern-accent font-semibold">{player.equipo}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Gráfico de telaraña */}
        <div className="bg-modern-primary rounded-lg p-4">
          <RadarChart stats={player.stats} size={240} />
        </div>

        {/* Stats detalladas */}
        <div className="grid grid-cols-2 gap-3">
          {statEntries.map(([statName, value]) => (
            <div key={statName} className="flex items-center gap-2">
              <div className="flex items-center gap-1 flex-1">
                {getStatIcon(statName)}
                <span className="text-sm font-medium text-modern-accent capitalize">{statName}</span>
              </div>
              <div className={`bg-white text-black px-2 py-1 rounded-full text-xl font-bold ${getStatColor(value)}`}>{value}</div>
            </div>
          ))}
        </div>

        {/* Promedio general */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-modern-accent">Promedio General:</span>
            <div
              className={`bg-white text-black px-3 py-1 rounded-full text-xl font-bold`}
            >
              {Math.round(Object.values(player.stats).reduce((a, b) => a + b, 0) / 6)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
