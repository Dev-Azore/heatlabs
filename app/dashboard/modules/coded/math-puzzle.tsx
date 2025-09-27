'use client';
/** Math puzzle coded module - simple input/submit demo */
import { useState } from 'react';
export default function MathPuzzle({ moduleId, metadata, onComplete }: any) {
  const [answer,setAnswer]=useState(''); const correct='8';
  function submit(){ if(answer.trim()===correct) onComplete(); else alert('Try again'); }
  return (<div className="p-4"><h2 className="font-semibold text-lg">{metadata.title}</h2><p className="text-slate-400 mt-2">{metadata.summary}</p><div className="mt-4"><div className="mb-2">Solve: 3 + 5 = ?</div><input value={answer} onChange={(e)=>setAnswer(e.target.value)} className="p-2 rounded bg-slate-800" /><div className="mt-3"><button onClick={submit} className="px-3 py-2 bg-amber-500 rounded">Submit</button></div></div></div>);
}
