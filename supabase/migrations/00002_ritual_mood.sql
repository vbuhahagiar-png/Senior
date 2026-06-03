-- ============================================================
-- Senior+ Migration 002 — Rituel du matin et humeur
-- ============================================================

CREATE TABLE public.ritual_completions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date                DATE NOT NULL,
  -- Humeur : 1=Difficile, 2=Pas terrible, 3=Moyen, 4=Bien, 5=Excellent
  mood                SMALLINT CHECK (mood BETWEEN 1 AND 5),
  mood_note           TEXT,
  -- Étapes complétées ['meteo', 'citation', 'humeur', 'mouvement', 'medicaments']
  steps_done          TEXT[] NOT NULL DEFAULT '{}',
  medications_checked BOOLEAN NOT NULL DEFAULT FALSE,
  medications_count   SMALLINT DEFAULT 0,
  completed           BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at        TIMESTAMPTZ,
  note                TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (profile_id, date),
  -- Pas de date future (tolérance d'un jour pour les fuseaux horaires)
  CONSTRAINT date_raisonnable CHECK (date <= CURRENT_DATE + INTERVAL '1 day')
);

COMMENT ON TABLE public.ritual_completions IS 'Un enregistrement par senior par jour — source de vérité du rituel matin';
COMMENT ON COLUMN public.ritual_completions.mood IS '1=Difficile, 2=Pas terrible, 3=Moyen, 4=Bien, 5=Excellent';

CREATE TRIGGER ritual_updated_at
  BEFORE UPDATE ON public.ritual_completions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_ritual_profile_date ON public.ritual_completions(profile_id, date DESC);
CREATE INDEX idx_ritual_date ON public.ritual_completions(date);
CREATE INDEX idx_ritual_completed ON public.ritual_completions(profile_id, completed) WHERE completed = FALSE;

ALTER TABLE public.ritual_completions ENABLE ROW LEVEL SECURITY;

-- Tâche cron : alerte aidants si check-in manquant à 11h05 chaque matin
SELECT cron.schedule(
  'alerte-checkin-manquant',
  '5 11 * * *',
  $$
    SELECT extensions.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/send-alert-missed-ritual',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.service_role_key')
      ),
      body := '{}'::jsonb
    );
  $$
);
