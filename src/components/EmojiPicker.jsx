import { motion, AnimatePresence } from 'framer-motion'
import { EMOJI_OPTIONS } from '../constants'

export default function EmojiPicker({ isOpen, onSelect, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="absolute z-50 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[1vw] p-[0.8vw] shadow-2xl"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(22vw, 320px)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div className="grid grid-cols-8 gap-[0.3vw]">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => onSelect(emoji)}
                  className="text-[1.3vw] p-[0.3vw] rounded-[0.4vw] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
