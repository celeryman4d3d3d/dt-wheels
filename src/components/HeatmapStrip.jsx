import { motion } from 'framer-motion'
import { PHASES } from '../constants'

export default function HeatmapStrip({ teams }) {
  const totalTeams = teams.length
  const totalIterations = teams.reduce((sum, t) => sum + t.iterations, 0)

  const phaseCounts = PHASES.map((_, i) => teams.filter(t => t.phase === i).length)

  return (
    <div className="w-full flex items-end gap-[0.4vw] px-[1vw] py-[0.6vw] bg-[var(--color-surface)] border-b border-[var(--color-border)]"
      style={{ height: '5.5vh', minHeight: '40px' }}
    >
      {PHASES.map((phase, i) => {
        const count = phaseCounts[i]
        const fillRatio = totalTeams > 0 ? count / totalTeams : 0
        const allHere = count === totalTeams && totalTeams > 0

        return (
          <div
            key={phase.key}
            className="flex-1 flex flex-col items-center justify-end h-full relative"
          >
            {/* Phase label + count */}
            <div className="flex items-center gap-[0.3vw] mb-[0.2vw]">
              <span className="text-[0.65vw] font-semibold tracking-wider uppercase"
                style={{ color: count > 0 ? phase.color : 'var(--color-text-muted)' }}
              >
                {phase.label}
              </span>
              <span className="text-[0.6vw] font-bold tabular-nums"
                style={{ color: count > 0 ? phase.color : 'var(--color-text-muted)' }}
              >
                {count}
              </span>
            </div>

            {/* Bar */}
            <div className="w-full h-[1.2vh] rounded-full overflow-hidden relative"
              style={{ backgroundColor: phase.muted }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: phase.color,
                  boxShadow: allHere ? `0 0 12px ${phase.glow}` : 'none',
                }}
                animate={{ width: `${fillRatio * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            </div>
          </div>
        )
      })}

      {/* Total iterations */}
      <div className="flex flex-col items-center justify-center h-full pl-[0.8vw] border-l border-[var(--color-border)]">
        <span className="text-[0.55vw] text-[var(--color-text-muted)] uppercase tracking-wider font-medium">Cycles</span>
        <span className="text-[0.9vw] font-bold text-[var(--color-text-muted)] tabular-nums">{totalIterations}</span>
      </div>
    </div>
  )
}
