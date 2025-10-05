'use client'

export default function DebugEnvPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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
