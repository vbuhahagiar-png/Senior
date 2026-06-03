-- ============================================================
-- Senior+ Migration 006 — Abonnements et notifications
-- ============================================================

-- Abonnements Stripe (source de vérité, mise à jour par webhook)
CREATE TABLE public.subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id              UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id      TEXT UNIQUE,
  stripe_subscription_id  TEXT UNIQUE,
  plan                    TEXT NOT NULL DEFAULT 'free'
                          CHECK (plan IN ('free', 'famille', 'serenite')),
  status                  TEXT NOT NULL DEFAULT 'active'
                          CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'unpaid')),
  trial_ends_at           TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  cancel_at_period_end    BOOLEAN NOT NULL DEFAULT FALSE,
  addons                  JSONB DEFAULT '[]',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (profile_id)
);

COMMENT ON TABLE public.subscriptions IS 'État des abonnements — mis à jour uniquement par les webhooks Stripe (service_role)';

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_subscriptions_customer ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_plan ON public.subscriptions(plan);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Création automatique d'un abonnement gratuit à la création du profil
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.subscriptions (profile_id, plan, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT (profile_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile();

-- Préférences de notifications
CREATE TABLE public.notification_preferences (
  profile_id                  UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  ritual_reminder             BOOLEAN NOT NULL DEFAULT TRUE,
  ritual_reminder_time        TIME DEFAULT '08:00:00',
  ritual_missed_alert         BOOLEAN NOT NULL DEFAULT TRUE,
  ritual_missed_threshold     TIME DEFAULT '11:00:00',
  medication_reminder         BOOLEAN NOT NULL DEFAULT TRUE,
  appointment_reminder        BOOLEAN NOT NULL DEFAULT TRUE,
  letter_decoded              BOOLEAN NOT NULL DEFAULT TRUE,
  activity_suggestion         BOOLEAN NOT NULL DEFAULT TRUE,
  weekly_summary              BOOLEAN NOT NULL DEFAULT TRUE,
  weekly_summary_day          SMALLINT DEFAULT 0 CHECK (weekly_summary_day BETWEEN 0 AND 6),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Journal des notifications envoyées (audit trail)
CREATE TABLE public.notification_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  triggered_by      UUID REFERENCES public.profiles(id),
  notification_type TEXT NOT NULL,
  title             TEXT NOT NULL,
  body              TEXT NOT NULL,
  data              JSONB DEFAULT '{}',
  sent_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at           TIMESTAMPTZ,
  push_ticket_id    TEXT,
  push_status       TEXT DEFAULT 'pending'
                    CHECK (push_status IN ('pending', 'sent', 'delivered', 'failed'))
);

CREATE INDEX idx_notif_recipient ON public.notification_logs(recipient_id, sent_at DESC);
CREATE INDEX idx_notif_type ON public.notification_logs(notification_type, sent_at DESC);

ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;
