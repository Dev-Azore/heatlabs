/**
 * Admin entry page - server-side protected by get_my_role() RPC
 * This page is NOT linked in the Navbar to hide it; authorized admins can go to /admin manually.
 */
import { supabase } from '@/lib/supabaseClient';

export default async function AdminPage() {
  // Ask the backend for the current user's role
  const { data: role } = await supabase.rpc('get_my_role');
  const myRole = role ?? 'guest';
  if (myRole !== 'admin' && myRole !== 'moderator') {
    // Simple unauthorized response; you could redirect to /dashboard if preferred
    return <div className="p-6">You are not authorized to view the admin dashboard.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-4">Manage content using the CRUD pages under /admin.</p>
      </div>
    </div>
  );
}
