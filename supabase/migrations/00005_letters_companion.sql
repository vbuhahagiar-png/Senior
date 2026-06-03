-- ============================================================
-- Senior+ Migration 005 — Courriers et compagnon vocal
-- ============================================================

-- Courriers physiques décodés par IA
CREATE TABLE public.letters (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  senior_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  uploaded_by       UUID NOT NULL REFERENCES public.profiles(id),
  storage_path      TEXT NOT NULL,
  original_filename TEXT,
  decoded_text      TEXT,
  sender_hint       TEXT,
  sender_category   TEXT CHECK (
                      sender_category IS NULL OR
                      sender_category IN ('medical', 'administratif', 'bancaire', 'assurance', 'impots', 'autre')
                    ),
  actions_suggested JSONB DEFAULT '[]',
  decoded_at        TIMESTAMPTZ,
  decode_status     TEXT NOT NULL DEFAULT 'pending'
                    CHECK (decode_status IN ('pending', 'processing', 'done', 'failed')),
  decode_error      TEXT,
  is_read           BOOLEAN NOT NULL DEFAULT FALSE,
  read_at           TIMESTAMPTZ,
  is_archived       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.letters IS 'Courriers photographiés et décodés par IA — stockés chiffrés dans Supabase Storage';
COMMENT ON COLUMN public.letters.actions_suggested IS 'Actions suggérées par l'IA : [{label, description, url?}]';

CREATE TRIGGER letters_updated_at
  BEFORE UPDATE ON public.letters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_letters_senior ON public.letters(senior_id, created_at DESC);
CREATE INDEX idx_letters_status ON public.letters(decode_status) WHERE decode_status IN ('pending', 'processing');

ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;

-- Sessions du compagnon vocal
CREATE TABLE public.companion_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at    TIMESTAMPTZ,
  duration_s  INTEGER,
  turn_count  INTEGER NOT NULL DEFAULT 0,
  summary     TEXT,
  -- Fenêtre glissante des 10 derniers tours (minimisation des données)
  transcript  JSONB DEFAULT '[]',
  sentiment   TEXT CHECK (sentiment IS NULL OR sentiment IN ('positif', 'neutre', 'preoccupant')),
  escalated   BOOLEAN NOT NULL DEFAULT FALSE,
  escalated_at TIMESTAMPTZ
);

COMMENT ON TABLE public.companion_sessions IS 'Sessions du compagnon vocal — transcrit limité aux 10 derniers tours';

CREATE INDEX idx_companion_profile ON public.companion_sessions(profile_id, started_at DESC);

ALTER TABLE public.companion_sessions ENABLE ROW LEVEL SECURITY;
