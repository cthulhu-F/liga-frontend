"use client"

import { Card } from "@/components/ui/card"
import { MainNavigation } from "@/components/main-navigation"
import { Trophy } from "lucide-react"

export default function CupPage() {
  return (
    <div className="min-h-screen bg-gradient-modern">
      <MainNavigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Portada con imagen amplia */}
        <Card className="mb-8 overflow-hidden">
          <div className="relative w-full h-[500px] md:h-[650px]">
            {/* Imagen de fondo con overlay oscuro */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60">
              <img
                src="https://liga.franco.in.net/upload/portada-copa.jpg"
                alt="Copa Portada"
                className="w-full h-full"
              />
            </div>

            {/* Contenido sobre la imagen */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
              <Trophy className="h-20 w-20 md:h-24 md:w-24 text-yellow-400 mb-4 animate-pulse" />
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">

              </h1>
              <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg">

              </p>
            </div>
          </div>
        </Card>

        {/* Fixture: Semifinales y Final */}
        <div className="space-y-6">
          {/* Título de la sección */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-modern-accent to-modern-accent2 bg-clip-text text-transparent">
              Fixture del Torneo
            </h2>
          </div>

          {/* Semifinales */}
          <Card className="bg-modern-primary p-6">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-modern-accent" />
              Semifinales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Semifinal 1 */}
              <div className="bg-gradient-to-br from-modern-secondary to-modern-tertiary rounded-lg p-6 border border-modern-border/30 hover:shadow-modern transition-all duration-300">
                <p className="text-center text-modern-accent font-semibold mb-4">Semifinal</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-modern-primary/50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://liga.franco.in.net/upload/escudo-axel.png?5"
                        alt="Equipo 1"
                        className="w-10 h-10"
                      />
                      <span className="text-white font-semibold">Bluescript FC</span>
                    </div>
                    <span className="text-2xl font-bold text-modern-accent">0</span>
                  </div>
                  <div className="text-center text-white/50 text-sm">VS</div>
                  <div className="flex items-center justify-between bg-modern-primary/50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://liga.franco.in.net/upload/escudo-fede.png?5"
                        alt="Equipo 2"
                        className="w-10 h-10"
                      />
                      <span className="text-white font-semibold">Manshine city</span>
                    </div>
                    <span className="text-2xl font-bold text-modern-accent">2</span>
                  </div>
                </div>
              </div>

              {/* Semifinal 2 */}
              <div className="bg-gradient-to-br from-modern-secondary to-modern-tertiary rounded-lg p-6 border border-modern-border/30 hover:shadow-modern transition-all duration-300">
                <p className="text-center text-modern-accent font-semibold mb-4">Semifinal</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-modern-primary/50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://liga.franco.in.net/upload/escudo-joaquin.png?5"
                        alt="Equipo 3"
                        className="w-10 h-10"
                      />
                      <span className="text-white font-semibold">Real Sporting</span>
                    </div>
                    <span className="text-2xl font-bold text-modern-accent">1</span>
                  </div>
                  <div className="text-center text-white/50 text-sm">VS</div>
                  <div className="flex items-center justify-between bg-modern-primary/50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://liga.franco.in.net/upload/escudo-marcos.png?5"
                        alt="Equipo 4"
                        className="w-10 h-10"
                      />
                      <span className="text-white font-semibold">Al-Riyadh Plate</span>
                    </div>
                    <span className="text-2xl font-bold text-modern-accent">2</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Final */}
          <Card className="bg-modern-primary p-6">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-400" />
              Final
            </h3>

            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg p-8 border-2 border-yellow-400/50 hover:shadow-modern transition-all duration-300">
                <p className="text-center text-yellow-400 font-semibold mb-6 text-lg">🏆 GRAN FINAL 🏆</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-modern-primary/70 p-5 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-modern-accent/20 rounded-full flex items-center justify-center"> <img
                        src="https://liga.franco.in.net/upload/escudo-fede.png?5"
                        alt="Equipo 2"
                        className="w-10 h-10"
                      />
                      </div>
                      <span className="text-white font-semibold text-lg">Manshine city</span>
                    </div>
                    <span className="text-3xl font-bold text-yellow-400">0</span>
                  </div>
                  <div className="text-center text-yellow-400 text-sm font-semibold">VS</div>
                  <div className="flex items-center justify-between bg-modern-primary/70 p-5 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-modern-accent/20 rounded-full flex items-center justify-center">
                        <img
                        src="https://liga.franco.in.net/upload/escudo-marcos.png?5"
                        alt="Equipo 4"
                        className="w-10 h-10"
                      />
                      </div>
                      <span className="text-white font-semibold text-lg">Al-Riyadh Plate</span>
                    </div>
                    <span className="text-3xl font-bold text-yellow-400">2</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-modern-textSecondary">
          <p className="flex items-center justify-center gap-2">
            <Trophy className="h-4 w-4 text-modern-accent" />
            Liga Neoegoísta - Copa 2025
            <Trophy className="h-4 w-4 text-modern-accent" />
          </p>
        </div>
      </div>
    </div>
  )
}
