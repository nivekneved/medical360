import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import type { AdminUser } from '../core/types';
import { supabase, isSupabaseConfigured } from '../core/supabase/client';

// ─── Authentication model ─────────────────────────────────────────────────────
// Authentication is handled ONLY by Supabase Auth (bcrypt, server-side).
// Authorization is the server-side `admin_users` table (enforced again by RLS via
// public.is_admin()). The browser never decides who is an admin:
//   - no hardcoded/emergency credentials
//   - no self-signed sessionStorage session (it was forgeable from the console)
//   - role is read from `admin_users`, not from user-editable user_metadata
// Failed-login throttling here is UX only; the real brute-force protection is
// Supabase Auth's server-side rate limiting.

const LOCKOUT_KEY = 'med360_lockout_until';
const ATTEMPTS_KEY = 'med360_login_attempts';

async function resolveAdmin(session: { user: { id: string; email?: string | null; user_metadata?: Record<string, any> } } | null): Promise<AdminUser | null> {
  const email = session?.user?.email?.toLowerCase();
  if (!session || !email) return null;

  const { data, error } = await supabase
    .from('admin_users')
    .select('id, email, name, role, active')
    .ilike('email', email)
    .maybeSingle();

  if (error || !data || !data.active) return null;

  return {
    id: session.user.id,
    email: data.email,
    name: data.name || session.user.user_metadata?.full_name || email.split('@')[0],
    role: data.role as AdminUser['role'],
    active: true,
  };
}

// ─── Context Shape ────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(isSupabaseConfigured);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        const admin = await resolveAdmin(session);
        if (!mounted.current) return;
        setUser(admin);
        // A valid Supabase user who is not an active admin must not hold a session here.
        if (session && !admin) supabase.auth.signOut().catch(() => {});
      })
      .catch(() => {})
      .finally(() => { if (mounted.current) setIsLoading(false); });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        setUser(null);
        return;
      }
      // Defer Supabase calls out of the auth callback to avoid deadlocks.
      setTimeout(async () => {
        const admin = await resolveAdmin(session);
        if (mounted.current) setUser(admin);
      }, 0);
    });

    return () => {
      mounted.current = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    const lockoutUntil = parseInt(localStorage.getItem(LOCKOUT_KEY) || '0', 10);
    if (Date.now() < lockoutUntil) return false;

    const fail = () => {
      const attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0', 10) + 1;
      localStorage.setItem(ATTEMPTS_KEY, String(attempts));
      if (attempts >= 5) localStorage.setItem(LOCKOUT_KEY, String(Date.now() + 5 * 60 * 1000));
      return false;
    };

    if (!isSupabaseConfigured) return fail();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error || !data?.session) return fail();

      const admin = await resolveAdmin(data.session);
      if (!admin) {
        // Authenticated but not an authorised admin → no access.
        await supabase.auth.signOut().catch(() => {});
        return fail();
      }

      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_KEY);
      setUser(admin);
      return true;
    } catch {
      return fail();
    }
  }

  function logout() {
    if (isSupabaseConfigured) {
      supabase.auth.signOut().catch(() => {});
    }
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
