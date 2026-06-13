import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type TeddyType = 1 | 2 | 3 | 4;

export interface LoveLetter {
  id?: string;
  letter_text: string;
  teddy_id: TeddyType;
  share_token: string;
  created_at?: string;
}
