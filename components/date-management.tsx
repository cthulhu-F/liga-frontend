"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Plus, Edit, Save, X, Trophy, Loader2, Trash2 } from "lucide-react"
import { useFechas, useJugadores } from "@/hooks/use-api-data"
import { apiService, type Fecha } from "@/lib/api"

export function DateManagement() {
  const { fechas, loading, createFecha, updateFecha, deleteFecha } = useFechas()
  const { jugadores } = useJugadores()
  const [isAddingDate, setIsAddingDate] = useState(false)
  const [isEditingDate, setIsEditingDate] = useState(false)
  const [currentDate, setCurrentDate] = useState("")
  const [currentNombre, setCurrentNombre] = useState("")
  const [currentPartidos, setCurrentPartidos] = useState<any[]>([])
  const [editingDateId, setEditingDateId] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const initializeNewDate = () => {
    const today = new Date().toISOString().split("T")[0]
    setCurrentDate(today)
    setCurrentNombre("")
    setCurrentPartidos(
      Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        numero: i + 1,
        resultados: jugadores.map((jugador, index) => ({
          jugadorId: jugador.id,
          jugador: jugador,
          goles: 0,
          puntos: 0,
          posicion: index + 1,
        })),
      })),
    )
    setIsAddingDate(true)
  }

  const handleEditDate = async (fecha: Fecha) => {
    try {
      // Obtener datos completos de la fecha
      const response = await apiService.getFecha(fecha.id)
      const fechaCompleta = response.fecha

      setCurrentDate(fechaCompleta.fecha)
      setCurrentNombre(fechaCompleta.nombre || "")

      // Convertir partidos de la API al formato del componente
      const partidosFormateados =
        fechaCompleta.partidos?.map((partido) => ({
          id: partido.id,
          numero: partido.numero,
          resultados:
            partido.resultados?.map((resultado) => ({
              jugadorId: resultado.jugadorId,
              jugador: resultado.jugador,
              goles: resultado.goles,
              puntos: resultado.puntos,
              posicion: resultado.posicion,
            })) || [],
        })) || []

      setCurrentPartidos(partidosFormateados)
      setEditingDateId(fecha.id)
      setIsEditingDate(true)
    } catch (error) {
      console.error("Error loading fecha:", error)
    }
  }

  const updatePartidoResult = (partidoIndex: number, jugadorIndex: number, field: string, value: any) => {
    const newPartidos = [...currentPartidos]
    let numValue

    switch (field) {
      case "goles":
        numValue = Math.max(0, Math.min(20, Number.parseInt(value) || 0))
        break
      case "puntos":
        numValue = Math.max(0, Number.parseInt(value) || 0)
        break
      case "posicion":
        numValue = Math.max(1, Math.min(jugadores.length, Number.parseInt(value) || 1))
        break
      default:
        numValue = value
    }

    newPartidos[partidoIndex].resultados[jugadorIndex][field] = value

    // Recalcular posiciones y puntos si se cambian los goles
    if (field === "goles") {
    }

    // Si se cambia la posición manualmente, ajustar otras posiciones
    if (field === "posicion") {

    }

    // Si se cambian los puntos manualmente, no recalcular automáticamente
    if (field === "puntos") {
      // Los puntos se mantienen como están ingresados manualmente
    }

    setCurrentPartidos(newPartidos)
  }

  const handleSaveDate = async () => {
    setIsSaving(true)
    try {
      if (isAddingDate) {
        // Crear nueva fecha
        const response: any = await apiService.createFecha({
          fecha: currentDate,
          nombre: currentNombre,
          descripcion: "",
          activa: true,
        })

        if (response?.success) {
          const fechaId = response?.data.id
          // Crear partidos para la nueva fecha
          await createPartidosForFecha(fechaId)
          handleCancelEdit()
        }
      } else if (isEditingDate && editingDateId) {
        // Actualizar fecha existente
        const success = await updateFecha(editingDateId, {
          fecha: currentDate,
          nombre: currentNombre,
        })

        if (success) {
          // Actualizar partidos y resultados existentes
          await updatePartidosAndResultados(editingDateId)
          handleCancelEdit()
        }
      }
    } catch (error) {
      console.error("Error saving fecha:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const createPartidosForFecha = async (fechaId: number) => {
    try {
      // Crear todos los partidos definidos en currentPartidos
      for (let i = 0; i < currentPartidos.length; i++) {
        const partidoData = {
          fechaId,
          numero: currentPartidos[i].numero,
          completado: false,
        }

        const response: any = await apiService.createPartido(partidoData)


        if (response.success && response.data) {
          // Crear resultados para este partido
          const resultados = jugadores.map(jugador => {
            const partidoResult = currentPartidos[i]?.resultados?.find((r: any) => r.jugadorId === jugador.id)
            return {
              jugadorId: jugador.id,
              goles: partidoResult?.goles || 0,
              puntos: partidoResult?.puntos || 0,
              posicion: partidoResult?.posicion || 0,
            }
          })

          if (resultados.length > 0) {
            await apiService.updateResultados(response.data.id, resultados)
          }
        }
      }
    } catch (error) {
      console.error("Error creating partidos:", error)
      throw error
    }
  }

  const updatePartidosAndResultados = async (fechaId: number) => {
    try {
      // Actualizar cada partido existente
      for (let i = 0; i < currentPartidos.length; i++) {
        const partido = currentPartidos[i]

        if (partido.id && partido.id > 0) {
          // Actualizar partido existente
          await apiService.updatePartido(partido.id, {
            fechaId,
            numero: partido.numero,
            completado: false,
          })

          // Actualizar resultados
          const resultados = partido.resultados?.map((resultado: any) => ({
            jugadorId: resultado.jugadorId,
            goles: resultado.goles,
            puntos: resultado?.puntos,
            posicion: resultado?.posicion,
          })) || []

          if (resultados.length > 0) {
            await apiService.updateResultados(partido.id, resultados)
          }
        } else {
          // Crear nuevo partido si no existe
          const response = await apiService.createPartido({
            fechaId,
            numero: partido.numero,
            completado: false,
          })

          if (response && response.partido) {
            const resultados = partido.resultados?.map((resultado: any) => ({
              jugadorId: resultado.jugadorId,
              goles: resultado.goles,
              puntos: resultado?.puntos,
              posicion: resultado?.posicion,
            })) || []

            if (resultados.length > 0) {
              await apiService.updateResultados(response.partido.id, resultados)
            }
          }
        }
      }
    } catch (error) {
      console.error("Error updating partidos and resultados:", error)
      throw error
    }
  }

  const handleCancelEdit = () => {
    setIsAddingDate(false)
    setIsEditingDate(false)
    setCurrentDate("")
    setCurrentNombre("")
    setCurrentPartidos([])
    setEditingDateId(null)
  }

  const createSinglePartido = async (fechaId: number, numeroPartido: number) => {
    try {
      const partidoData = {
        fechaId,
        numero: numeroPartido,
        completado: false,
      }

      const response = await apiService.createPartido(partidoData)

      if (response && response.partido) {
        // Crear resultados iniciales para todos los jugadores
        const resultados = jugadores.map(jugador => ({
          jugadorId: jugador.id,
          goles: 0,
        }))

        if (resultados.length > 0) {
          await apiService.updateResultados(response.partido.id, resultados)
        }

        return response.partido
      }

      return null
    } catch (error) {
      console.error(`Error creating partido ${numeroPartido}:`, error)
      throw error
    }
  }

  const addNewPartido = async () => {
    try {
      const nextNumero = Math.max(...currentPartidos.map(p => p.numero)) + 1
      if (nextNumero > 10) {
        alert("No se pueden crear más de 10 partidos por fecha")
        return
      }

      // Para nueva fecha, solo agregamos al estado local
      if (isAddingDate) {
        const partidoFormateado = {
          id: Date.now() + nextNumero, // ID temporal para nuevas fechas
          numero: nextNumero,
          resultados: jugadores.map((jugador, index) => ({
            jugadorId: jugador.id,
            jugador: jugador,
            goles: 0,
            puntos: 0,
            posicion: index + 1,
          }))
        }

        setCurrentPartidos([...currentPartidos, partidoFormateado])
        return
      }

      // Para edición, crear en la base de datos
      if (isEditingDate && editingDateId) {
        const newPartido = await createSinglePartido(editingDateId, nextNumero)

        if (newPartido) {
          // Agregar el nuevo partido al estado local
          const partidoFormateado = {
            id: newPartido.id,
            numero: newPartido.numero,
            resultados: jugadores.map((jugador, index) => ({
              jugadorId: jugador.id,
              jugador: jugador,
              goles: 0,
              puntos: 0,
              posicion: 0,
            }))
          }

          setCurrentPartidos([...currentPartidos, partidoFormateado])
        }
      }
    } catch (error) {
      console.error("Error adding new partido:", error)
    }
  }

  const deletePartido = async (partidoIndex: number) => {
    const partido = currentPartidos[partidoIndex]

    // Para nueva fecha, solo eliminar del estado local
    if (isAddingDate) {
      const newPartidos = currentPartidos.filter((_, index) => index !== partidoIndex)
      setCurrentPartidos(newPartidos)
      return
    }

    // Para edición, eliminar de la base de datos si existe
    if (partido.id && partido.id > 0 && isEditingDate) {
      try {
        await apiService.deletePartido(partido.id)

        // Remover del estado local
        const newPartidos = currentPartidos.filter((_, index) => index !== partidoIndex)
        setCurrentPartidos(newPartidos)
      } catch (error) {
        console.error("Error deleting partido:", error)
      }
    } else {
      // Solo remover del estado local si no existe en la base de datos
      const newPartidos = currentPartidos.filter((_, index) => index !== partidoIndex)
      setCurrentPartidos(newPartidos)
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-green-700">Cargando fechas...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="modern-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-modern-accent flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Gestión de Fechas
            </CardTitle>
            <Button onClick={initializeNewDate} className="bg-gradient-to-r from-modern-accent to-modern-accent2 hover:shadow-glow text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Fecha
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fechas.map((fecha) => (
              <Card key={fecha.id} className="modern-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-white">
                        Fecha: {new Date(fecha.fecha).toLocaleDateString("es-ES")}
                        {fecha.nombre && ` - ${fecha.nombre}`}
                      </h3>
                      <p className="text-sm text-gray-600">{fecha.partidos?.length || 0} partidos</p>
                    </div>
                    <Button onClick={() => handleEditDate(fecha)} variant="outline" size="sm"
                      className="bg-gradient-to-r from-modern-accent to-modern-accent2 hover:shadow-glow text-white">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </div>

                  {fecha.partidos && fecha.partidos.length > 0 && (
                    <div className="grid gap-2 modern-card">
                      {fecha.partidos.map((partido) => (
                        <div key={partido.id} className="modern-card p-3 rounded border">
                          <h4 className="font-semibold text-start mb-2 text-modern-accent">Partido {partido.numero}</h4>
                          <div className="text-md text-white">
                            <table className="w-full">
                              <thead>
                                <tr>
                                  <th className="text-start">Jugador</th>
                                  <th className="text-start">Goles</th>
                                  <th className="text-start">Puntos</th>
                                </tr>
                              </thead>
                              <tbody>
                            {partido.resultados
                              ?.sort((a, b) => a.posicion - b.posicion)
                              .map((resultado) => (
                                <tr key={resultado.jugadorId}>
                                  <td className="text-start">
                                    {getPosicionIcon(resultado.posicion)} {resultado.jugador?.nombre}
                                  </td>
                                  <td className="text-start">{resultado.goles}</td>
                                  <td className="text-start">{resultado.puntos}</td>
                                </tr>
                              ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog para agregar/editar fecha */}
      <Dialog open={isAddingDate || isEditingDate} onOpenChange={handleCancelEdit}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-black">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {isAddingDate ? "Nueva Fecha" : "Editar Fecha"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 text-white">
            {/* Datos de la fecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={currentDate}
                  onChange={(e) => setCurrentDate(e.target.value)}
                  className="border-green-200 text-black bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre (opcional)</Label>
                <Input
                  id="nombre"
                  value={currentNombre}
                  onChange={(e) => setCurrentNombre(e.target.value)}
                  className="border-green-200 text-black bg-white"
                />
              </div>
            </div>

            {/* Partidos */}
            {currentPartidos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-green-800">
                    Resultados de los {currentPartidos.length} Partidos
                  </h4>
                  <Button
                    onClick={addNewPartido}
                    variant="outline"
                    size="sm"
                    className="bg-gradient-to-r from-modern-accent to-modern-accent2 hover:shadow-glow text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Partido
                  </Button>
                </div>
                <Tabs defaultValue="partido-1" className="w-full">
                  <TabsList className="grid w-full text-white modern-card" style={{ gridTemplateColumns: `repeat(${currentPartidos.length}, 1fr)` }}>
                    {currentPartidos.map((partido) => (
                      <TabsTrigger key={partido.id} value={`partido-${partido.numero}`} className="modern-card text-white mx-1">
                        Partido {partido.numero}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {currentPartidos.map((partido, partidoIndex) => (
                    <TabsContent key={partido.id} value={`partido-${partido.numero}`} className="space-y-4">
                      <Card className="modern-card">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white flex items-center gap-2">
                              <Trophy className="h-4 w-4" />
                              Partido {partido.numero}
                            </CardTitle>
                            {currentPartidos.length > 1 && (
                              <Button
                                onClick={() => deletePartido(partidoIndex)}
                                variant="outline"
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {partido.resultados?.map((resultado: any, jugadorIndex: number) => (
                              <div
                                key={resultado.jugadorId}
                                className="grid grid-cols-5 gap-4 items-center p-3 rounded modern-card"
                              >
                                <div className="font-medium text-white">{resultado.jugador?.nombre}</div>
                                <div className="space-y-1">
                                  <Label className="text-xs text-white">Goles</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="20"
                                    value={resultado.goles}
                                    onChange={(e) =>
                                      updatePartidoResult(partidoIndex, jugadorIndex, "goles", e.target.value)
                                    }
                                    className="border-green-200 text-black bg-white"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs text-white">Posición</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    max={jugadores.length}
                                    value={resultado.posicion}
                                    onChange={(e) =>
                                      updatePartidoResult(partidoIndex, jugadorIndex, "posicion", e.target.value)
                                    }
                                    className="border-green-200 text-black bg-white"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs text-white">Puntos</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={resultado.puntos}
                                    onChange={(e) =>
                                      updatePartidoResult(partidoIndex, jugadorIndex, "puntos", e.target.value)
                                    }
                                    className="border-green-200 text-black bg-white"
                                  />
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-white">Estado</div>
                                  <div className="font-bold text-white">
                                    {getPosicionIcon(resultado.posicion)} {resultado.posicion}°
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveDate} className="w-full bg-gradient-to-r from-modern-accent to-modern-accent2 hover:shadow-glow text-white" disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {isSaving ? "Guardando..." : isAddingDate ? "Crear Fecha" : "Guardar Cambios"}
              </Button>
              <Button onClick={handleCancelEdit} variant="outline" className="w-full bg-gradient-to-r from-modern-accent to-modern-accent2 hover:shadow-glow text-white">
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
