import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/admin/login-form'
import { getUser } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: 'Admin Login | ReggieD3V',
  description: 'Sign in to access the admin panel',
}

export default async function LoginPage() {
  // If already logged in, redirect to admin dashboard
  const user = await getUser()
  if (user) {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/5">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Sign in to access your dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
