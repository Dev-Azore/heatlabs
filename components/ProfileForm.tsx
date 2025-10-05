// components/ProfileForm.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/browser-client'

interface ProfileFormProps {
  user: any
  profile: any
}

export default function ProfileForm({ user, profile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          email: user.email,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email (read-only) */}
      <div>
        <label className="block text-sm font-medium text-[#E8EAED] mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full px-4 py-3 bg-[#2D3138] border border-[#3D424A] rounded-lg text-[#B0B8C1] cursor-not-allowed"
        />
        <p className="text-sm text-[#B0B8C1] mt-1">Email cannot be changed</p>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-[#E8EAED] mb-2">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-3 bg-[#2D3138] border border-[#3D424A] rounded-lg text-white placeholder-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#8BB3FF] focus:border-transparent"
          placeholder="Enter your full name"
        />
      </div>

      {/* Role (read-only) */}
      <div>
        <label className="block text-sm font-medium text-[#E8EAED] mb-2">
          Account Role
        </label>
        <input
          type="text"
          value={profile?.role || 'user'}
          disabled
          className="w-full px-4 py-3 bg-[#2D3138] border border-[#3D424A] rounded-lg text-[#B0B8C1] cursor-not-allowed"
        />
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-[#8BB3FF] text-[#0C0D0E] font-bold rounded-lg hover:bg-[#A3C4FF] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  )
}