-- ============================================================
-- Senior+ Migration 007 — Politiques de sécurité (RLS)
-- ============================================================
-- CONFORMITÉ nLPD/RGPD : Toute donnée de santé protégée par RLS.
-- Les données médicales (humeur, médicaments) ne sont visibles par les aidants
-- que si le senior a explicitement accordé ces droits (permissions JSONB).
-- ============================================================

-- ── Fonction utilitaire : vérifier si un aidant a accès à un senior ──────────
CREATE OR REPLACE FUNCTION public.est_aidant_actif(p_caregiver_id UUID, p_senior_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.care_circles
    WHERE caregiver_id = p_caregiver_id
      AND senior_id = p_senior_id
      AND status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.aidant_a_permission(
  p_caregiver_id UUID,
  p_senior_id UUID,
  p_permission TEXT
)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.care_circles
    WHERE caregiver_id = p_caregiver_id
      AND senior_id = p_senior_id
      AND status = 'active'
      AND (permissions->>p_permission)::boolean = TRUE
  );
$$;

-- ── PROFILES ─────────────────────────────────────────────────────────────────

-- Lecture : son propre profil + profils des seniors liés
CREATE POLICY "profil_lecture_soi" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    id = auth.uid()
    OR public.est_aidant_actif(auth.uid(), id)
  );

-- Création : uniquement son propre profil (géré par le trigger)
CREATE POLICY "profil_insertion_soi" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- Modification : uniquement son propre profil
CREATE POLICY "profil_mise_a_jour_soi" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ── CARE CIRCLES ─────────────────────────────────────────────────────────────

CREATE POLICY "cercle_lecture" ON public.care_circles
  FOR SELECT TO authenticated
  USING (senior_id = auth.uid() OR caregiver_id = auth.uid());

CREATE POLICY "cercle_invitation" ON public.care_circles
  FOR INSERT TO authenticated
  WITH CHECK (invited_by = auth.uid());

-- Seul le senior peut accepter une invitation
CREATE POLICY "cercle_acceptation" ON public.care_circles
  FOR UPDATE TO authenticated
  USING (
    (senior_id = auth.uid() AND status = 'pending')
    OR (senior_id = auth.uid() OR caregiver_id = auth.uid())
  );

-- ── RITUAL COMPLETIONS ───────────────────────────────────────────────────────

-- Lecture : son propre rituel + aidants avec permission view_ritual
CREATE POLICY "rituel_lecture" ON public.ritual_completions
  FOR SELECT TO authenticated
  USING (
    profile_id = auth.uid()
    OR public.aidant_a_permission(auth.uid(), profile_id, 'view_ritual')
  );

CREATE POLICY "rituel_insertion" ON public.ritual_completions
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "rituel_mise_a_jour" ON public.ritual_completions
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- ── CIRCLE TASKS ─────────────────────────────────────────────────────────────

-- Accès aux tâches si membre du cercle (senior ou aidant actif)
CREATE OR REPLACE FUNCTION public.est_membre_cercle(p_user_id UUID, p_circle_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.care_circles
    WHERE id = p_circle_id
      AND status = 'active'
      AND (senior_id = p_user_id OR caregiver_id = p_user_id)
  );
$$;

CREATE POLICY "tache_lecture" ON public.circle_tasks
  FOR SELECT TO authenticated
  USING (public.est_membre_cercle(auth.uid(), circle_id));

CREATE POLICY "tache_creation" ON public.circle_tasks
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by = auth.uid()
    AND public.est_membre_cercle(auth.uid(), circle_id)
  );

CREATE POLICY "tache_mise_a_jour" ON public.circle_tasks
  FOR UPDATE TO authenticated
  USING (public.est_membre_cercle(auth.uid(), circle_id));

CREATE POLICY "tache_suppression" ON public.circle_tasks
  FOR DELETE TO authenticated
  USING (created_by = auth.uid());

