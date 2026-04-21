import { useState, Component } from 'react'
import HeatmapStrip from './components/HeatmapStrip'
import TeamGrid from './components/TeamGrid'
import TeacherSidebar from './components/TeacherSidebar'
import { usePersistedState } from './hooks/usePersistedState'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ color: 'white', padding: 40, fontFamily: 'monospace' }}>
          <h1>Something went wrong</h1>
          <pre>{this.state.error.message}</pre>
          <pre>{this.state.error.stack}</pre>
          <button onClick={() => { localStorage.clear(); window.location.reload() }}
            style={{ marginTop: 20, padding: '8px 16px', cursor: 'pointer' }}>
            Clear data &amp; reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function AppInner() {
  const {
    teams,
    stuckMinutes,
    updateTeam,
    addTeam,
    removeTeam,
    resetAllPhases,
    resetAllIterations,
    setStuckMinutes,
  } = usePersistedState()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-[var(--color-bg)]">
      <HeatmapStrip teams={teams} />

      <TeamGrid
        teams={teams}
        onUpdate={updateTeam}
        stuckMinutes={stuckMinutes}
      />

      <TeacherSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        teams={teams}
        onAddTeam={addTeam}
        onRemoveTeam={removeTeam}
        onResetPhases={resetAllPhases}
        onResetIterations={resetAllIterations}
        stuckMinutes={stuckMinutes}
        onSetStuckMinutes={setStuckMinutes}
      />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  )
}
