// app/dashboard/modules/coded/traffic-light.tsx
/**
 * Traffic Light Interactive Module
 * 
 * Purpose:
 * - Interactive traffic light simulation
 * - Demonstrates state management and user interaction
 * 
 * Fixed: TypeScript type safety for state management
 */
'use client';

import { useState } from 'react';

// Define proper types
type TrafficLightState = 'red' | 'green' | 'yellow';

interface TrafficLightProps {
  moduleId: string;
  metadata: any;
  onComplete: () => void;
}

export default function TrafficLightModule({ moduleId, metadata, onComplete }: TrafficLightProps) {
  // State with proper typing
  const [state, setState] = useState<TrafficLightState>('red');
  
  // Sequence with proper typing
  const sequence: TrafficLightState[] = ['red', 'green', 'yellow'];
  
  /**
   * Cycle to the next traffic light state
   */
  function next() {
    const currentIndex = sequence.indexOf(state);
    const nextIndex = (currentIndex + 1) % sequence.length;
    const nextState = sequence[nextIndex];
    setState(nextState);
  }

  return (
    <div className="p-4">
      <h2 className="font-semibold text-lg text-white mb-4">
        {metadata.title}
      </h2>
      
      <div className="my-4 flex gap-6 items-center">
        {/* Traffic Light Visualization */}
        <div className="w-20 h-40 bg-slate-800 rounded-lg flex flex-col items-center justify-around p-2 border border-slate-700">
          <div className={`w-12 h-12 rounded-full transition-colors ${
            state === 'red' ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-red-900/30'
          }`} />
          <div className={`w-12 h-12 rounded-full transition-colors ${
            state === 'yellow' ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50' : 'bg-yellow-900/30'
          }`} />
          <div className={`w-12 h-12 rounded-full transition-colors ${
            state === 'green' ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-green-900/30'
          }`} />
        </div>
        
        {/* Controls */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={next}
            className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg font-semibold hover:bg-amber-400 transition"
          >
            Cycle Light
          </button>
          <button 
            onClick={onComplete}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-500 transition"
          >
            Mark Complete
          </button>
        </div>
      </div>
      
      {/* Current State Display */}
      <div className="mt-4 p-3 bg-slate-800 rounded-lg">
        <p className="text-slate-300 text-sm">
          Current state: <span className="font-semibold text-amber-400 capitalize">{state}</span>
        </p>
      </div>
    </div>
  );
}