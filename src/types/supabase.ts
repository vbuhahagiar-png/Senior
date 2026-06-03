export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'profite' | 'accompagne'
          display_name: string
          avatar_url: string | null
          city: string | null
          canton: string | null
          birth_date: string | null
          language: 'fr' | 'de' | 'it'
          interests: string[]
          timezone: string
          push_token: string | null
          accessibility_large_text: boolean
          accessibility_voice: boolean
          accessibility_high_contrast: boolean
          morning_ritual_time: string
          onboarding_done: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'> & {
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      care_circles: {
        Row: {
          id: string
          senior_id: string
          caregiver_id: string
          relation: string | null
          permissions: {
            view_ritual: boolean
            view_mood: boolean
            view_medications: boolean
            view_letters: boolean
            receive_alerts: boolean
          }
          status: 'pending' | 'active' | 'revoked'
          invited_by: string | null
          invited_at: string
          accepted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['care_circles']['Row'], 'invited_at'> & {
          invited_at?: string
        }
        Update: Partial<Database['public']['Tables']['care_circles']['Insert']>
      }
      ritual_completions: {
        Row: {
          id: string
          profile_id: string
          date: string
          mood: number | null
          mood_note: string | null
          steps_done: string[]
          medications_checked: boolean
          medications_count: number
          completed: boolean
          completed_at: string | null
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['ritual_completions']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['ritual_completions']['Insert']>
      }
      activities: {
        Row: {
          id: string
          source: string
          external_id: string
          title: string
          description: string | null
          category: string | null
          location_name: string | null
          location_address: string | null
          lat: number | null
          lng: number | null
          city: string | null
          canton: string | null
          starts_at: string | null
          ends_at: string | null
          is_recurring: boolean
          recurrence_info: string | null
          intensity: 'douce' | 'moderee' | 'intense' | null
          price_chf: number | null
          is_free: boolean
          registration_url: string | null
          source_url: string
          organizer_name: string | null
          organizer_phone: string | null
          organizer_email: string | null
          max_participants: number | null
          min_age: number | null
          max_age: number | null
          tags: string[]
          raw_json: Json | null
          date_verified: string
          is_new: boolean
          is_changed: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['activities']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['activities']['Insert']>
      }
      saved_activities: {
        Row: {
          id: string
          profile_id: string
          activity_id: string | null
          source: string
          external_id: string
          title: string
          starts_at: string | null
          saved_at: string
          added_to_calendar: boolean
        }
        Insert: Omit<Database['public']['Tables']['saved_activities']['Row'], 'id' | 'saved_at'> & {
          id?: string
          saved_at?: string
        }
        Update: Partial<Database['public']['Tables']['saved_activities']['Insert']>
      }
      letters: {
        Row: {
          id: string
          senior_id: string
          uploaded_by: string
          storage_path: string
          original_filename: string | null
          decoded_text: string | null
          sender_hint: string | null
          sender_category: 'medical' | 'administratif' | 'bancaire' | 'assurance' | 'impots' | 'autre' | null
          actions_suggested: Json
          decoded_at: string | null
          decode_status: 'pending' | 'processing' | 'done' | 'failed'
          decode_error: string | null
          is_read: boolean
          read_at: string | null
          is_archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['letters']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['letters']['Insert']>
      }
      companion_sessions: {
        Row: {
          id: string
          profile_id: string
          started_at: string
          ended_at: string | null
          duration_s: number | null
          turn_count: number
          summary: string | null
          transcript: Json
          sentiment: 'positif' | 'neutre' | 'preoccupant' | null
          escalated: boolean
          escalated_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['companion_sessions']['Row'], 'id' | 'started_at'> & {
          id?: string
          started_at?: string
        }
        Update: Partial<Database['public']['Tables']['companion_sessions']['Insert']>
      }
      subscriptions: {
        Row: {
          id: string
          profile_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan: 'free' | 'famille' | 'serenite'
          status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
          trial_ends_at: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          addons: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>
      }
      notification_logs: {
        Row: {
          id: string
          recipient_id: string
          triggered_by: string | null
          notification_type: string
          title: string
          body: string
          data: Json
          sent_at: string
          read_at: string | null
          push_ticket_id: string | null
          push_status: 'pending' | 'sent' | 'delivered' | 'failed'
        }
        Insert: Omit<Database['public']['Tables']['notification_logs']['Row'], 'id' | 'sent_at'> & {
          id?: string
          sent_at?: string
        }
        Update: Partial<Database['public']['Tables']['notification_logs']['Insert']>
      }
      circle_tasks: {
        Row: {
          id: string
          circle_id: string
          title: string
          description: string | null
          assigned_to: string | null
          due_date: string | null
          due_time: string | null
          recurrence: 'none' | 'daily' | 'weekly' | 'monthly' | null
          recurrence_day: number | null
          completed: boolean
          completed_at: string | null
          completed_by: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['circle_tasks']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['circle_tasks']['Insert']>
      }
      family_posts: {
        Row: {
          id: string
          senior_id: string
          author_id: string
          content: string | null
          image_urls: string[]
          post_type: 'message' | 'photo' | 'milestone' | 'activity'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['family_posts']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['family_posts']['Insert']>
      }
      appointments: {
        Row: {
          id: string
          profile_id: string
          title: string
          appointment_type: 'medical' | 'administratif' | 'social' | 'autre' | 'general'
          location: string | null
          doctor_name: string | null
          platform_url: string | null
          starts_at: string
          ends_at: string | null
          reminder_day_before: boolean
          reminder_hours_before: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['appointments']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['appointments']['Insert']>
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      role_utilisateur: 'profite' | 'accompagne'
      statut_cercle: 'pending' | 'active' | 'revoked'
      statut_abonnement: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
      plan_abonnement: 'free' | 'famille' | 'serenite'
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Profile = Tables<'profiles'>
export type CareCircle = Tables<'care_circles'>
export type RitualCompletion = Tables<'ritual_completions'>
export type Activity = Tables<'activities'>
export type SavedActivity = Tables<'saved_activities'>
export type Letter = Tables<'letters'>
export type CompanionSession = Tables<'companion_sessions'>
export type Subscription = Tables<'subscriptions'>
export type CircleTask = Tables<'circle_tasks'>
export type FamilyPost = Tables<'family_posts'>
export type Appointment = Tables<'appointments'>
