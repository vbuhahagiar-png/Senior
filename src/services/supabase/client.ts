import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://demo.supabase.co'
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'demo-key'
const DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_MODE === 'true' || SUPABASE_URL.includes('demo')

if (DEMO_MODE) {
  console.info('[Senior+] Mode démonstration actif — données fictives')
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: !DEMO_MODE,
    persistSession: !DEMO_MODE,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'x-app-name': 'Senior+',
      'x-app-version': '1.0.0',
    },
    fetch: DEMO_MODE
      ? async (url: RequestInfo, options?: RequestInit) => {
          // En mode démo, intercepter les appels Supabase pour éviter les erreurs réseau
          console.debug('[Supabase démo] Appel intercepté:', url)
          return new Response(JSON.stringify({ data: null, error: null }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      : undefined,
  },
})

export const isDemoMode = DEMO_MODE
export type SupabaseClient = typeof supabase
