import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { letterId } = await req.json()
  if (!letterId) {
    return new Response(JSON.stringify({ error: 'letterId manquant' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Marquer comme en cours
  await supabase
    .from('letters')
    .update({ decode_status: 'processing' })
    .eq('id', letterId)

  try {
    // Récupérer les infos du courrier
    const { data: lettre, error: lettreErr } = await supabase
      .from('letters')
      .select('*')
      .eq('id', letterId)
      .single()

    if (lettreErr || !lettre) throw new Error('Courrier non trouvé')

    // Télécharger l'image depuis Supabase Storage
    const { data: imageData, error: imgErr } = await supabase
      .storage
      .from('letters')
      .download(lettre.storage_path)

    if (imgErr || !imageData) throw new Error('Image non trouvée dans le stockage')

    // Convertir en base64
    const arrayBuffer = await imageData.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    const mimeType = lettre.storage_path.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'

    // Appel OpenAI GPT-4o Vision
    const openaiResp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 1500,
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant bienveillant qui aide des personnes âgées à comprendre leurs courriers administratifs et médicaux en Suisse.
Explique le contenu du courrier en langage simple et clair, comme si tu parlais à un proche de 70 ans.
Réponds UNIQUEMENT en JSON avec cette structure :
{
  "explication": "Explication claire en 3-5 phrases simples",
  "expediteur": "Nom de l'expéditeur supposé",
  "categorie": "medical|administratif|bancaire|assurance|impots|autre",
  "actions": [
    {"label": "Action à faire", "description": "Description courte"},
    ...
  ],
  "urgence": false
}
IMPORTANT: Ne jamais inventer d'informations. Rester factuel et bienveillant.`,
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64}`,
                  detail: 'high',
                },
              },
              {
                type: 'text',
                text: 'Explique ce courrier en langage simple pour une personne âgée.',
              },
            ],
          },
        ],
      }),
    })

    if (!openaiResp.ok) {
      throw new Error(`OpenAI erreur: ${openaiResp.status}`)
    }

    const openaiData = await openaiResp.json()
    const contenu = openaiData.choices?.[0]?.message?.content

    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(contenu)
    } catch {
      parsed = {
        explication: contenu,
        expediteur: null,
        categorie: 'autre',
        actions: [],
      }
    }

    // Mettre à jour le courrier avec le résultat
    await supabase
      .from('letters')
      .update({
        decoded_text: parsed.explication as string,
        sender_hint: parsed.expediteur as string,
        sender_category: parsed.categorie as string,
        actions_suggested: parsed.actions ?? [],
        decoded_at: new Date().toISOString(),
        decode_status: 'done',
      })
      .eq('id', letterId)

    // Envoyer une notification push au senior
    await supabase.functions.invoke('send-push', {
      body: {
        recipientId: lettre.senior_id,
        title: 'Courrier décodé ✉️',
        body: `Votre courrier de ${parsed.expediteur ?? 'votre expéditeur'} a été expliqué en clair.`,
        data: { screen: 'letters', letterId },
      },
    })

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[decode-letter]', error)

    await supabase
      .from('letters')
      .update({
        decode_status: 'failed',
        decode_error: error instanceof Error ? error.message : 'Erreur inconnue',
      })
      .eq('id', letterId)

    return new Response(
      JSON.stringify({ error: 'Décodage échoué' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
