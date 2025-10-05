import { getUser } from '@/lib/supabase-server'
import { AdminNav } from '@/components/admin/admin-nav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  console.log('Admin Layout - User:', user ? 'exists' : 'null')

  // If no user, just render children (login page will handle this)
  if (!user) {
    console.log('Admin Layout - No user, rendering children only')
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background">
      <div style={{ backgroundColor: 'red', color: 'white', padding: '20px', fontSize: '18px', textAlign: 'center' }}>
        🔴 ADMIN LAYOUT TEST - Email: {user.email}
      </div>
      <AdminNav user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
