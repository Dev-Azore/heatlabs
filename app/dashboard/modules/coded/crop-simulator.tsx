'use client';
/** Crop simulator coded module - small interactive demo */
import { useState } from 'react';
export default function CropSimulator({ moduleId, metadata, onComplete }: any) {
  const [sun,setSun]=useState(3); const [water,setWater]=useState(3);
  const health = Math.min(10, Math.max(0, Math.floor((sun+water)/2)));
  return (
    <div className="p-4">
      <h2 className="font-semibold text-lg">{metadata.title}</h2>
      <p className="text-sm text-slate-400">{metadata.summary}</p>
      <div className="mt-4 flex gap-4 items-center">
        <div><div>Sun: {sun}</div><input type="range" min="0" max="6" value={sun} onChange={(e)=>setSun(+e.target.value)} /></div>
        <div><div>Water: {water}</div><input type="range" min="0" max="6" value={water} onChange={(e)=>setWater(+e.target.value)} /></div>
      </div>
      <div className="mt-4"><div className="w-40 h-24 bg-slate-800 rounded flex items-center justify-center"><div><div>Plant health: {health}/10</div>{health>=6?<div className="text-green-300">Healthy</div>:<div className="text-yellow-300">Needs care</div>}</div></div></div>
      <div className="mt-4"><button onClick={()=>onComplete()} className="px-3 py-2 bg-amber-500 rounded">Mark complete</button></div>
    </div>
  );
}
