'use client';
/** Login page client component: supports email magic link + OAuth (Google/GitHub) */
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message); else alert('Check your email for a login link.');
    setLoading(false);
  }

  async function signInProvider(provider: 'github'|'google') {
    await supabase.auth.signInWithOAuth({ provider });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <div className="w-full max-w-md p-6 bg-slate-800 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Sign in to HEAT Labs</h1>
        <div className="space-y-3">
          <button onClick={() => signInProvider('google')} className="w-full py-2 bg-slate-700 rounded">Continue with Google</button>
          <button onClick={() => signInProvider('github')} className="w-full py-2 bg-slate-700 rounded">Continue with GitHub</button>
        </div>
        <form onSubmit={signInEmail} className="mt-4">
          <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-2 rounded bg-slate-700" placeholder="Email address" />
          <button disabled={loading} type="submit" className="mt-3 w-full py-2 bg-amber-500 rounded">Send magic link</button>
        </form>
      </div>
    </div>
  );
}
