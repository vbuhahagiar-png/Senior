-- ============================================================
-- Senior+ Migration 001 — Profils utilisateurs
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_net" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pg_cron" SCHEMA cron;

-- Table principale des profils (extension de auth.users)
CREATE TABLE public.profiles (
  id                        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role                      TEXT NOT NULL CHECK (role IN ('profite', 'accompagne')),
  display_name              TEXT NOT NULL,
  avatar_url                TEXT,
  city                      TEXT,
  canton                    TEXT CHECK (
                              canton IS NULL OR canton IN (
                                'VD','GE','VS','FR','NE','JU','BE','AG','ZH',
                                'BS','BL','SO','LU','SG','GR','TI','AI','AR',
                                'GL','SH','TG','ZG','OW','NW','UR','SZ'
                              )
                            ),
  birth_date                DATE,
  language                  TEXT NOT NULL DEFAULT 'fr' CHECK (language IN ('fr', 'de', 'it')),
  interests                 TEXT[] DEFAULT '{}',
  timezone                  TEXT NOT NULL DEFAULT 'Europe/Zurich',
  push_token                TEXT,
  -- Accessibilité
  accessibility_large_text  BOOLEAN NOT NULL DEFAULT FALSE,
  accessibility_voice       BOOLEAN NOT NULL DEFAULT FALSE,
  accessibility_high_contrast BOOLEAN NOT NULL DEFAULT FALSE,
  -- Rituel
  morning_ritual_time       TIME DEFAULT '08:00:00',
  -- Onboarding
  onboarding_done           BOOLEAN NOT NULL DEFAULT FALSE,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Profils utilisateurs Senior+ (extension de auth.users)';
COMMENT ON COLUMN public.profiles.role IS 'profite = retraité actif, accompagne = proche aidant';

-- Trigger de mise à jour automatique du champ updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Création automatique d'un profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role, language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'profite'),
    COALESCE(NEW.raw_user_meta_data->>'language', 'fr')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Index
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_canton ON public.profiles(canton) WHERE canton IS NOT NULL;
CREATE INDEX idx_profiles_city ON public.profiles(city) WHERE city IS NOT NULL;

-- Activer RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
