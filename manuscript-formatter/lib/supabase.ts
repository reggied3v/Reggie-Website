import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Feedback submission will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface FeedbackRecord {
  id?: string;
  created_at?: string;
  was_helpful: boolean;
  easy_to_use: boolean;
  formatting_accurate: boolean;
  would_recommend: boolean;
  additional_comments?: string;
}
