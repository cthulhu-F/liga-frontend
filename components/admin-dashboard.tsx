"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Users, Calendar, Settings, LogOut, Plus, Edit, UserPlus, CalendarPlus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { PlayerManagement } from "./player-management"
import { DateManagement } from "./date-management"

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-300" />
            <div>
              <h1 className="text-2xl font-bold">Panel de Administración</h1>
              <p className="text-green-100">Liga Neoegoísta</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">Bienvenido, {user?.username}</p>
              <p className="text-sm text-green-200">Administrador</p>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-green-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-green-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Trophy className="h-4 w-4 mr-2" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Jugadores
            </TabsTrigger>
            <TabsTrigger value="dates" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Fechas
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white border-green-200">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700">5</div>
                  <div className="text-sm text-gray-600">Jugadores Activos</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-green-200">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700">3</div>
                  <div className="text-sm text-gray-600">Fechas Jugadas</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-green-200">
                <CardContent className="p-6 text-center">
                  <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700">15</div>
                  <div className="text-sm text-gray-600">Partidos Totales</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-green-200">
                <CardContent className="p-6 text-center">
                  <Settings className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700">100%</div>
                  <div className="text-sm text-gray-600">Sistema Activo</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700 flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Acciones Rápidas - Jugadores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => setActiveTab("players")}
                    className="w-full bg-green-600 hover:bg-green-700 justify-start"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Datos de Jugadores
                  </Button>
                  <Button
                    onClick={() => setActiveTab("players")}
                    variant="outline"
                    className="w-full border-green-200 hover:bg-green-50 justify-start"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Ver Estadísticas Detalladas
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700 flex items-center gap-2">
                    <CalendarPlus className="h-5 w-5" />
                    Acciones Rápidas - Fechas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => setActiveTab("dates")}
                    className="w-full bg-green-600 hover:bg-green-700 justify-start"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Nueva Fecha
                  </Button>
                  <Button
                    onClick={() => setActiveTab("dates")}
                    variant="outline"
                    className="w-full border-green-200 hover:bg-green-50 justify-start"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Fechas Existentes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="players">
            <PlayerManagement />
          </TabsContent>

          <TabsContent value="dates">
            <DateManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">Configuración del Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Sistema de Puntuación</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>🥇 1° lugar: 3 puntos</p>
                    <p>🥈 2° lugar: 2 puntos</p>
                    <p>🥉 3° lugar: 1 punto</p>
                    <p>4° y 5° lugar: 0 puntos</p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Información del Sistema</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• 5 partidos por fecha</p>
                    <p>• Máximo 15 puntos por fecha</p>
                    <p>• 5 jugadores por liga</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
