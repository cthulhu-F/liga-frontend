"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Users, Calendar, Settings, Plus, Edit, UserPlus, CalendarPlus, TrendingUp } from "lucide-react"
import { AdminNavigation } from "@/components/admin-navigation"

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <AdminNavigation />

      <div className="space-y-6">
        {/* Header */}
        <Card className=" border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl  text-black">
              <Trophy className="h-8 w-8" />
              Panel de Administración
            </CardTitle>
            <p className="text-black">Gestiona todos los aspectos de la Liga Neoegoísta</p>
          </CardHeader>
        </Card>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white ">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-black mx-auto mb-2" />
              <div className="text-2xl font-bold text-black">5</div>
              <div className="text-sm text-black">Jugadores Activos</div>
            </CardContent>
          </Card>

          <Card className="bg-white ">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-black mx-auto mb-2" />
              <div className="text-2xl font-bold text-black">3</div>
              <div className="text-sm text-black">Fechas Jugadas</div>
            </CardContent>
          </Card>

          <Card className="bg-white ">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-black mx-auto mb-2" />
              <div className="text-2xl font-bold text-black">15</div>
              <div className="text-sm text-black">Partidos Totales</div>
            </CardContent>
          </Card>

          <Card className="bg-white ">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-black mx-auto mb-2" />
              <div className="text-2xl font-bold text-black">100%</div>
              <div className="text-sm text-black">Sistema Activo</div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white ">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Gestión de Jugadores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/players">
                <Button className="w-full bg-white text-black  justify-start hover:text-white hover:bg-modern-primary">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Datos de Jugadores
                </Button>
              </Link>
              <Link href="/stats">
                <Button
                  className="w-full bg-white text-black  justify-start hover:text-white hover:bg-modern-primary"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Ver Estadísticas Detalladas
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white ">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <CalendarPlus className="h-5 w-5" />
                Gestión de Fechas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/dates">
                <Button
                  className="w-full bg-white text-black  justify-start hover:text-white hover:bg-modern-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Nueva Fecha
                </Button>
              </Link>
              <Link href="/admin/dates">
                <Button
                  className="w-full bg-white text-black  justify-start hover:text-white hover:bg-modern-primary"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Fechas Existentes
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Configuración del sistema */}
        <Card className="bg-white ">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border ">
                <h4 className="font-semibold text-black mb-2">Sistema de Puntuación</h4>
                <div className="text-sm text-black space-y-1">
                  <p>🥇 1° lugar: 2 puntos</p>
                  <p>🥈 2° lugar: 1 puntos</p>
                  <p>🥉 3° lugar: 0 punto</p>
                </div>
              </div>
              <div className="p-4  rounded-lg ">
                <h4 className="font-semibold text-black mb-2">Información del Sistema</h4>
                <div className="text-sm text-black space-y-1">
                  <p>4 partidos por fecha</p>
                  <p>4 jugadores por liga</p>
                  <p>2 goles para ganar un partido</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
