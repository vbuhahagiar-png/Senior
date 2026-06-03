import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@16'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-09-30.acacia',
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PRIX_IDS: Record<string, Record<string, string>> = {
  famille: {
    monthly: Deno.env.get('STRIPE_PRICE_FAMILLE_MENSUEL') ?? '',
    annual: Deno.env.get('STRIPE_PRICE_FAMILLE_ANNUEL') ?? '',
  },
  serenite: {
    monthly: Deno.env.get('STRIPE_PRICE_SERENITE_MENSUEL') ?? '',
    annual: Deno.env.get('STRIPE_PRICE_SERENITE_ANNUEL') ?? '',
  },
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Non authentifié' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) {
    return new Response(JSON.stringify({ error: 'Utilisateur non trouvé' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const { plan, billing } = await req.json()

  if (!plan || !billing || !PRIX_IDS[plan]?.[billing]) {
    return new Response(JSON.stringify({ error: 'Plan ou cycle invalide' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Récupérer ou créer le client Stripe
  const supabaseService = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: abonnement } = await supabaseService
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('profile_id', user.id)
    .single()

  let customerId = abonnement?.stripe_customer_id

  if (!customerId) {
    const { data: profil } = await supabaseService
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()

    const customer = await stripe.customers.create({
      email: user.email!,
      name: profil?.display_name,
      metadata: { profile_id: user.id },
    })
    customerId = customer.id
  }

  const baseUrl = req.headers.get('origin') ?? 'https://seniorplus.ch'

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: PRIX_IDS[plan][billing], quantity: 1 }],
    subscription_data: {
      trial_period_days: 30,
      metadata: { profile_id: user.id, plan },
    },
    metadata: { profile_id: user.id, plan },
    success_url: `${baseUrl}/(web)/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/(web)/checkout/cancel`,
    locale: 'fr',
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    customer_update: { address: 'auto' },
  })

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
