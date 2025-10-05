'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'

export default function DebugEnvPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const [testResult, setTestResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const testSupabaseConnection = async () => {
    setIsLoading(true)
    setTestResult('Testing...')

    try {
      console.log('Testing Supabase connection...')

      // Test direct fetch to Supabase
      const directUrl = `${url}/auth/v1/token?grant_type=password`
      console.log('Testing direct fetch to:', directUrl)

      const response = await fetch(directUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': key || ''
        },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'test123'
        })
      })

      console.log('Direct fetch response status:', response.status)
      const responseData = await response.json()
      console.log('Direct fetch response:', responseData)

      setTestResult(`✅ Direct fetch worked! Status: ${response.status}`)
    } catch (err) {
      setTestResult(`❌ Exception: ${err instanceof Error ? err.message : String(err)}`)
      console.error('Direct fetch exception:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="max-w-2xl w-full bg-card p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Environment Variables Debug</h1>
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">NEXT_PUBLIC_SUPABASE_URL:</h2>
            <p className="text-sm break-all bg-muted p-2 rounded mt-1">
              {url || '❌ UNDEFINED'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Type: {typeof url} | Length: {url?.length || 0}
            </p>
          </div>
          <div>
            <h2 className="font-semibold">NEXT_PUBLIC_SUPABASE_ANON_KEY:</h2>
            <p className="text-sm break-all bg-muted p-2 rounded mt-1">
              {key ? `${key.substring(0, 20)}...${key.substring(key.length - 10)}` : '❌ UNDEFINED'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Type: {typeof key} | Length: {key?.length || 0}
            </p>
          </div>
          <div className="pt-4 border-t">
            <h2 className="font-semibold mb-2">Supabase Connection Test:</h2>
            <Button onClick={testSupabaseConnection} disabled={isLoading} className="mb-2">
              {isLoading ? 'Testing...' : 'Test Connection'}
            </Button>
            {testResult && (
              <p className="text-sm bg-muted p-2 rounded">{testResult}</p>
            )}
          </div>
          <div className="pt-4 border-t">
            <h2 className="font-semibold mb-2">All process.env keys starting with NEXT_PUBLIC:</h2>
            <pre className="text-xs bg-muted p-2 rounded overflow-auto">
              {JSON.stringify(
                Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC')),
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
