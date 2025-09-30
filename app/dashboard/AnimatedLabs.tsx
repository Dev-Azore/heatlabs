'use client';

/**
 * AnimatedLabs
 * ------------
 * Client-side component for animated lab cards.
 */

import { motion } from 'framer-motion';
import LabCard from '@/components/LabCard';

export default function AnimatedLabs({ labs }: { labs: any[] }) {
  if (!labs || labs.length === 0) {
    return <p className="text-slate-400">No labs available yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {labs.map((lab, index) => (
        <motion.div
          key={lab.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <LabCard lab={lab} />
        </motion.div>
      ))}
    </div>
  );
}
