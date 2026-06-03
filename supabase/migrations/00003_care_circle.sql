-- ============================================================
-- Senior+ Migration 003 — Cercle d'aidants et fil familial
-- ============================================================

-- Cercle de soins (relation senior ↔ aidant)
CREATE TABLE public.care_circles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  senior_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  caregiver_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  relation      TEXT,
  -- Droits d'accès granulaires
  permissions   JSONB NOT NULL DEFAULT '{
    "view_ritual": true,
    "view_mood": true,
    "view_medications": false,
    "view_letters": false,
    "receive_alerts": true
  }',
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'active', 'revoked')),
  invited_by    UUID REFERENCES public.profiles(id),
  invited_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at   TIMESTAMPTZ,
  UNIQUE (senior_id, caregiver_id),
  CONSTRAINT no_self_care CHECK (senior_id != caregiver_id)
);

COMMENT ON TABLE public.care_circles IS 'Relation senior ↔ aidant avec droits d'accès granulaires';
COMMENT ON COLUMN public.care_circles.permissions IS 'Droits : view_ritual, view_mood, view_medications, view_letters, receive_alerts';

CREATE INDEX idx_circle_senior ON public.care_circles(senior_id, status);
CREATE INDEX idx_circle_caregiver ON public.care_circles(caregiver_id, status);

ALTER TABLE public.care_circles ENABLE ROW LEVEL SECURITY;

-- Tâches du cercle (qui appelle, qui accompagne au RDV, etc.)
CREATE TABLE public.circle_tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id       UUID NOT NULL REFERENCES public.care_circles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  assigned_to     UUID REFERENCES public.profiles(id),
  due_date        DATE,
  due_time        TIME,
  recurrence      TEXT DEFAULT 'none' CHECK (recurrence IN ('none', 'daily', 'weekly', 'monthly')),
  recurrence_day  SMALLINT,
  completed       BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at    TIMESTAMPTZ,
  completed_by    UUID REFERENCES public.profiles(id),
  created_by      UUID NOT NULL REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER circle_tasks_updated_at
  BEFORE UPDATE ON public.circle_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_tasks_circle ON public.circle_tasks(circle_id, completed, due_date);

ALTER TABLE public.circle_tasks ENABLE ROW LEVEL SECURITY;

-- Fil familial (messages, photos, jalons)
CREATE TABLE public.family_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  senior_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES public.profiles(id),
  content     TEXT,
  image_urls  TEXT[] DEFAULT '{}',
  post_type   TEXT NOT NULL DEFAULT 'message'
              CHECK (post_type IN ('message', 'photo', 'milestone', 'activity')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_senior ON public.family_posts(senior_id, created_at DESC);

ALTER TABLE public.family_posts ENABLE ROW LEVEL SECURITY;

-- Rendez-vous
CREATE TABLE public.appointments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id            UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title                 TEXT NOT NULL,
  appointment_type      TEXT DEFAULT 'general'
                        CHECK (appointment_type IN ('medical', 'administratif', 'social', 'autre', 'general')),
  location              TEXT,
  doctor_name           TEXT,
  platform_url          TEXT,
  starts_at             TIMESTAMPTZ NOT NULL,
  ends_at               TIMESTAMPTZ,
  reminder_day_before   BOOLEAN NOT NULL DEFAULT TRUE,
  reminder_hours_before SMALLINT DEFAULT 2,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_appointments_profile ON public.appointments(profile_id, starts_at);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
