import { useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { PHASES } from '../constants'

const SIZE = 200
const CX = SIZE / 2
const CY = SIZE / 2
const R = 85
const INNER_R = 32
const SEGMENT_ANGLE = 360 / 5
const START_OFFSET = -90 // start from 12 o'clock

function polarToCart(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCart(cx, cy, r, endAngle)
  const end = polarToCart(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`
}

function labelPosition(cx, cy, r, startAngle, endAngle) {
  const midAngle = (startAngle + endAngle) / 2
  const labelR = r * 0.62
  return polarToCart(cx, cy, labelR, midAngle)
}

export default function DesignWheel({ activePhase, onAdvance, onRetreat, onCenterDoubleClick, isStuck, teamCount }) {
  // Scale factor based on team count for readability
  const scale = teamCount === 1 ? 1.0 : teamCount <= 4 ? 1.0 : 1.0

  const segments = useMemo(() => {
    return PHASES.map((phase, i) => {
      const startAngle = START_OFFSET + i * SEGMENT_ANGLE
      const endAngle = startAngle + SEGMENT_ANGLE
      const path = arcPath(CX, CY, R, startAngle, endAngle)
      const labelPos = labelPosition(CX, CY, R, startAngle, endAngle)
      return { ...phase, path, labelPos, startAngle, endAngle, index: i }
    })
  }, [])

  const handleClick = useCallback((e) => {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    if (x >= 0) {
      onAdvance()
    } else {
      onRetreat()
    }
  }, [onAdvance, onRetreat])

  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation()
    onCenterDoubleClick()
  }, [onCenterDoubleClick])

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full h-full cursor-pointer select-none"
      onClick={handleClick}
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
    >
      <defs>
        {PHASES.map((phase) => (
          <radialGradient key={phase.key} id={`glow-${phase.key}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={phase.color} stopOpacity="0.9" />
            <stop offset="60%" stopColor={phase.color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={phase.color} stopOpacity="0.1" />
          </radialGradient>
        ))}
        <filter id="bloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Stuck pulsing ring */}
      {isStuck && (
        <circle
          cx={CX}
          cy={CY}
          r={R + 4}
          fill="none"
          stroke="#ef6c00"
          strokeWidth="2"
          opacity="0.4"
          style={{ animation: 'pulse-ring 3s ease-in-out infinite' }}
        />
      )}

      {/* Segments */}
      {segments.map((seg) => {
        const isActive = seg.index === activePhase
        return (
          <g key={seg.key}>
            {/* Glow layer for active segment */}
            {isActive && (
              <path
                d={seg.path}
                fill={`url(#glow-${seg.key})`}
                filter="url(#bloom)"
                className="pointer-events-none"
                style={{
                  animation: 'breathe 3s ease-in-out infinite',
                }}
              />
            )}
            <motion.path
              d={seg.path}
              fill={isActive ? seg.color : seg.muted}
              stroke="var(--color-bg)"
              strokeWidth="1.5"
              animate={{
                fill: isActive ? seg.color : seg.muted,
                opacity: isActive ? 1 : 0.7,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{ cursor: 'pointer' }}
            />
            {/* Phase label */}
            <text
              x={seg.labelPos.x}
              y={seg.labelPos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isActive ? '#fff' : '#ffffff60'}
              fontSize={seg.key === 'improve' || seg.key === 'imagine' ? '8' : '9'}
              fontWeight="600"
              fontFamily="'DM Sans', sans-serif"
              letterSpacing="0.5"
              className="pointer-events-none select-none"
            >
              <motion.tspan
                animate={{ fill: isActive ? '#ffffff' : '#ffffff50' }}
                transition={{ duration: 0.3 }}
              >
                {seg.label}
              </motion.tspan>
            </text>
          </g>
        )
      })}

      {/* Center circle — double-click target */}
      <circle
        cx={CX}
        cy={CY}
        r={INNER_R}
        fill="var(--color-bg)"
        stroke="var(--color-border)"
        strokeWidth="1"
        onDoubleClick={handleDoubleClick}
        className="cursor-pointer"
      />

      {/* Center arrow hints */}
      <g className="pointer-events-none" opacity="0.25">
        <path d={`M ${CX - 12} ${CY} l -5 -4 l 0 8 Z`} fill="var(--color-text-muted)" />
        <path d={`M ${CX + 12} ${CY} l 5 -4 l 0 8 Z`} fill="var(--color-text-muted)" />
      </g>
    </svg>
  )
}
