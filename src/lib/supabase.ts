import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          name: string;
          email: string;
          start_date: string;
          start_weight: number;
          current_weight: number;
          goal_weight: number;
          status: 'active' | 'inactive' | 'yet-to-start' | 'completed';
          notes: string;
          health_issues: string[];
          diet_end_date: string | null;
          routine: string;
          health_summary: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          start_date: string;
          start_weight?: number;
          current_weight?: number;
          goal_weight?: number;
          status?: 'active' | 'inactive' | 'yet-to-start' | 'completed';
          notes?: string;
          health_issues?: string[];
          diet_end_date?: string | null;
          routine?: string;
          health_summary?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          start_date?: string;
          start_weight?: number;
          current_weight?: number;
          goal_weight?: number;
          status?: 'active' | 'inactive' | 'yet-to-start' | 'completed';
          notes?: string;
          health_issues?: string[];
          diet_end_date?: string | null;
          routine?: string;
          health_summary?: string;
        };
      };
      weight_entries: {
        Row: {
          id: string;
          client_id: string;
          date: string;
          weight: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          date: string;
          weight: number;
        };
        Update: {
          id?: string;
          client_id?: string;
          date?: string;
          weight?: number;
        };
      };
      client_comments: {
        Row: {
          id: string;
          client_id: string;
          text: string;
          author: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          text: string;
          author: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          text?: string;
          author?: string;
        };
      };
    };
  };
};