import { motion, AnimatePresence } from 'framer-motion'

export default function IterationBadge({ count }) {
  return (
    <div className="flex items-center gap-[0.5vw] bg-[var(--color-bg)] rounded-full px-[0.9vw] py-[0.4vw]">
      {/* Looping arrow icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[1.5vw] h-[1.5vw] text-[var(--color-text-muted)]"
      >
        <path d="M17 1l4 4-4 4" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <path d="M7 23l-4-4 4-4" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={count}
          className="text-[1.5vw] font-bold text-[var(--color-text)] tabular-nums"
          initial={{ scale: 1.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
