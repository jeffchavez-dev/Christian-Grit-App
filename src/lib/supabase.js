import { createClient } from '@supabase/supabase-js';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;

// ── Auth helpers ─────────────────────────────────────────────────────────────
export async function signInAnonymously() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.signInAnonymously();
  return error ? null : data.user;
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

// ── Sync helpers ─────────────────────────────────────────────────────────────
export async function pushSync(userId, payload) {
  if (!supabase) return false;
  const { error } = await supabase
    .from('user_data')
    .upsert({ user_id: userId, payload: JSON.stringify(payload), updated_at: new Date().toISOString() },
             { onConflict: 'user_id' });
  return !error;
}

export async function pullSync(userId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('user_data')
    .select('payload, updated_at')
    .eq('user_id', userId)
    .single();
  return error ? null : data;
}
