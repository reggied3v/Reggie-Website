import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  console.log('Creating Supabase client...')
  console.log('URL:', supabaseUrl)
  console.log('URL length:', supabaseUrl?.length || 0)
  console.log('Key length:', supabaseAnonKey?.length || 0)
  console.log('URL valid:', supabaseUrl && supabaseUrl.startsWith('https://'))
  console.log('Key valid:', supabaseAnonKey && supabaseAnonKey.length > 100)

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      `Missing Supabase environment variables: ${!supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL ' : ''}${!supabaseAnonKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : ''}`
    )
  }

  if (!supabaseUrl.startsWith('https://')) {
    throw new Error(`Invalid Supabase URL: ${supabaseUrl}`)
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  })
  return supabaseInstance
}

// Backward compatibility
export const supabase = getSupabaseClient()