-- ============================================================
-- Senior+ Migration 004 — Activités et événements
-- ============================================================

-- Catalogue d'activités (alimenté par l'agent quotidien)
CREATE TABLE public.activities (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source            TEXT NOT NULL DEFAULT 'openagenda',
  external_id       TEXT NOT NULL,
  title             TEXT NOT NULL,
  description       TEXT,
  category          TEXT,
  location_name     TEXT,
  location_address  TEXT,
  lat               FLOAT8,
  lng               FLOAT8,
  city              TEXT,
  canton            TEXT,
  starts_at         TIMESTAMPTZ,
  ends_at           TIMESTAMPTZ,
  is_recurring      BOOLEAN NOT NULL DEFAULT FALSE,
  recurrence_info   TEXT,
  intensity         TEXT CHECK (intensity IN ('douce', 'moderee', 'intense')),
  price_chf         NUMERIC(8,2),
  is_free           BOOLEAN NOT NULL DEFAULT FALSE,
  registration_url  TEXT,
  source_url        TEXT NOT NULL,
  organizer_name    TEXT,
  organizer_phone   TEXT,
  organizer_email   TEXT,
  max_participants  INT,
  min_age           SMALLINT,
  max_age           SMALLINT,
  tags              TEXT[] DEFAULT '{}',
  raw_json          JSONB,
  date_verified     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_new            BOOLEAN NOT NULL DEFAULT TRUE,
  is_changed        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source, external_id)
);

COMMENT ON TABLE public.activities IS 'Catalogue d'activités Senior+ — alimenté par l'agent quotidien OpenAgenda';
COMMENT ON COLUMN public.activities.source_url IS 'URL source obligatoire — Senior+ n'invente jamais de données';

CREATE TRIGGER activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_activities_canton_cat ON public.activities(canton, category);
CREATE INDEX idx_activities_starts ON public.activities(starts_at) WHERE starts_at IS NOT NULL;
CREATE INDEX idx_activities_city ON public.activities(city);
CREATE INDEX idx_activities_new ON public.activities(is_new) WHERE is_new = TRUE;
CREATE INDEX idx_activities_source ON public.activities(source, external_id);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Activités sauvegardées par un utilisateur
CREATE TABLE public.saved_activities (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_id       UUID REFERENCES public.activities(id) ON DELETE SET NULL,
  source            TEXT NOT NULL DEFAULT 'openagenda',
  external_id       TEXT NOT NULL,
  title             TEXT NOT NULL,
  starts_at         TIMESTAMPTZ,
  saved_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  added_to_calendar BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (profile_id, external_id)
);

CREATE INDEX idx_saved_profile ON public.saved_activities(profile_id, starts_at);

ALTER TABLE public.saved_activities ENABLE ROW LEVEL SECURITY;

-- Participations aux activités (qui de mon cercle y va)
CREATE TABLE public.activity_participations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id            UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_external_id  TEXT NOT NULL,
  activity_title        TEXT NOT NULL,
  confirmed             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (profile_id, activity_external_id)
);

CREATE INDEX idx_participations_activity ON public.activity_participations(activity_external_id);

ALTER TABLE public.activity_participations ENABLE ROW LEVEL SECURITY;
