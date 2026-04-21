import { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import DesignWheel from './DesignWheel'
import IterationBadge from './IterationBadge'
import EditPopover from './EditPopover'
import { PHASES } from '../constants'

export default function TeamCard({ team, onUpdate, stuckMinutes, teamCount }) {
  const [isEditing, setIsEditing] = useState(false)
  const [showEditPopover, setShowEditPopover] = useState(false)
  const [editingName, setEditingName] = useState(team.name)
  const inputRef = useRef(null)

  const isStuck = stuckMinutes > 0 && (Date.now() - team.lastRotated) > stuckMinutes * 60 * 1000
  const [, forceUpdate] = useState(0)

  // Re-render periodically to update stuck status
  useEffect(() => {
    const interval = setInterval(() => forceUpdate(n => n + 1), 15000)
    return () => clearInterval(interval)
  }, [])

  const advance = useCallback(() => {
    const nextPhase = (team.phase + 1) % 5
    const newIterations = nextPhase === 0 ? team.iterations + 1 : team.iterations
    onUpdate(team.id, {
      phase: nextPhase,
      iterations: newIterations,
      lastRotated: Date.now(),
    })
  }, [team.id, team.phase, team.iterations, onUpdate])

  const retreat = useCallback(() => {
    const prevPhase = (team.phase - 1 + 5) % 5
    onUpdate(team.id, {
      phase: prevPhase,
      lastRotated: Date.now(),
    })
  }, [team.id, team.phase, onUpdate])

  const startEditingName = useCallback(() => {
    setEditingName(team.name)
    setIsEditing(true)
  }, [team.name])

  const finishEditingName = useCallback(() => {
    setIsEditing(false)
    if (editingName.trim()) {
      onUpdate(team.id, { name: editingName.trim() })
    }
  }, [team.id, editingName, onUpdate])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const activePhase = PHASES[team.phase]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative flex flex-col items-center rounded-[1vw] border border-[var(--color-border)] px-[2.5vw] pt-[1.5vw] pb-[1.8vw] transition-all overflow-hidden min-h-0"
      style={{
        backgroundColor: 'var(--color-surface)',
        boxShadow: isStuck
          ? `0 0 20px ${activePhase.glow}, inset 0 0 0 1px #ef6c0040`
          : 'none',
      }}
      whileHover={{
        boxShadow: `0 0 25px ${activePhase.glow}`,
        borderColor: activePhase.color + '60',
      }}
    >
      {/* Stuck pulsing border */}
      {isStuck && (
        <div
          className="absolute inset-0 rounded-[1vw] border-2 border-[#ef6c00] pointer-events-none"
          style={{ animation: 'pulse-ring 3s ease-in-out infinite' }}
        />
      )}

      {/* Header: emoji + name + iterations */}
      <div className="flex items-center justify-between w-full mb-[0.8vw]">
        <div className="flex items-center gap-[0.5vw] min-w-0 flex-1">
          <span className="text-[1.6vw] select-none shrink-0">{team.emoji}</span>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={finishEditingName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') finishEditingName()
                if (e.key === 'Escape') setIsEditing(false)
              }}
              className="bg-transparent border-b border-[var(--color-text-muted)] text-[1.3vw] font-semibold text-[var(--color-text)] outline-none min-w-0 flex-1"
            />
          ) : (
            <span
              onClick={startEditingName}
              className="text-[1.3vw] font-semibold truncate cursor-pointer hover:text-white transition-colors"
            >
              {team.name}
            </span>
          )}
        </div>
        <IterationBadge count={team.iterations} />
      </div>

      {/* Wheel */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-0 py-[0.5vw]">
        <div className="w-[70%] aspect-square max-h-full">
          <DesignWheel
            activePhase={team.phase}
            onAdvance={advance}
            onRetreat={retreat}
            onCenterDoubleClick={() => setShowEditPopover(true)}
            isStuck={isStuck}
            teamCount={teamCount}
          />
        </div>
      </div>

      {/* Active phase label */}
      <motion.div
        className="mt-[0.8vw] text-[1.4vw] font-bold tracking-[0.15em] uppercase"
        style={{ color: activePhase.color }}
        animate={{ color: activePhase.color }}
        transition={{ duration: 0.3 }}
      >
        {activePhase.label}
      </motion.div>

      {/* Edit Popover */}
      <EditPopover
        isOpen={showEditPopover}
        onClose={() => setShowEditPopover(false)}
        name={team.name}
        emoji={team.emoji}
        onSave={({ name, emoji }) => onUpdate(team.id, { name, emoji })}
      />
    </motion.div>
  )
}
