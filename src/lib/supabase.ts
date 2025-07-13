import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.trim() === '' || supabaseAnonKey.trim() === '') {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  console.error('Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
  
  // Provide fallback values to prevent URL construction error
  const fallbackUrl = 'https://placeholder.supabase.co';
  const fallbackKey = 'placeholder-key';
  
  console.warn('Using fallback Supabase configuration. Database operations will not work until proper credentials are configured.');
  
  export const supabase = createClient(fallbackUrl, fallbackKey);
  export type Database = any;
} else {
  // Validate URL format
  try {
    new URL(supabaseUrl);
  } catch (error) {
    console.error('Invalid VITE_SUPABASE_URL format. Please ensure it starts with https:// and is a valid URL.');
    console.error('Current value:', supabaseUrl);
    
    // Use fallback to prevent crash
    const fallbackUrl = 'https://placeholder.supabase.co';
    const fallbackKey = 'placeholder-key';
    
    export const supabase = createClient(fallbackUrl, fallbackKey);
    export type Database = any;
  }
  
  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
}

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