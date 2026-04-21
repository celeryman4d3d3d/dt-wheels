import { useState, useEffect, useCallback } from 'react'
import { STORAGE_KEY } from '../constants'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage full or unavailable
  }
}

export function usePersistedState() {
  const [state, setState] = useState(() => {
    const saved = loadState()
    return saved || {
      teams: [
        { id: crypto.randomUUID(), name: 'Team 1', emoji: '🚀', phase: 0, iterations: 0, lastRotated: Date.now() },
        { id: crypto.randomUUID(), name: 'Team 2', emoji: '⭐', phase: 0, iterations: 0, lastRotated: Date.now() },
        { id: crypto.randomUUID(), name: 'Team 3', emoji: '🔥', phase: 0, iterations: 0, lastRotated: Date.now() },
      ],
      stuckMinutes: 8,
    }
  })

  useEffect(() => {
    saveState(state)
  }, [state])

  const updateTeam = useCallback((id, updates) => {
    setState(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === id ? { ...t, ...updates } : t),
    }))
  }, [])

  const addTeam = useCallback(() => {
    setState(prev => {
      if (prev.teams.length >= 9) return prev
      const num = prev.teams.length + 1
      const usedEmojis = new Set(prev.teams.map(t => t.emoji))
      const emoji = ['🚀','⭐','🔥','💡','🎯','🌈','⚡','🎨','🧩','🦄'].find(e => !usedEmojis.has(e)) || '🌟'
      return {
        ...prev,
        teams: [...prev.teams, {
          id: crypto.randomUUID(),
          name: `Team ${num}`,
          emoji,
          phase: 0,
          iterations: 0,
          lastRotated: Date.now(),
        }],
      }
    })
  }, [])

  const removeTeam = useCallback((id) => {
    setState(prev => ({
      ...prev,
      teams: prev.teams.filter(t => t.id !== id),
    }))
  }, [])

  const resetAllPhases = useCallback(() => {
    setState(prev => ({
      ...prev,
      teams: prev.teams.map(t => ({ ...t, phase: 0, lastRotated: Date.now() })),
    }))
  }, [])

  const resetAllIterations = useCallback(() => {
    setState(prev => ({
      ...prev,
      teams: prev.teams.map(t => ({ ...t, iterations: 0 })),
    }))
  }, [])

  const setStuckMinutes = useCallback((minutes) => {
    setState(prev => ({ ...prev, stuckMinutes: minutes }))
  }, [])

  return {
    teams: state.teams,
    stuckMinutes: state.stuckMinutes,
    updateTeam,
    addTeam,
    removeTeam,
    resetAllPhases,
    resetAllIterations,
    setStuckMinutes,
  }
}
