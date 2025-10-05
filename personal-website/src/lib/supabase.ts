import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('Creating Supabase client...')
  console.log('URL:', supabaseUrl)
  console.log('URL length:', supabaseUrl?.length || 0)
  console.log('Key length:', supabaseAnonKey?.length || 0)

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      `Missing Supabase environment variables: ${!supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL ' : ''}${!supabaseAnonKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : ''}`
    )
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}

// Backward compatibility
export const supabase = getSupabaseClient()