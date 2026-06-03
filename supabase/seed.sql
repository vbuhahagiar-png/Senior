-- ============================================================
-- Senior+ Seed — Données de démonstration
-- À utiliser avec : supabase db reset
-- ============================================================

-- Création des utilisateurs de test via auth.users
DO $$
DECLARE
  id_marie UUID := '11111111-1111-1111-1111-111111111111';
  id_pierre UUID := '22222222-2222-2222-2222-222222222222';
  id_cercle UUID := '33333333-3333-3333-3333-333333333333';
BEGIN

  -- Utilisatrice senior : Marie Dubois (Je profite)
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
  VALUES (
    id_marie,
    'marie.demo@seniorplus.ch',
    crypt('SeniorPlus2024!', gen_salt('bf')),
    NOW(),
    '{"display_name": "Marie Dubois", "role": "profite", "language": "fr"}'
  ) ON CONFLICT DO NOTHING;

  -- Mise à jour profil Marie
  UPDATE public.profiles SET
    city = 'Genève',
    canton = 'GE',
    birth_date = '1954-03-15',
    interests = ARRAY['yoga', 'jardinage', 'lecture', 'peinture'],
    onboarding_done = TRUE,
    morning_ritual_time = '08:00:00'
  WHERE id = id_marie;

  -- Aidant : Pierre Dubois (fils de Marie)
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
  VALUES (
    id_pierre,
    'pierre.demo@seniorplus.ch',
    crypt('SeniorPlus2024!', gen_salt('bf')),
    NOW(),
    '{"display_name": "Pierre Dubois", "role": "accompagne", "language": "fr"}'
  ) ON CONFLICT DO NOTHING;

  UPDATE public.profiles SET
    city = 'Lausanne',
    canton = 'VD',
    onboarding_done = TRUE
  WHERE id = id_pierre;

  -- Cercle d'aidants
  INSERT INTO public.care_circles (id, senior_id, caregiver_id, relation, status, accepted_at, permissions)
  VALUES (
    id_cercle,
    id_marie,
    id_pierre,
    'fils',
    'active',
    NOW() - INTERVAL '30 days',
    '{"view_ritual": true, "view_mood": true, "view_medications": true, "view_letters": true, "receive_alerts": true}'
  ) ON CONFLICT DO NOTHING;

  -- Rituels des 7 derniers jours pour Marie
  INSERT INTO public.ritual_completions (profile_id, date, mood, steps_done, medications_checked, completed, completed_at)
  VALUES
    (id_marie, CURRENT_DATE, 4, ARRAY['meteo', 'citation', 'humeur'], FALSE, FALSE, NULL),
    (id_marie, CURRENT_DATE - 1, 5, ARRAY['meteo', 'citation', 'humeur', 'mouvement', 'medicaments'], TRUE, TRUE, NOW() - INTERVAL '1 day' + INTERVAL '9 hours'),
    (id_marie, CURRENT_DATE - 2, 3, ARRAY['humeur'], FALSE, FALSE, NULL),
    (id_marie, CURRENT_DATE - 3, 4, ARRAY['meteo', 'citation', 'humeur', 'mouvement'], FALSE, TRUE, NOW() - INTERVAL '3 days' + INTERVAL '8 hours 30 minutes'),
    (id_marie, CURRENT_DATE - 4, 5, ARRAY['meteo', 'citation', 'humeur', 'mouvement', 'medicaments'], TRUE, TRUE, NOW() - INTERVAL '4 days' + INTERVAL '8 hours'),
    (id_marie, CURRENT_DATE - 5, 4, ARRAY['humeur', 'mouvement'], FALSE, TRUE, NOW() - INTERVAL '5 days' + INTERVAL '9 hours 15 minutes'),
    (id_marie, CURRENT_DATE - 6, 3, ARRAY['humeur'], FALSE, TRUE, NOW() - INTERVAL '6 days' + INTERVAL '10 hours')
  ON CONFLICT (profile_id, date) DO NOTHING;

  -- Abonnements
  UPDATE public.subscriptions SET plan = 'famille', status = 'active' WHERE profile_id = id_pierre;

  -- Activités de démonstration à Genève
  INSERT INTO public.activities (
    source, external_id, title, description, category,
    location_name, location_address, lat, lng, city, canton,
    starts_at, is_recurring, intensity, is_free,
    source_url, organizer_name, tags, date_verified
  ) VALUES
    (
      'demo', 'demo-aquagym-1',
      'Aquagym seniors — Niveau débutant',
      'Cours d'aquagym spécialement adapté aux personnes de 60 ans et plus. Animé par un moniteur diplômé. Matériel fourni.',
      'sport',
      'Piscine des Bains des Pâquis', 'Quai du Mont-Blanc 30, 1201 Genève',
      46.2073, 6.1489, 'Genève', 'GE',
      NOW() + INTERVAL '1 day' + INTERVAL '10 hours',
      TRUE, 'douce', TRUE,
      'https://www.geneve.ch/sport', 'Service des sports Ville de Genève',
      ARRAY['sport', 'natation', 'aquagym', 'seniors', '60+'],
      NOW()
    ),
    (
      'demo', 'demo-yoga-1',
      'Yoga doux — Détente et équilibre',
      'Séance de yoga adaptée aux seniors. Travail sur la souplesse, la respiration et l'équilibre. Tous niveaux.',
      'sport',
      'Maison de quartier des Grottes', 'Rue de l'Industrie 5, 1201 Genève',
      46.2073, 6.1368, 'Genève', 'GE',
      NOW() + INTERVAL '2 days' + INTERVAL '14 hours',
      TRUE, 'douce', FALSE,
      'https://www.pro-senectute.ch/ge', 'Pro Senectute Genève',
      ARRAY['sport', 'yoga', 'seniors', 'bien-etre'],
      NOW()
    ),
    (
      'demo', 'demo-numerique-1',
      'Atelier numérique — Smartphone & Senior+',
      'Apprenez à utiliser votre smartphone et des applications utiles comme Senior +. Bénévoles présents pour vous aider.',
      'formation',
      'Bibliothèque de la Cité', 'Place des Trois-Perdrix 5, 1204 Genève',
      46.2017, 6.1469, 'Genève', 'GE',
      NOW() + INTERVAL '3 days' + INTERVAL '9 hours',
      FALSE, NULL, TRUE,
      'https://www.pro-senectute.ch/ge', 'Pro Senectute Genève',
      ARRAY['formation', 'numerique', 'seniors', 'smartphone'],
      NOW()
    )
  ON CONFLICT (source, external_id) DO NOTHING;

  -- Courrier de démonstration (en attente de décodage)
  INSERT INTO public.letters (
    senior_id, uploaded_by, storage_path, original_filename,
    decode_status, is_read
  ) VALUES (
    id_marie, id_pierre,
    'demo/demo-lettre-caisse-maladie.jpg',
    'lettre-lamal-2024.jpg',
    'done',
    FALSE
  ) ON CONFLICT DO NOTHING;

  -- Publication dans le fil familial
  INSERT INTO public.family_posts (senior_id, author_id, content, post_type)
  VALUES
    (id_marie, id_pierre, 'Bonjour maman ! Comment s'est passée ta journée ? 💛', 'message'),
    (id_marie, id_marie, 'J'ai adoré mon cours de yoga ce matin. La prof était très douce.', 'message')
  ON CONFLICT DO NOTHING;

END $$;
