"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function TestSupabase() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing')
  const [error, setError] = useState<string>('')
  const [envCheck, setEnvCheck] = useState<string>('')

  useEffect(() => {
    // First check if environment variables are loaded
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setEnvCheck(`URL: ${url ? 'Set' : 'Missing'}, Key: ${key ? 'Set' : 'Missing'}`)

    async function testConnection() {
      try {
        // Simple health check
        const { error } = await supabase.auth.getSession()

        if (error) {
          setConnectionStatus('error')
          setError(`Auth error: ${error.message}`)
        } else {
          setConnectionStatus('connected')
        }
      } catch (err) {
        setConnectionStatus('error')
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    if (url && key) {
      testConnection()
    } else {
      setConnectionStatus('error')
      setError('Environment variables not loaded')
    }
  }, [])

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Supabase Connection Test</h3>
      <p className="text-sm text-gray-500 mb-2">Environment: {envCheck}</p>
      {connectionStatus === 'testing' && (
        <p className="text-yellow-600">Testing connection...</p>
      )}
      {connectionStatus === 'connected' && (
        <p className="text-green-600">✅ Successfully connected to Supabase!</p>
      )}
      {connectionStatus === 'error' && (
        <div>
          <p className="text-red-600">❌ Connection failed</p>
          <p className="text-sm text-red-500 mt-1">{error}</p>
        </div>
      )}
    </div>
  )
}