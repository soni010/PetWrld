import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://hptypzbtltvfzpwffcgu.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_j7GLbBabFiQgmxjaQWkgqA_Qsxp7GLc';

/**
 * Sanitizes and validates a Supabase URL to guarantee a valid HTTP/HTTPS URL
 */
function sanitizeSupabaseUrl(rawUrl?: any): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return DEFAULT_SUPABASE_URL;
  }
  let cleaned = rawUrl.trim();
  // Strip surrounding quotes if present (e.g. '"https://..."' or "'https://...'")
  while (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  if (!cleaned || cleaned === 'undefined' || cleaned === 'null') {
    return DEFAULT_SUPABASE_URL;
  }

  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'https://' + cleaned;
  }

  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return cleaned;
    }
  } catch {
    // URL parsing failed, fall back to safe default
  }

  return DEFAULT_SUPABASE_URL;
}

/**
 * Sanitizes the Supabase Anon Key
 */
function sanitizeSupabaseKey(rawKey?: any): string {
  if (!rawKey || typeof rawKey !== 'string') {
    return DEFAULT_SUPABASE_ANON_KEY;
  }
  let cleaned = rawKey.trim();
  while (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  if (!cleaned || cleaned === 'undefined' || cleaned === 'null') {
    return DEFAULT_SUPABASE_ANON_KEY;
  }
  return cleaned;
}

// Project Credentials
export const SUPABASE_URL = sanitizeSupabaseUrl((import.meta as any).env?.VITE_SUPABASE_URL);
export const SUPABASE_ANON_KEY = sanitizeSupabaseKey((import.meta as any).env?.VITE_SUPABASE_ANON_KEY);
export const SUPABASE_PROJECT_REF = 'hptypzbtltvfzpwffcgu';

/**
 * Creates or fallbacks a safe Supabase client that will never crash the browser runtime
 */
function createSafeSupabaseClient(): SupabaseClient {
  try {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.warn('[Supabase] Initialization warning:', err);
    // Return a dummy proxy to prevent unhandled fatal exceptions
    return new Proxy({} as any, {
      get: (_target, prop) => {
        if (prop === 'from') {
          return () => ({
            select: () => Promise.resolve({ data: [], error: null }),
            upsert: () => Promise.resolve({ data: null, error: null }),
            insert: () => Promise.resolve({ data: null, error: null }),
            delete: () => Promise.resolve({ data: null, error: null }),
            update: () => Promise.resolve({ data: null, error: null }),
          });
        }
        return () => Promise.resolve({ data: null, error: null });
      },
    });
  }
}

// Supabase Client initialized safely for client-side queries
export const supabase = createSafeSupabaseClient();

// Helper URLs to view tables in the Supabase Dashboard
export const SUPABASE_DASHBOARD_URLS = {
  tableEditor: `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/editor`,
  databaseTables: `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/database/tables`,
  sqlEditor: `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/sql`,
  authUsers: `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/auth/users`,
  projectOverview: `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}`,
};
