import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  console.log('Creating browser client with:', {
    url,
    urlLength: url?.length,
    keyLength: key?.length,
    urlType: typeof url,
    keyType: typeof key
  })

  return createBrowserClient(url, key, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined
    }
  })
}
