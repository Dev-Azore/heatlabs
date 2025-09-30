'use client'

/**
 * AnimatedStats
 * -------------
 * Client-side component for Framer Motion animations.
 */

import { motion } from 'framer-motion'

export default function AnimatedStats({ stats }: { stats: any[] }) {
  return (
    <section className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          className="bg-slate-800 rounded-xl p-6 text-center shadow hover:shadow-lg transition"
        >
          <h3 className="text-3xl font-bold text-amber-400">{stat.value}</h3>
          <p className="text-slate-400">{stat.label}</p>
        </motion.div>
      ))}
    </section>
  )
}
