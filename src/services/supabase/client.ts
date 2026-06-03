import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Variables Supabase manquantes. Copiez .env.example vers .env.local et renseignez vos clés.'
  )
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'x-app-name': 'Senior+',
      'x-app-version': '1.0.0',
    },
  },
  db: {
    schema: 'public',
  },
})

export type SupabaseClient = typeof supabase
