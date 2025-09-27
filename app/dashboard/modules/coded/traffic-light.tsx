'use client';
/** Traffic Light coded module - small interactive demo */
import { useState } from 'react';
export default function TrafficLightModule({ moduleId, metadata, onComplete }: any) {
  const [state, setState] = useState<'red'|'green'|'yellow'>('red');
  const sequence = ['red','green','yellow'];
  function next(){ const i=sequence.indexOf(state); setState(sequence[(i+1)%sequence.length]); }
  return (
    <div className="p-4">
      <h2 className="font-semibold text-lg">{metadata.title}</h2>
      <div className="my-4 flex gap-4 items-center">
        <div className="w-20 h-40 bg-slate-800 rounded flex flex-col items-center justify-around p-2">
          <div className={`w-12 h-12 rounded-full ${state==='red'?'bg-red-500':'bg-red-900/30'}`} />
          <div className={`w-12 h-12 rounded-full ${state==='yellow'?'bg-yellow-400':'bg-yellow-900/30'}`} />
          <div className={`w-12 h-12 rounded-full ${state==='green'?'bg-green-500':'bg-green-900/30'}`} />
        </div>
        <div><button onClick={next} className="px-3 py-2 bg-amber-500 rounded mr-2">Cycle</button><button onClick={()=>onComplete()} className="px-3 py-2 border rounded">Mark complete</button></div>
      </div>
    </div>
  );
}
