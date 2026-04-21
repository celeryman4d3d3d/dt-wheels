import { motion, AnimatePresence } from 'framer-motion'

export default function TeacherSidebar({
  isOpen,
  onToggle,
  teams,
  onAddTeam,
  onRemoveTeam,
  onResetPhases,
  onResetIterations,
  stuckMinutes,
  onSetStuckMinutes,
}) {
  return (
    <>
      {/* Toggle button — always visible at right edge */}
      <button
        onClick={onToggle}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-[var(--color-surface)] border border-[var(--color-border)] border-r-0 rounded-l-[0.6vw] px-[0.3vw] py-[1.5vw] cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="text-[0.7vw] font-semibold text-[var(--color-text-muted)] tracking-wider uppercase">
          {isOpen ? '✕' : 'Teacher'}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-30 bg-black/20"
              onClick={onToggle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="fixed right-0 top-0 h-full z-40 bg-[var(--color-surface)] border-l border-[var(--color-border)] flex flex-col gap-[1.5vw] p-[1.5vw] overflow-y-auto"
              style={{ width: 'min(22vw, 320px)' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <h2 className="text-[1.2vw] font-bold text-[var(--color-text)]">Teacher Controls</h2>

              {/* Teams section */}
              <div className="flex flex-col gap-[0.6vw]">
                <h3 className="text-[0.75vw] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Teams ({teams.length}/9)
                </h3>

                {teams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between bg-[var(--color-bg)] rounded-[0.5vw] px-[0.7vw] py-[0.4vw]"
                  >
                    <span className="text-[0.85vw]">
                      {team.emoji} {team.name}
                    </span>
                    <button
                      onClick={() => onRemoveTeam(team.id)}
                      className="text-[0.7vw] text-[var(--color-text-muted)] hover:text-red-400 cursor-pointer transition-colors px-[0.3vw]"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  onClick={onAddTeam}
                  disabled={teams.length >= 9}
                  className="w-full py-[0.5vw] rounded-[0.5vw] border border-dashed border-[var(--color-border)] text-[0.8vw] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-text-muted)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                >
                  + Add Team
                </button>
              </div>

              {/* Stuck threshold */}
              <div className="flex flex-col gap-[0.4vw]">
                <h3 className="text-[0.75vw] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Stuck Alert (minutes)
                </h3>
                <div className="flex items-center gap-[0.5vw]">
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={stuckMinutes}
                    onChange={(e) => onSetStuckMinutes(Number(e.target.value))}
                    className="flex-1 accent-[var(--color-ask)]"
                  />
                  <span className="text-[0.85vw] font-bold tabular-nums text-[var(--color-text)] w-[2vw] text-center">
                    {stuckMinutes === 0 ? 'Off' : stuckMinutes}
                  </span>
                </div>
              </div>

              {/* Reset buttons */}
              <div className="flex flex-col gap-[0.5vw] mt-auto">
                <button
                  onClick={onResetPhases}
                  className="w-full py-[0.5vw] rounded-[0.5vw] border border-[var(--color-border)] text-[0.8vw] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
                >
                  Reset All to ASK
                </button>
                <button
                  onClick={onResetIterations}
                  className="w-full py-[0.5vw] rounded-[0.5vw] border border-[var(--color-border)] text-[0.8vw] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
                >
                  Reset Iteration Counts
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