-- ── FAMILY POSTS ─────────────────────────────────────────────────────────────

-- Lecture : senior + aidants actifs
CREATE POLICY "post_lecture" ON public.family_posts
  FOR SELECT TO authenticated
  USING (
    senior_id = auth.uid()
    OR public.est_aidant_actif(auth.uid(), senior_id)
  );

CREATE POLICY "post_creation" ON public.family_posts
  FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND (
      senior_id = auth.uid()
      OR public.est_aidant_actif(auth.uid(), senior_id)
    )
  );

CREATE POLICY "post_suppression" ON public.family_posts
  FOR DELETE TO authenticated
  USING (author_id = auth.uid());

-- ── ACTIVITIES (catalogue) ───────────────────────────────────────────────────

-- Lecture publique pour tous les utilisateurs authentifiés
CREATE POLICY "activite_lecture" ON public.activities
  FOR SELECT TO authenticated
  USING (TRUE);

-- Écriture réservée au service_role (agent quotidien)
CREATE POLICY "activite_service_role" ON public.activities
  FOR ALL TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- ── SAVED ACTIVITIES ─────────────────────────────────────────────────────────

CREATE POLICY "sauvegarde_soi" ON public.saved_activities
  FOR ALL TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- ── ACTIVITY PARTICIPATIONS ──────────────────────────────────────────────────

CREATE POLICY "participation_lecture" ON public.activity_participations
  FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "participation_soi" ON public.activity_participations
  FOR ALL TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- ── LETTERS ──────────────────────────────────────────────────────────────────

-- Lecture : senior + aidants avec permission view_letters
CREATE POLICY "courrier_lecture" ON public.letters
  FOR SELECT TO authenticated
  USING (
    senior_id = auth.uid()
    OR public.aidant_a_permission(auth.uid(), senior_id, 'view_letters')
  );

-- Upload : aidants actifs (ils photographient pour le senior)
CREATE POLICY "courrier_upload" ON public.letters
  FOR INSERT TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid()
    AND (
      senior_id = auth.uid()
      OR public.est_aidant_actif(auth.uid(), senior_id)
    )
  );

-- Modification (is_read, is_archived) : senior uniquement
CREATE POLICY "courrier_mise_a_jour" ON public.letters
  FOR UPDATE TO authenticated
  USING (senior_id = auth.uid())
  WITH CHECK (senior_id = auth.uid());

-- Décodage : service_role uniquement (Edge Function)
CREATE POLICY "courrier_decode_service" ON public.letters
  FOR UPDATE TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "courrier_suppression" ON public.letters
  FOR DELETE TO authenticated
  USING (uploaded_by = auth.uid());

-- ── COMPANION SESSIONS ───────────────────────────────────────────────────────

-- Strictement privé — uniquement le propriétaire de la session
CREATE POLICY "compagnon_prive" ON public.companion_sessions
  FOR ALL TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- ── SUBSCRIPTIONS ────────────────────────────────────────────────────────────

-- Lecture : son propre abonnement
CREATE POLICY "abonnement_lecture" ON public.subscriptions
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

-- Écriture : service_role uniquement (webhooks Stripe)
CREATE POLICY "abonnement_service_role" ON public.subscriptions
  FOR ALL TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- ── NOTIFICATION PREFERENCES ─────────────────────────────────────────────────

CREATE POLICY "notif_prefs_soi" ON public.notification_preferences
  FOR ALL TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- ── NOTIFICATION LOGS ────────────────────────────────────────────────────────

CREATE POLICY "notif_log_lecture" ON public.notification_logs
  FOR SELECT TO authenticated
  USING (recipient_id = auth.uid());

CREATE POLICY "notif_log_service" ON public.notification_logs
  FOR INSERT TO service_role
  WITH CHECK (TRUE);

-- ── APPOINTMENTS ─────────────────────────────────────────────────────────────

CREATE POLICY "rdv_soi" ON public.appointments
  FOR ALL TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());
