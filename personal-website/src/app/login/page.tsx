"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/layout/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase-client"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    const supabase = createClient()

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        })

        if (error) {
          setError(error.message)
        } else {
          setMessage("Check your email to confirm your account!")
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) {
          setError(error.message)
        } else {
          router.push('/dashboard')
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <CardDescription>
                {mode === 'login'
                  ? 'Sign in to access your AI Scrum Master dashboard'
                  : 'Sign up to start analyzing your team meetings'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-sm text-red-500">{error}</p>
                  </div>
                )}

                {message && (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-sm text-green-500">{message}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    required
                    minLength={6}
                  />
                  {mode === 'signup' && (
                    <p className="text-xs text-muted-foreground">
                      Must be at least 6 characters
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading
                    ? mode === 'login' ? 'Signing in...' : 'Creating account...'
                    : mode === 'login' ? 'Sign In' : 'Create Account'}
                </Button>

                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'login' ? 'signup' : 'login')
                      setError("")
                      setMessage("")
                    }}
                    className="text-sm text-accent hover:underline"
                  >
                    {mode === 'login'
                      ? "Don&apos;t have an account? Sign up"
                      : "Already have an account? Sign in"}
                  </button>
                </div>

                <div className="text-center pt-2">
                  <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                    ← Back to home
                  </Link>
                </div>
              </form>

              {mode === 'signup' && (
                <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2 text-sm">
                    What you&apos;ll get:
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ 14-day free trial</li>
                    <li>✓ Unlimited meeting uploads</li>
                    <li>✓ AI-powered analysis & coaching</li>
                    <li>✓ Team health tracking</li>
                    <li>✓ Action item management</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
