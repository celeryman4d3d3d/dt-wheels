import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EMOJI_OPTIONS } from '../constants'

export default function EditPopover({ isOpen, onClose, name, emoji, onSave }) {
  const [editName, setEditName] = useState(name)
  const [editEmoji, setEditEmoji] = useState(emoji)

  if (!isOpen) return null

  const handleSave = () => {
    onSave({ name: editName, emoji: editEmoji })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="absolute z-50 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[1vw] p-[1.2vw] shadow-2xl"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(24vw, 340px)',
            }}
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-[0.8vw]">
              <label className="text-[0.8vw] text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">
                Team Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[0.5vw] px-[0.8vw] py-[0.5vw] text-[1vw] text-[var(--color-text)] outline-none focus:border-[var(--color-ask)]"
                autoFocus
              />

              <label className="text-[0.8vw] text-[var(--color-text-muted)] uppercase tracking-wider font-semibold mt-[0.3vw]">
                Icon
              </label>
              <div className="grid grid-cols-10 gap-[0.2vw]">
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEditEmoji(e)}
                    className={`text-[1.1vw] p-[0.25vw] rounded-[0.3vw] cursor-pointer transition-all ${
                      editEmoji === e
                        ? 'bg-[var(--color-surface-hover)] ring-1 ring-[var(--color-text-muted)] scale-110'
                        : 'hover:bg-[var(--color-surface-hover)]'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>

              <div className="flex gap-[0.5vw] mt-[0.5vw]">
                <button
                  onClick={onClose}
                  className="flex-1 py-[0.4vw] rounded-[0.5vw] border border-[var(--color-border)] text-[0.85vw] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-[0.4vw] rounded-[0.5vw] bg-[var(--color-ask)] text-white text-[0.85vw] font-semibold hover:brightness-110 cursor-pointer transition-all"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
