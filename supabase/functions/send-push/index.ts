import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { recipientId, title, body, data = {} } = await req.json()

  if (!recipientId || !title || !body) {
    return new Response(
      JSON.stringify({ error: 'recipientId, title et body sont requis' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Récupérer le token push
  const { data: profil } = await supabase
    .from('profiles')
    .select('push_token')
    .eq('id', recipientId)
    .single()

  const pushToken = profil?.push_token
  let pushStatus = 'sent'
  let ticketId: string | null = null

  if (pushToken && pushToken.startsWith('ExponentPushToken')) {
    try {
      const resp = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: pushToken,
          title,
          body,
          data,
          sound: 'default',
          priority: 'normal',
        }),
      })

      const result = await resp.json()
      const ticket = result.data
      ticketId = ticket?.id ?? null
      pushStatus = ticket?.status === 'ok' ? 'delivered' : 'failed'
    } catch (e) {
      console.error('[send-push] Erreur Expo:', e)
      pushStatus = 'failed'
    }
  } else {
    pushStatus = 'failed'
    console.warn('[send-push] Token push invalide ou absent pour:', recipientId)
  }

  // Journaliser la notification
  await supabase.from('notification_logs').insert({
    recipient_id: recipientId,
    notification_type: data.type ?? 'system',
    title,
    body,
    data,
    push_ticket_id: ticketId,
    push_status: pushStatus,
  })

  return new Response(
    JSON.stringify({ success: true, status: pushStatus }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
