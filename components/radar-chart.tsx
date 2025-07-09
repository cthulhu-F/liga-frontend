"use client"

interface RadarChartProps {
  stats: {
    ritmo: number
    pase: number
    regate: number
    defensa: number
    tiro: number
    reflejo: number
  }
  size?: number
}

export function RadarChart({ stats, size = 200 }: RadarChartProps) {
  const center = size / 2
  const radius = size / 2 - 20
  const angles = [0, 60, 120, 180, 240, 300] // 6 puntos, cada 60 grados

  const statLabels = ["Ritmo", "Pase", "Regate", "Defensa", "Tiro", "Reflejo"]
  const statValues = [stats.ritmo, stats.pase, stats.regate, stats.defensa, stats.tiro, stats.reflejo]

  // Convertir ángulos a radianes y calcular puntos
  const getPoint = (angle: number, value: number, maxRadius: number) => {
    const radian = (angle - 90) * (Math.PI / 180) // -90 para empezar desde arriba
    const actualRadius = (value / 100) * maxRadius
    return {
      x: center + actualRadius * Math.cos(radian),
      y: center + actualRadius * Math.sin(radian),
    }
  }

  // Puntos para las líneas de la telaraña (círculos concéntricos)
  const webLevels = [20, 40, 60, 80, 100]

  // Puntos de los datos del jugador
  const dataPoints = angles.map((angle, index) => getPoint(angle, statValues[index], radius))

  // Puntos para las etiquetas
  const labelPoints = angles.map((angle) => getPoint(angle, 110, radius))

  return (
    <div className="flex justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Círculos concéntricos de la telaraña */}
        {webLevels.map((level) => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={(level / 100) * radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Líneas radiales */}
        {angles.map((angle) => {
          const endPoint = getPoint(angle, 100, radius)
          return (
            <line
              key={angle}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          )
        })}

        {/* Área de datos del jugador */}
        <polygon
          points={dataPoints.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="rgba(139, 94, 208, 0.2)"
          stroke="#8b5ed0"
          strokeWidth="2"
        />

        {/* Puntos de datos */}
        {dataPoints.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r="4" fill="#8b5ed0" stroke="#ffffff" strokeWidth="2" />
        ))}

        {/* Etiquetas */}
        {labelPoints.map((point, index) => (
          <text
            key={index}
            x={point.x}
            y={point.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-semibold fill-white"
          >
            {statLabels[index]}
          </text>
        ))}

        {/* Valores en el centro de cada círculo */}
        {webLevels.map((level) => (
          <text
            key={`level-${level}`}
            x={center + 5}
            y={center - (level / 100) * radius + 3}
            className="text-xs fill-gray-400"
          >
            {level}
          </text>
        ))}
      </svg>
    </div>
  )
}
