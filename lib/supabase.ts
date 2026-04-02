import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''

// For server-side: use Secret Key if available, else Anon Key
export const supabaseServer = createClient(
  supabaseUrl,
  supabaseSecretKey || supabaseAnonKey
)

// For client-side: always use Anon Key
export const supabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
)
