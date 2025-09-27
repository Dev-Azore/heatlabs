'use client';
/** ThemeToggle - simple toggle button using ThemeContext */
import { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';
export default function ThemeToggle() { const { theme, setTheme } = useContext(ThemeContext); return (<button onClick={()=>setTheme(theme==='dark'?'light':'dark')} className="px-3 py-1 bg-slate-700 rounded">{theme==='dark'?'Light':'Dark'}</button>); }
