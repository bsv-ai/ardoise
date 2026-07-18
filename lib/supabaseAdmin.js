import { createClient } from '@supabase/supabase-js';

// Server-only: uses the service_role key, which bypasses Row Level Security.
// Only ever import this from Route Handlers (app/api/**/route.js) or other
// server-side code — never from a 'use client' component.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key',
  { auth: { autoRefreshToken: false, persistSession: false } }
);
