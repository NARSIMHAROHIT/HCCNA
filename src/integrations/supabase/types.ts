export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      announcements: {
        Row: {
          body: string | null;
          created_at: string;
          ends_at: string | null;
          id: string;
          is_published: boolean;
          link_url: string | null;
          starts_at: string;
          temple_id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          ends_at?: string | null;
          id?: string;
          is_published?: boolean;
          link_url?: string | null;
          starts_at?: string;
          temple_id: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          ends_at?: string | null;
          id?: string;
          is_published?: boolean;
          link_url?: string | null;
          starts_at?: string;
          temple_id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "announcements_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          action: string;
          actor_id: string | null;
          changes: Json | null;
          created_at: string;
          entity: string | null;
          entity_id: string | null;
          id: string;
          metadata: Json | null;
          temple_id: string | null;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          changes?: Json | null;
          created_at?: string;
          entity?: string | null;
          entity_id?: string | null;
          id?: string;
          metadata?: Json | null;
          temple_id?: string | null;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          changes?: Json | null;
          created_at?: string;
          entity?: string | null;
          entity_id?: string | null;
          id?: string;
          metadata?: Json | null;
          temple_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      board_members: {
        Row: {
          bio: string | null;
          created_at: string;
          display_order: number;
          email: string | null;
          full_name: string;
          id: string;
          is_active: boolean;
          phone: string | null;
          photo_url: string | null;
          position: string | null;
          temple_id: string;
          term: string | null;
          updated_at: string;
        };
        Insert: {
          bio?: string | null;
          created_at?: string;
          display_order?: number;
          email?: string | null;
          full_name: string;
          id?: string;
          is_active?: boolean;
          phone?: string | null;
          photo_url?: string | null;
          position?: string | null;
          temple_id: string;
          term?: string | null;
          updated_at?: string;
        };
        Update: {
          bio?: string | null;
          created_at?: string;
          display_order?: number;
          email?: string | null;
          full_name?: string;
          id?: string;
          is_active?: boolean;
          phone?: string | null;
          photo_url?: string | null;
          position?: string | null;
          temple_id?: string;
          term?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "board_members_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings: {
        Row: {
          address: string | null;
          admin_notes: string | null;
          amount_cents: number;
          completed_at: string | null;
          contact_email: string | null;
          contact_name: string | null;
          contact_phone: string | null;
          created_at: string;
          ends_at: string;
          gotra: string | null;
          id: string;
          location_type: string;
          nakshatra: string | null;
          notes: string | null;
          payment_status: Database["public"]["Enums"]["payment_status"];
          priest_id: string | null;
          priest_notes: string | null;
          reference: string;
          service_id: string;
          starts_at: string;
          status: Database["public"]["Enums"]["booking_status"];
          temple_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          address?: string | null;
          admin_notes?: string | null;
          amount_cents?: number;
          completed_at?: string | null;
          contact_email?: string | null;
          contact_name?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          ends_at: string;
          gotra?: string | null;
          id?: string;
          location_type?: string;
          nakshatra?: string | null;
          notes?: string | null;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          priest_id?: string | null;
          priest_notes?: string | null;
          reference?: string;
          service_id: string;
          starts_at: string;
          status?: Database["public"]["Enums"]["booking_status"];
          temple_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          address?: string | null;
          admin_notes?: string | null;
          amount_cents?: number;
          completed_at?: string | null;
          contact_email?: string | null;
          contact_name?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          ends_at?: string;
          gotra?: string | null;
          id?: string;
          location_type?: string;
          nakshatra?: string | null;
          notes?: string | null;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          priest_id?: string | null;
          priest_notes?: string | null;
          reference?: string;
          service_id?: string;
          starts_at?: string;
          status?: Database["public"]["Enums"]["booking_status"];
          temple_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_priest_id_fkey";
            columns: ["priest_id"];
            isOneToOne: false;
            referencedRelation: "priests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      books: {
        Row: {
          author: string | null;
          category: string | null;
          cover_url: string | null;
          created_at: string;
          description: string | null;
          display_order: number;
          external_url: string | null;
          file_url: string | null;
          id: string;
          language: string | null;
          publication_info: string | null;
          temple_id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          author?: string | null;
          category?: string | null;
          cover_url?: string | null;
          created_at?: string;
          description?: string | null;
          display_order?: number;
          external_url?: string | null;
          file_url?: string | null;
          id?: string;
          language?: string | null;
          publication_info?: string | null;
          temple_id: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          author?: string | null;
          category?: string | null;
          cover_url?: string | null;
          created_at?: string;
          description?: string | null;
          display_order?: number;
          external_url?: string | null;
          file_url?: string | null;
          id?: string;
          language?: string | null;
          publication_info?: string | null;
          temple_id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "books_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      deities: {
        Row: {
          created_at: string;
          description: string | null;
          display_order: number;
          id: string;
          image_url: string | null;
          name: string;
          temple_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          display_order?: number;
          id?: string;
          image_url?: string | null;
          name: string;
          temple_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          display_order?: number;
          id?: string;
          image_url?: string | null;
          name?: string;
          temple_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "deities_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      donations: {
        Row: {
          amount_cents: number;
          category: string;
          created_at: string;
          currency: string;
          donor_email: string | null;
          donor_name: string | null;
          id: string;
          is_anonymous: boolean;
          is_recurring: boolean;
          provider: string | null;
          provider_reference: string | null;
          status: Database["public"]["Enums"]["payment_status"];
          temple_id: string;
          user_id: string | null;
        };
        Insert: {
          amount_cents: number;
          category?: string;
          created_at?: string;
          currency?: string;
          donor_email?: string | null;
          donor_name?: string | null;
          id?: string;
          is_anonymous?: boolean;
          is_recurring?: boolean;
          provider?: string | null;
          provider_reference?: string | null;
          status?: Database["public"]["Enums"]["payment_status"];
          temple_id: string;
          user_id?: string | null;
        };
        Update: {
          amount_cents?: number;
          category?: string;
          created_at?: string;
          currency?: string;
          donor_email?: string | null;
          donor_name?: string | null;
          id?: string;
          is_anonymous?: boolean;
          is_recurring?: boolean;
          provider?: string | null;
          provider_reference?: string | null;
          status?: Database["public"]["Enums"]["payment_status"];
          temple_id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "donations_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      donors: {
        Row: {
          amount_cents: number | null;
          category: string | null;
          created_at: string;
          display_order: number;
          donor_name: string;
          id: string;
          is_anonymous: boolean;
          is_published: boolean;
          message: string | null;
          temple_id: string;
          tier: string | null;
          updated_at: string;
          year: number | null;
        };
        Insert: {
          amount_cents?: number | null;
          category?: string | null;
          created_at?: string;
          display_order?: number;
          donor_name: string;
          id?: string;
          is_anonymous?: boolean;
          is_published?: boolean;
          message?: string | null;
          temple_id: string;
          tier?: string | null;
          updated_at?: string;
          year?: number | null;
        };
        Update: {
          amount_cents?: number | null;
          category?: string | null;
          created_at?: string;
          display_order?: number;
          donor_name?: string;
          id?: string;
          is_anonymous?: boolean;
          is_published?: boolean;
          message?: string | null;
          temple_id?: string;
          tier?: string | null;
          updated_at?: string;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "donors_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      event_items: {
        Row: {
          created_at: string;
          display_order: number;
          event_id: string;
          id: string;
          name: string;
          note: string | null;
          quantity: string | null;
        };
        Insert: {
          created_at?: string;
          display_order?: number;
          event_id: string;
          id?: string;
          name: string;
          note?: string | null;
          quantity?: string | null;
        };
        Update: {
          created_at?: string;
          display_order?: number;
          event_id?: string;
          id?: string;
          name?: string;
          note?: string | null;
          quantity?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "event_items_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      event_photos: {
        Row: {
          caption: string | null;
          created_at: string;
          display_order: number;
          event_id: string | null;
          id: string;
          image_url: string;
          taken_on: string | null;
          temple_id: string;
          title: string | null;
          year: number | null;
        };
        Insert: {
          caption?: string | null;
          created_at?: string;
          display_order?: number;
          event_id?: string | null;
          id?: string;
          image_url: string;
          taken_on?: string | null;
          temple_id: string;
          title?: string | null;
          year?: number | null;
        };
        Update: {
          caption?: string | null;
          created_at?: string;
          display_order?: number;
          event_id?: string | null;
          id?: string;
          image_url?: string;
          taken_on?: string | null;
          temple_id?: string;
          title?: string | null;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "event_photos_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_photos_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      event_registrations: {
        Row: {
          attendees: number;
          created_at: string;
          event_id: string;
          id: string;
          notes: string | null;
          status: string;
          user_id: string;
        };
        Insert: {
          attendees?: number;
          created_at?: string;
          event_id: string;
          id?: string;
          notes?: string | null;
          status?: string;
          user_id: string;
        };
        Update: {
          attendees?: number;
          created_at?: string;
          event_id?: string;
          id?: string;
          notes?: string | null;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      event_volunteers: {
        Row: {
          availability: string | null;
          created_at: string;
          event_id: string;
          full_name: string | null;
          id: string;
          notes: string | null;
          phone: string | null;
          role_preference: string | null;
          status: string;
          user_id: string;
        };
        Insert: {
          availability?: string | null;
          created_at?: string;
          event_id: string;
          full_name?: string | null;
          id?: string;
          notes?: string | null;
          phone?: string | null;
          role_preference?: string | null;
          status?: string;
          user_id: string;
        };
        Update: {
          availability?: string | null;
          created_at?: string;
          event_id?: string;
          full_name?: string | null;
          id?: string;
          notes?: string | null;
          phone?: string | null;
          role_preference?: string | null;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_volunteers_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          category: string | null;
          created_at: string;
          deity: string | null;
          description: string | null;
          ends_at: string | null;
          fee_cents: number;
          id: string;
          image_url: string | null;
          is_annual: boolean;
          location: string | null;
          max_attendees: number | null;
          priest_id: string | null;
          recurrence: string | null;
          registration_deadline: string | null;
          registration_required: boolean;
          slug: string;
          sponsor_contact: string | null;
          sponsor_name: string | null;
          sponsor_note: string | null;
          sponsorship_amount_cents: number | null;
          starts_at: string;
          status: string;
          temple_id: string;
          title: string;
          updated_at: string;
          volunteers_needed: boolean;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          deity?: string | null;
          description?: string | null;
          ends_at?: string | null;
          fee_cents?: number;
          id?: string;
          image_url?: string | null;
          is_annual?: boolean;
          location?: string | null;
          max_attendees?: number | null;
          priest_id?: string | null;
          recurrence?: string | null;
          registration_deadline?: string | null;
          registration_required?: boolean;
          slug: string;
          sponsor_contact?: string | null;
          sponsor_name?: string | null;
          sponsor_note?: string | null;
          sponsorship_amount_cents?: number | null;
          starts_at: string;
          status?: string;
          temple_id: string;
          title: string;
          updated_at?: string;
          volunteers_needed?: boolean;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          deity?: string | null;
          description?: string | null;
          ends_at?: string | null;
          fee_cents?: number;
          id?: string;
          image_url?: string | null;
          is_annual?: boolean;
          location?: string | null;
          max_attendees?: number | null;
          priest_id?: string | null;
          recurrence?: string | null;
          registration_deadline?: string | null;
          registration_required?: boolean;
          slug?: string;
          sponsor_contact?: string | null;
          sponsor_name?: string | null;
          sponsor_note?: string | null;
          sponsorship_amount_cents?: number | null;
          starts_at?: string;
          status?: string;
          temple_id?: string;
          title?: string;
          updated_at?: string;
          volunteers_needed?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "events_priest_id_fkey";
            columns: ["priest_id"];
            isOneToOne: false;
            referencedRelation: "priests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "events_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      hall_bookings: {
        Row: {
          admin_notes: string | null;
          cleaning_fee_cents: number;
          contact_email: string;
          contact_name: string;
          contact_phone: string;
          created_at: string;
          deposit_cents: number;
          ends_at: string;
          event_title: string | null;
          event_type: string;
          guest_count: number;
          hall_id: string;
          id: string;
          needs_av: boolean;
          needs_kitchen: boolean;
          needs_tables: boolean;
          notes: string | null;
          organisation: string | null;
          payment_id: string | null;
          payment_status: Database["public"]["Enums"]["payment_status"];
          rate_basis: string;
          reference: string;
          rental_cents: number;
          setup_notes: string | null;
          starts_at: string;
          status: Database["public"]["Enums"]["hall_booking_status"];
          temple_id: string;
          total_cents: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          admin_notes?: string | null;
          cleaning_fee_cents?: number;
          contact_email: string;
          contact_name: string;
          contact_phone: string;
          created_at?: string;
          deposit_cents?: number;
          ends_at: string;
          event_title?: string | null;
          event_type: string;
          guest_count?: number;
          hall_id: string;
          id?: string;
          needs_av?: boolean;
          needs_kitchen?: boolean;
          needs_tables?: boolean;
          notes?: string | null;
          organisation?: string | null;
          payment_id?: string | null;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          rate_basis?: string;
          reference?: string;
          rental_cents?: number;
          setup_notes?: string | null;
          starts_at: string;
          status?: Database["public"]["Enums"]["hall_booking_status"];
          temple_id: string;
          total_cents?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          admin_notes?: string | null;
          cleaning_fee_cents?: number;
          contact_email?: string;
          contact_name?: string;
          contact_phone?: string;
          created_at?: string;
          deposit_cents?: number;
          ends_at?: string;
          event_title?: string | null;
          event_type?: string;
          guest_count?: number;
          hall_id?: string;
          id?: string;
          needs_av?: boolean;
          needs_kitchen?: boolean;
          needs_tables?: boolean;
          notes?: string | null;
          organisation?: string | null;
          payment_id?: string | null;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          rate_basis?: string;
          reference?: string;
          rental_cents?: number;
          setup_notes?: string | null;
          starts_at?: string;
          status?: Database["public"]["Enums"]["hall_booking_status"];
          temple_id?: string;
          total_cents?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "hall_bookings_hall_id_fkey";
            columns: ["hall_id"];
            isOneToOne: false;
            referencedRelation: "halls";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "hall_bookings_payment_id_fkey";
            columns: ["payment_id"];
            isOneToOne: false;
            referencedRelation: "payments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "hall_bookings_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      halls: {
        Row: {
          amenities: string[];
          area_sqft: number | null;
          buffer_minutes: number;
          capacity: number;
          cleaning_fee_cents: number;
          closes_at: string;
          created_at: string;
          deposit_cents: number;
          description: string | null;
          display_order: number;
          full_day_rate_cents: number;
          half_day_rate_cents: number;
          hourly_rate_cents: number;
          id: string;
          image_url: string | null;
          is_active: boolean;
          max_advance_days: number;
          max_hours: number;
          min_hours: number;
          min_notice_days: number;
          name: string;
          opens_at: string;
          rules: string | null;
          short_description: string | null;
          slug: string;
          temple_id: string;
          updated_at: string;
        };
        Insert: {
          amenities?: string[];
          area_sqft?: number | null;
          buffer_minutes?: number;
          capacity?: number;
          cleaning_fee_cents?: number;
          closes_at?: string;
          created_at?: string;
          deposit_cents?: number;
          description?: string | null;
          display_order?: number;
          full_day_rate_cents?: number;
          half_day_rate_cents?: number;
          hourly_rate_cents?: number;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          max_advance_days?: number;
          max_hours?: number;
          min_hours?: number;
          min_notice_days?: number;
          name: string;
          opens_at?: string;
          rules?: string | null;
          short_description?: string | null;
          slug: string;
          temple_id: string;
          updated_at?: string;
        };
        Update: {
          amenities?: string[];
          area_sqft?: number | null;
          buffer_minutes?: number;
          capacity?: number;
          cleaning_fee_cents?: number;
          closes_at?: string;
          created_at?: string;
          deposit_cents?: number;
          description?: string | null;
          display_order?: number;
          full_day_rate_cents?: number;
          half_day_rate_cents?: number;
          hourly_rate_cents?: number;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          max_advance_days?: number;
          max_hours?: number;
          min_hours?: number;
          min_notice_days?: number;
          name?: string;
          opens_at?: string;
          rules?: string | null;
          short_description?: string | null;
          slug?: string;
          temple_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "halls_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      media: {
        Row: {
          alt_text: string | null;
          caption: string | null;
          created_at: string;
          folder: string | null;
          id: string;
          mime_type: string | null;
          size_bytes: number | null;
          temple_id: string;
          uploaded_by: string | null;
          url: string;
        };
        Insert: {
          alt_text?: string | null;
          caption?: string | null;
          created_at?: string;
          folder?: string | null;
          id?: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          temple_id: string;
          uploaded_by?: string | null;
          url: string;
        };
        Update: {
          alt_text?: string | null;
          caption?: string | null;
          created_at?: string;
          folder?: string | null;
          id?: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          temple_id?: string;
          uploaded_by?: string | null;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "media_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      newsletter_subscribers: {
        Row: {
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          is_active: boolean;
          phone: string | null;
          temple_id: string;
          user_id: string | null;
          wants_volunteering: boolean;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name?: string | null;
          id?: string;
          is_active?: boolean;
          phone?: string | null;
          temple_id: string;
          user_id?: string | null;
          wants_volunteering?: boolean;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          is_active?: boolean;
          phone?: string | null;
          temple_id?: string;
          user_id?: string | null;
          wants_volunteering?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "newsletter_subscribers_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          body: string | null;
          created_at: string;
          id: string;
          kind: string;
          link_url: string | null;
          read_at: string | null;
          temple_id: string | null;
          title: string;
          user_id: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          id?: string;
          kind?: string;
          link_url?: string | null;
          read_at?: string | null;
          temple_id?: string | null;
          title: string;
          user_id: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          id?: string;
          kind?: string;
          link_url?: string | null;
          read_at?: string | null;
          temple_id?: string | null;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      pages: {
        Row: {
          blocks: Json;
          created_at: string;
          id: string;
          is_published: boolean;
          seo_description: string | null;
          seo_title: string | null;
          slug: string;
          temple_id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          blocks?: Json;
          created_at?: string;
          id?: string;
          is_published?: boolean;
          seo_description?: string | null;
          seo_title?: string | null;
          slug: string;
          temple_id: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          blocks?: Json;
          created_at?: string;
          id?: string;
          is_published?: boolean;
          seo_description?: string | null;
          seo_title?: string | null;
          slug?: string;
          temple_id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pages_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          amount_cents: number;
          created_at: string;
          currency: string;
          devotee_email: string | null;
          devotee_name: string | null;
          devotee_phone: string | null;
          gotra: string | null;
          id: string;
          item_name: string;
          kind: string;
          nakshatra: string | null;
          notes: string | null;
          paid_at: string | null;
          preferred_date: string | null;
          provider: string;
          receipt_number: string;
          service_id: string | null;
          square_order_id: string | null;
          square_payment_id: string | null;
          square_payment_link_id: string | null;
          status: Database["public"]["Enums"]["payment_status"];
          stripe_payment_intent: string | null;
          stripe_session_id: string | null;
          temple_id: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          amount_cents: number;
          created_at?: string;
          currency?: string;
          devotee_email?: string | null;
          devotee_name?: string | null;
          devotee_phone?: string | null;
          gotra?: string | null;
          id?: string;
          item_name: string;
          kind?: string;
          nakshatra?: string | null;
          notes?: string | null;
          paid_at?: string | null;
          preferred_date?: string | null;
          provider?: string;
          receipt_number?: string;
          service_id?: string | null;
          square_order_id?: string | null;
          square_payment_id?: string | null;
          square_payment_link_id?: string | null;
          status?: Database["public"]["Enums"]["payment_status"];
          stripe_payment_intent?: string | null;
          stripe_session_id?: string | null;
          temple_id: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          amount_cents?: number;
          created_at?: string;
          currency?: string;
          devotee_email?: string | null;
          devotee_name?: string | null;
          devotee_phone?: string | null;
          gotra?: string | null;
          id?: string;
          item_name?: string;
          kind?: string;
          nakshatra?: string | null;
          notes?: string | null;
          paid_at?: string | null;
          preferred_date?: string | null;
          provider?: string;
          receipt_number?: string;
          service_id?: string | null;
          square_order_id?: string | null;
          square_payment_id?: string | null;
          square_payment_link_id?: string | null;
          status?: Database["public"]["Enums"]["payment_status"];
          stripe_payment_intent?: string | null;
          stripe_session_id?: string | null;
          temple_id?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      priest_availability: {
        Row: {
          created_at: string;
          day_of_week: number;
          end_time: string;
          id: string;
          priest_id: string;
          start_time: string;
        };
        Insert: {
          created_at?: string;
          day_of_week: number;
          end_time: string;
          id?: string;
          priest_id: string;
          start_time: string;
        };
        Update: {
          created_at?: string;
          day_of_week?: number;
          end_time?: string;
          id?: string;
          priest_id?: string;
          start_time?: string;
        };
        Relationships: [
          {
            foreignKeyName: "priest_availability_priest_id_fkey";
            columns: ["priest_id"];
            isOneToOne: false;
            referencedRelation: "priests";
            referencedColumns: ["id"];
          },
        ];
      };
      priest_blackouts: {
        Row: {
          created_at: string;
          end_date: string;
          id: string;
          priest_id: string;
          reason: string | null;
          start_date: string;
        };
        Insert: {
          created_at?: string;
          end_date: string;
          id?: string;
          priest_id: string;
          reason?: string | null;
          start_date: string;
        };
        Update: {
          created_at?: string;
          end_date?: string;
          id?: string;
          priest_id?: string;
          reason?: string | null;
          start_date?: string;
        };
        Relationships: [
          {
            foreignKeyName: "priest_blackouts_priest_id_fkey";
            columns: ["priest_id"];
            isOneToOne: false;
            referencedRelation: "priests";
            referencedColumns: ["id"];
          },
        ];
      };
      priest_services: {
        Row: {
          priest_id: string;
          service_id: string;
        };
        Insert: {
          priest_id: string;
          service_id: string;
        };
        Update: {
          priest_id?: string;
          service_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "priest_services_priest_id_fkey";
            columns: ["priest_id"];
            isOneToOne: false;
            referencedRelation: "priests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "priest_services_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      priests: {
        Row: {
          biography: string | null;
          created_at: string;
          display_order: number;
          email: string | null;
          full_name: string;
          id: string;
          is_active: boolean;
          languages: string[];
          max_bookings_per_day: number;
          phone: string | null;
          photo_url: string | null;
          qualifications: string | null;
          specializations: string[];
          temple_id: string;
          title: string | null;
          updated_at: string;
          user_id: string | null;
          working_days: string[];
          working_since: string | null;
        };
        Insert: {
          biography?: string | null;
          created_at?: string;
          display_order?: number;
          email?: string | null;
          full_name: string;
          id?: string;
          is_active?: boolean;
          languages?: string[];
          max_bookings_per_day?: number;
          phone?: string | null;
          photo_url?: string | null;
          qualifications?: string | null;
          specializations?: string[];
          temple_id: string;
          title?: string | null;
          updated_at?: string;
          user_id?: string | null;
          working_days?: string[];
          working_since?: string | null;
        };
        Update: {
          biography?: string | null;
          created_at?: string;
          display_order?: number;
          email?: string | null;
          full_name?: string;
          id?: string;
          is_active?: boolean;
          languages?: string[];
          max_bookings_per_day?: number;
          phone?: string | null;
          photo_url?: string | null;
          qualifications?: string | null;
          specializations?: string[];
          temple_id?: string;
          title?: string | null;
          updated_at?: string;
          user_id?: string | null;
          working_days?: string[];
          working_since?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "priests_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          address: string | null;
          avatar_url: string | null;
          city: string | null;
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          phone: string | null;
          postal_code: string | null;
          preferred_language: string | null;
          state: string | null;
          temple_id: string | null;
          updated_at: string;
        };
        Insert: {
          address?: string | null;
          avatar_url?: string | null;
          city?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          phone?: string | null;
          postal_code?: string | null;
          preferred_language?: string | null;
          state?: string | null;
          temple_id?: string | null;
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          avatar_url?: string | null;
          city?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          postal_code?: string | null;
          preferred_language?: string | null;
          state?: string | null;
          temple_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      service_categories: {
        Row: {
          description: string | null;
          display_order: number;
          id: string;
          name: string;
          slug: string;
          temple_id: string;
        };
        Insert: {
          description?: string | null;
          display_order?: number;
          id?: string;
          name: string;
          slug: string;
          temple_id: string;
        };
        Update: {
          description?: string | null;
          display_order?: number;
          id?: string;
          name?: string;
          slug?: string;
          temple_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "service_categories_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          buffer_minutes: number;
          category_id: string | null;
          created_at: string;
          description: string | null;
          display_order: number;
          duration_minutes: number;
          faqs: Json;
          id: string;
          image_url: string | null;
          is_active: boolean;
          location_type: Database["public"]["Enums"]["service_location"];
          min_notice_hours: number;
          name: string;
          preparation_instructions: string | null;
          price_cents: number;
          required_materials: string | null;
          requires_priest: boolean;
          short_description: string | null;
          slug: string;
          temple_id: string;
          updated_at: string;
        };
        Insert: {
          buffer_minutes?: number;
          category_id?: string | null;
          created_at?: string;
          description?: string | null;
          display_order?: number;
          duration_minutes?: number;
          faqs?: Json;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          location_type?: Database["public"]["Enums"]["service_location"];
          min_notice_hours?: number;
          name: string;
          preparation_instructions?: string | null;
          price_cents?: number;
          required_materials?: string | null;
          requires_priest?: boolean;
          short_description?: string | null;
          slug: string;
          temple_id: string;
          updated_at?: string;
        };
        Update: {
          buffer_minutes?: number;
          category_id?: string | null;
          created_at?: string;
          description?: string | null;
          display_order?: number;
          duration_minutes?: number;
          faqs?: Json;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          location_type?: Database["public"]["Enums"]["service_location"];
          min_notice_hours?: number;
          name?: string;
          preparation_instructions?: string | null;
          price_cents?: number;
          required_materials?: string | null;
          requires_priest?: boolean;
          short_description?: string | null;
          slug?: string;
          temple_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "service_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "services_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      temple_schedules: {
        Row: {
          closes_at: string | null;
          created_at: string;
          day_of_week: number | null;
          id: string;
          is_closed: boolean;
          label: string;
          note: string | null;
          opens_at: string | null;
          special_date: string | null;
          temple_id: string;
          updated_at: string;
        };
        Insert: {
          closes_at?: string | null;
          created_at?: string;
          day_of_week?: number | null;
          id?: string;
          is_closed?: boolean;
          label?: string;
          note?: string | null;
          opens_at?: string | null;
          special_date?: string | null;
          temple_id: string;
          updated_at?: string;
        };
        Update: {
          closes_at?: string | null;
          created_at?: string;
          day_of_week?: number | null;
          id?: string;
          is_closed?: boolean;
          label?: string;
          note?: string | null;
          opens_at?: string | null;
          special_date?: string | null;
          temple_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "temple_schedules_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
      temples: {
        Row: {
          about_html: string | null;
          address_line1: string | null;
          address_line2: string | null;
          brand_primary: string | null;
          brand_secondary: string | null;
          city: string | null;
          country: string | null;
          created_at: string;
          currency: string;
          email: string | null;
          facebook_url: string | null;
          favicon_url: string | null;
          hero_image_url: string | null;
          history_html: string | null;
          id: string;
          instagram_url: string | null;
          is_active: boolean;
          is_demo: boolean;
          latitude: number;
          logo_url: string | null;
          longitude: number;
          map_address: string | null;
          mission_html: string | null;
          name: string;
          phone: string | null;
          postal_code: string | null;
          seo_description: string | null;
          seo_title: string | null;
          short_name: string | null;
          slug: string;
          state: string | null;
          tagline: string | null;
          timezone: string;
          updated_at: string;
          website: string | null;
          whatsapp_url: string | null;
          youtube_url: string | null;
        };
        Insert: {
          about_html?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          brand_primary?: string | null;
          brand_secondary?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          currency?: string;
          email?: string | null;
          facebook_url?: string | null;
          favicon_url?: string | null;
          hero_image_url?: string | null;
          history_html?: string | null;
          id?: string;
          instagram_url?: string | null;
          is_active?: boolean;
          is_demo?: boolean;
          latitude?: number;
          logo_url?: string | null;
          longitude?: number;
          map_address?: string | null;
          mission_html?: string | null;
          name: string;
          phone?: string | null;
          postal_code?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          short_name?: string | null;
          slug: string;
          state?: string | null;
          tagline?: string | null;
          timezone?: string;
          updated_at?: string;
          website?: string | null;
          whatsapp_url?: string | null;
          youtube_url?: string | null;
        };
        Update: {
          about_html?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          brand_primary?: string | null;
          brand_secondary?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          currency?: string;
          email?: string | null;
          facebook_url?: string | null;
          favicon_url?: string | null;
          hero_image_url?: string | null;
          history_html?: string | null;
          id?: string;
          instagram_url?: string | null;
          is_active?: boolean;
          is_demo?: boolean;
          latitude?: number;
          logo_url?: string | null;
          longitude?: number;
          map_address?: string | null;
          mission_html?: string | null;
          name?: string;
          phone?: string | null;
          postal_code?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          short_name?: string | null;
          slug?: string;
          state?: string | null;
          tagline?: string | null;
          timezone?: string;
          updated_at?: string;
          website?: string | null;
          whatsapp_url?: string | null;
          youtube_url?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          temple_id: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          temple_id?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          temple_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_roles_temple_id_fkey";
            columns: ["temple_id"];
            isOneToOne: false;
            referencedRelation: "temples";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      can_manage_media: {
        Args: { _user_id: string };
        Returns: boolean;
      };
      hall_busy_ranges: {
        Args: { _from: string; _hall_id: string; _to: string };
        Returns: {
          ends_at: string;
          starts_at: string;
          status: string;
        }[];
      };
      manages_temple: {
        Args: { _temple_id: string; _user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "super_admin" | "temple_admin" | "priest" | "devotee";
      booking_status:
        "pending" | "confirmed" | "assigned" | "completed" | "cancelled" | "rescheduled";
      hall_booking_status: "requested" | "held" | "confirmed" | "cancelled" | "completed";
      payment_status: "unpaid" | "pending" | "paid" | "refunded" | "waived";
      service_location: "temple" | "home" | "either";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "temple_admin", "priest", "devotee"],
      booking_status: ["pending", "confirmed", "assigned", "completed", "cancelled", "rescheduled"],
      hall_booking_status: ["requested", "held", "confirmed", "cancelled", "completed"],
      payment_status: ["unpaid", "pending", "paid", "refunded", "waived"],
      service_location: ["temple", "home", "either"],
    },
  },
} as const;
