import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | undefined

export function createClient() {
  // Create a singleton client to avoid multiple instances
  if (client) {
    return client
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim()
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim().replace(/\s/g, '')

  client = createBrowserClient(url, key)

  return client
}
