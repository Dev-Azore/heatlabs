// app/profile/page.tsx
/**
 * User Profile Page
 * Allows users to view and update their profile information
 */

import { createServerSupabaseClient } from '@/lib/supabase/server-client'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/ProfileForm'

export default async function ProfilePage() {
  // ✅ Use consistent Supabase client (same as dashboard)
  const supabase = await createServerSupabaseClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-[#0C0D0E] py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#1A1D21] rounded-2xl p-8 border border-[#2D3138]">
            <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
            <p className="text-[#B0B8C1] mb-8">Manage your account information</p>
            
            <ProfileForm user={user} profile={profile} />
          </div>
        </div>
      </div>
    </div>
  )
}