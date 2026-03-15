// lib/supabase/database.types.ts
// Auto-generate the real version with:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/database.types.ts
//
// This hand-written version exactly mirrors the schema.sql from Step 3.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id:                   string;
          full_name:            string | null;
          avatar_url:           string | null;
          company:              string | null;
          phone:                string | null;
          timezone:             string;
          email_notifications:  boolean;
          created_at:           string;
          updated_at:           string;
        };
        Insert: {
          id:                   string;
          full_name?:           string | null;
          avatar_url?:          string | null;
          company?:             string | null;
          phone?:               string | null;
          timezone?:            string;
          email_notifications?: boolean;
          created_at?:          string;
          updated_at?:          string;
        };
        Update: {
          full_name?:           string | null;
          avatar_url?:          string | null;
          company?:             string | null;
          phone?:               string | null;
          timezone?:            string;
          email_notifications?: boolean;
          updated_at?:          string;
        };
      };

      orders: {
        Row: {
          id:                   string;
          client_id:            string;
          title:                string;
          description:          string | null;
          word_count:           number;
          content_type:         Database["public"]["Enums"]["content_type"];
          tone:                 Database["public"]["Enums"]["content_tone"];
          target_audience:      string | null;
          special_instructions: string | null;
          status:               Database["public"]["Enums"]["order_status"];
          total_price:          number;
          deadline:             string | null;
          delivered_file_url:   string | null;
          created_at:           string;
          updated_at:           string;
        };
        Insert: {
          id?:                  string;
          client_id:            string;
          title:                string;
          description?:         string | null;
          word_count:           number;
          content_type:         Database["public"]["Enums"]["content_type"];
          tone:                 Database["public"]["Enums"]["content_tone"];
          target_audience?:     string | null;
          special_instructions?:string | null;
          status?:              Database["public"]["Enums"]["order_status"];
          total_price:          number;
          deadline?:            string | null;
          delivered_file_url?:  string | null;
        };
        Update: {
          title?:               string;
          description?:         string | null;
          word_count?:          number;
          content_type?:        Database["public"]["Enums"]["content_type"];
          tone?:                Database["public"]["Enums"]["content_tone"];
          target_audience?:     string | null;
          special_instructions?:string | null;
          status?:              Database["public"]["Enums"]["order_status"];
          total_price?:         number;
          deadline?:            string | null;
          delivered_file_url?:  string | null;
        };
      };

      order_notes: {
        Row: {
          id:          string;
          order_id:    string;
          author_id:   string;
          content:     string;
          is_internal: boolean;
          created_at:  string;
        };
        Insert: {
          id?:         string;
          order_id:    string;
          author_id:   string;
          content:     string;
          is_internal?: boolean;
        };
        Update: never;
      };

      order_status_history: {
        Row: {
          id:          string;
          order_id:    string;
          changed_by:  string;
          from_status: Database["public"]["Enums"]["order_status"] | null;
          to_status:   Database["public"]["Enums"]["order_status"];
          note:        string | null;
          changed_at:  string;
        };
        Insert: never; // append-only via trigger
        Update: never;
      };
    };

    Views:   Record<string, never>;

    Functions: {
      get_client_stats: {
        Args:    Record<string, never>;
        Returns: {
          total_orders:     number;
          active_orders:    number;
          completed_orders: number;
          total_spent:      number;
          pending_orders:   number;
        };
      };
      get_orders_by_month: {
        Args:    Record<string, never>;
        Returns: { month: string; order_count: number }[];
      };
    };

    Enums: {
      order_status:
        | "pending"
        | "in_review"
        | "in_progress"
        | "revision"
        | "completed"
        | "cancelled";
      content_type:
        | "blog_post"
        | "website_copy"
        | "product_description"
        | "social_media"
        | "email_sequence"
        | "whitepaper"
        | "case_study"
        | "other";
      content_tone:
        | "professional"
        | "conversational"
        | "persuasive"
        | "informative"
        | "humorous"
        | "inspirational";
    };
  };
};
