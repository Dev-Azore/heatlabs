'use client'
import Link from 'next/link'
import AdminGuard from '@/components/AdminGuard'
import AuthSessionWatcher from '@/components/AuthSessionWatcher'

export default function AdminHome() {
  return (
    <AdminGuard>
      <AuthSessionWatcher />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
        <ul className="list-disc pl-6 space-y-2">
          <li><Link className="underline" href="/admin/labs">Manage Labs</Link></li>
          <li><Link className="underline" href="/admin/modules">Manage Modules</Link></li>
        </ul>
      </div>
    </AdminGuard>
  )
}
