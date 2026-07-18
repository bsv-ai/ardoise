import { createClient } from '@supabase/supabase-js';

// Placeholders let the app build even before the Supabase project exists.
// Once NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are set for
// real (in .env.local locally, or in Vercel's project settings), every
// request automatically uses the real project instead.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
