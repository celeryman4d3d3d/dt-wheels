import { AnimatePresence } from 'framer-motion'
import TeamCard from './TeamCard'

function getGridConfig(count) {
  if (count <= 1) return { cols: 'grid-cols-1', rows: 1, extra: 'max-w-[40vw] mx-auto' }
  if (count <= 2) return { cols: 'grid-cols-2', rows: 1, extra: '' }
  if (count <= 4) return { cols: 'grid-cols-2', rows: 2, extra: '' }
  if (count <= 6) return { cols: 'grid-cols-3', rows: 2, extra: '' }
  return { cols: 'grid-cols-3', rows: 3, extra: '' }
}

export default function TeamGrid({ teams, onUpdate, stuckMinutes }) {
  const { cols, rows, extra } = getGridConfig(teams.length)

  // Calculate row height to fit viewport (grid area is 100vh - heatmap strip)
  const rowTemplate = rows === 1 ? '1fr' : `repeat(${rows}, 1fr)`

  return (
    <div
      className={`grid ${cols} ${extra} gap-[1.2vw] p-[1.5vw] flex-1 min-h-0 overflow-hidden`}
      style={{
        gridTemplateRows: rowTemplate,
        alignContent: 'stretch',
      }}
    >
      <AnimatePresence mode="popLayout">
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            onUpdate={onUpdate}
            stuckMinutes={stuckMinutes}
            teamCount={teams.length}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
