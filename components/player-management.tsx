"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit, Save, X, User, Target, Loader2, Plus } from "lucide-react"
import { useJugadores } from "@/hooks/use-api-data"
import type { Jugador } from "@/lib/api"

export function PlayerManagement() {
  const { jugadores, loading, error, updateJugador, createJugador, deleteJugador } = useJugadores()
  const [editingPlayer, setEditingPlayer] = useState<Jugador | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleEditPlayer = (player: Jugador) => {
    setEditingPlayer({ ...player })
    setIsCreating(false)
    setIsDialogOpen(true)
  }

  const handleCreatePlayer = () => {
    setEditingPlayer({
      id: 0,
      nombre: "",
      edad: 25,
      equipo: "",
      imagen: "",
      ritmo: 50,
      pase: 50,
      regate: 50,
      defensa: 50,
      tiro: 50,
      reflejo: 50,
      activo: true,
      createdAt: "",
      updatedAt: "",
    })
    setIsCreating(true)
    setIsDialogOpen(true)
  }

  const handleSavePlayer = async () => {
    if (!editingPlayer) return

    setIsSaving(true)
    try {
      let success = false

      if (isCreating) {
        const { id, createdAt, updatedAt, ...playerData } = editingPlayer
        success = await createJugador(playerData)
      } else {
        success = await updateJugador(editingPlayer.id, editingPlayer)
      }

      if (success) {
        setIsDialogOpen(false)
        setEditingPlayer(null)
      }
    } catch (error) {
      console.error("Error saving player:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingPlayer(null)
    setIsDialogOpen(false)
    setIsCreating(false)
  }

  const updatePlayerField = (field: keyof Jugador, value: any) => {
    if (!editingPlayer) return
    setEditingPlayer((prev) => ({
      ...prev!,
      [field]: value,
    }))
  }

  const updatePlayerStat = (stat: string, value: string) => {
    const numValue = Math.max(0, Math.min(100, Number.parseInt(value) || 0))
    updatePlayerField(stat as keyof Jugador, numValue)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
        <span className="ml-2 text-black">Cargando jugadores...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-black flex items-center gap-2">
              <User className="h-5 w-5" />
              Gestión de Jugadores
            </CardTitle>
            <Button onClick={handleCreatePlayer} className=" bg-white text-black  justify-start hover:text-white hover:bg-modern-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Jugador
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jugadores.map((player) => (
              <Card key={player.id} className="bg-modern-primary">
                <CardContent className="p-0">
                  <div className="text-center mb-4">
                    <div className="overflow-hidden h-[550px] mb-2">
                      <img
                      src={player.imagen || "/placeholder.svg?height=64&width=64"}
                      alt={player.nombre}
                      className="w-full mx-auto mb-2"
                    />
                    </div>
                    <h3 className="font-bold text-white">{player.nombre}</h3>
                    <p className="text-sm text-white">
                      {player.edad} años • {player.equipo}
                    </p>
                  </div>

                  <div className="space-y-1 mb-1 p-2">
                    <div className="text-xl text-white">Estadísticas:</div>
                    <div className="grid grid-cols-2 gap-1 text-xl text-white">
                      <div>Ritmo: {player.ritmo}</div>
                      <div>Pase: {player.pase}</div>
                      <div>Regate: {player.regate}</div>
                      <div>Defensa: {player.defensa}</div>
                      <div>Tiro: {player.tiro}</div>
                      <div>Reflejo: {player.reflejo}</div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleEditPlayer(player)}
                    className="w-full bg-white text-black rounded-[0px]  justify-start hover:text-white hover:bg-modern-primary"
                    size="sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog para editar/crear jugador */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] border-0 overflow-y-auto bg-modern-primary">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Edit className="h-5 w-5" />
              {isCreating ? "Crear Nuevo Jugador" : `Editar Jugador: ${editingPlayer?.nombre}`}
            </DialogTitle>
          </DialogHeader>

          {editingPlayer && (
            <div className="space-y-6">
              {/* Datos básicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={editingPlayer.nombre}
                    onChange={(e) => updatePlayerField("nombre", e.target.value)}
                    className="border-green-200 text-black bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edad">Edad</Label>
                  <Input
                    id="edad"
                    type="number"
                    value={editingPlayer.edad}
                    onChange={(e) => updatePlayerField("edad", Number.parseInt(e.target.value) || 0)}
                    className="border-green-200 text-black bg-white"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="equipo">Equipo</Label>
                  <Input
                    id="equipo"
                    value={editingPlayer.equipo}
                    onChange={(e) => updatePlayerField("equipo", e.target.value)}
                    className="border-green-200 text-black bg-white"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="imagen">URL de Imagen</Label>
                  <Input
                    id="imagen"
                    value={editingPlayer.imagen || ""}
                    onChange={(e) => updatePlayerField("imagen", e.target.value)}
                    className="border-green-200 text-black bg-white"
                  />
                </div>
              </div>

              {/* Estadísticas */}
              <div>
                <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2 text-white">
                  <Target className="h-4 w-4" />
                  Estadísticas (0-100)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-white">
                  {["ritmo", "pase", "regate", "defensa", "tiro", "reflejo"].map((stat) => (
                    <div key={stat} className="space-y-2">
                      <Label htmlFor={stat} className="capitalize">
                        {stat}
                      </Label>
                      <Input
                        id={stat}
                        type="number"
                        min="0"
                        max="100"
                        value={editingPlayer[stat as keyof Jugador] as number}
                        onChange={(e) => updatePlayerStat(stat, e.target.value)}
                        className="border-green-200 text-black bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSavePlayer}
                  className="w-full bg-white text-black   justify-start hover:text-white hover:bg-modern-primary border-0"
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  {isSaving ? "Guardando..." : isCreating ? "Crear Jugador" : "Guardar Cambios"}
                </Button>
                <Button onClick={handleCancelEdit}  className="w-full bg-white text-black   justify-start hover:text-white hover:bg-modern-primary border-0">
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
