'use client';
/** Anatomy quiz coded module - small multiple-choice demo */
import { useState } from 'react';
const QUESTIONS=[{q:'Which organ pumps blood?',options:['Liver','Heart','Lung'],a:1},{q:'Where are red blood cells made?',options:['Bone marrow','Kidney','Skin'],a:0}];
export default function AnatomyQuiz({ moduleId, metadata, onComplete }: any) {
  const [idx,setIdx]=useState(0); const [score,setScore]=useState(0);
  function answer(i:number){ if(i===QUESTIONS[idx].a) setScore(s=>s+1); if(idx+1<QUESTIONS.length) setIdx(idx+1); else onComplete(); }
  const cur = QUESTIONS[idx];
  return (<div className="p-4"><h2 className="font-semibold text-lg">{metadata.title}</h2><div className="mt-4"><p className="mb-2">{cur.q}</p><div className="flex flex-col gap-2">{cur.options.map((opt,i)=> (<button key={i} onClick={()=>answer(i)} className="p-2 border rounded text-left">{opt}</button>))}</div></div></div>);
}
