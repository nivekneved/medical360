import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import { createClient as createNeonSupabaseClient } from '@neon/neon-js/supabase';

export type DatabaseProvider = 'neon' | 'supabase';

export const DB_PROVIDER_STORAGE_KEY = 'med360_db_provider';

const neonDataApiUrl = (import.meta.env.VITE_NEON_DATA_API_URL || '').trim();
const neonAuthUrl = (import.meta.env.VITE_NEON_AUTH_URL || '').trim();
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isNeonConfigured = Boolean(
  neonDataApiUrl &&
  neonAuthUrl &&
  neonDataApiUrl.startsWith('http') &&
  neonAuthUrl.startsWith('http')
);

export const isSupabaseNativeConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder')
);

/**
 * Resolves the active database provider.
 * Defaults to Neon Lakebase Postgres when configured, with Admin Settings override to Supabase.
 */
export function getActiveDatabaseProvider(): DatabaseProvider {
  if (typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem(DB_PROVIDER_STORAGE_KEY);
      if (saved === 'supabase' && isSupabaseNativeConfigured) return 'supabase';
      if (saved === 'neon' && isNeonConfigured) return 'neon';
    } catch {
      // Ignore storage access restrictions
    }
  }
  if (isNeonConfigured) return 'neon';
  if (isSupabaseNativeConfigured) return 'supabase';
  return 'neon';
}

export function setActiveDatabaseProvider(provider: DatabaseProvider): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DB_PROVIDER_STORAGE_KEY, provider);
    // Clear cached API queries so fresh data is loaded from the newly selected backend
    for (const key of Object.keys(window.localStorage)) {
      if (key.startsWith('med360_cache_') || key.startsWith('cache:')) {
        window.localStorage.removeItem(key);
      }
    }
  } catch {
    // Ignore storage errors
  }
}

export const activeDatabaseProvider: DatabaseProvider = getActiveDatabaseProvider();

/**
 * True when the currently selected backend provider (Neon default, or Supabase) is configured.
 * Preserved export name for seamless compatibility across all repositories and services.
 */
export const isSupabaseConfigured =
  activeDatabaseProvider === 'neon' ? isNeonConfigured : isSupabaseNativeConfigured;

export const databaseEndpoints = {
  neonDataApiUrl,
  neonAuthUrl,
  supabaseUrl,
};

const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_token';

function createActiveClient(): SupabaseClient {
  if (activeDatabaseProvider === 'neon' && isNeonConfigured) {
    return createNeonSupabaseClient({
      auth: {
        url: neonAuthUrl,
        allowAnonymous: true,
      },
      dataApi: {
        url: neonDataApiUrl,
      },
    }) as unknown as SupabaseClient;
  }

  return createSupabaseClient(
    isSupabaseNativeConfigured ? supabaseUrl : fallbackUrl,
    isSupabaseNativeConfigured ? supabaseAnonKey : fallbackKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'x-client-info': 'med360-web-v1',
        },
      },
      realtime: {
        params: {
          eventsPerSecond: 5,
        },
      },
    }
  );
}

export const supabase: SupabaseClient = createActiveClient();
