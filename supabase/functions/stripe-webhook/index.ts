import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@16'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-09-30.acacia',
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

function stripePlanToSeniorPlan(priceId: string): 'famille' | 'serenite' {
  const famillePrices = [
    Deno.env.get('STRIPE_PRICE_FAMILLE_MENSUEL'),
    Deno.env.get('STRIPE_PRICE_FAMILLE_ANNUEL'),
  ]
  const serenitePrices = [
    Deno.env.get('STRIPE_PRICE_SERENITE_MENSUEL'),
    Deno.env.get('STRIPE_PRICE_SERENITE_ANNUEL'),
  ]

  if (famillePrices.includes(priceId)) return 'famille'
  if (serenitePrices.includes(priceId)) return 'serenite'
  return 'famille'
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Signature manquante', { status: 400 })
  }

  const body = await req.text()
  let event: Stripe.Event

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )
  } catch (err) {
    console.error('Webhook signature invalide:', err)
    return new Response('Signature invalide', { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const profileId = session.metadata?.profile_id
      const plan = session.metadata?.plan as 'famille' | 'serenite'

      if (!profileId || !plan) break

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

      await supabase
        .from('subscriptions')
        .upsert({
          profile_id: profileId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          plan,
          status: subscription.status === 'trialing' ? 'trialing' : 'active',
          trial_ends_at: subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toISOString()
            : null,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        }, { onConflict: 'profile_id' })

      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const customerId = sub.customer as string

      const { data: abonnement } = await supabase
        .from('subscriptions')
        .select('profile_id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (!abonnement) break

      const priceId = sub.items.data[0]?.price?.id
      const plan = priceId ? stripePlanToSeniorPlan(priceId) : 'famille'

      await supabase
        .from('subscriptions')
        .update({
          plan,
          status: sub.status as any,
          trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          cancel_at_period_end: sub.cancel_at_period_end,
        })
        .eq('stripe_customer_id', customerId)

      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await supabase
        .from('subscriptions')
        .update({ plan: 'free', status: 'canceled' })
        .eq('stripe_customer_id', sub.customer as string)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      await supabase
        .from('subscriptions')
        .update({ status: 'past_due' })
        .eq('stripe_customer_id', invoice.customer as string)
      break
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
