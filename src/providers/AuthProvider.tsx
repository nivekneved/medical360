import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AdminUser } from '../core/types';
import { supabase, isSupabaseConfigured } from '../core/supabase/client';

// ─── Fallback Admin Credentials ───────────────────────────────────────────────
const MOCK_ADMINS: AdminUser[] = [
  { id: 'admin-1', email: 'admin@med360.mu', name: 'Admin Med360', role: 'admin', active: true },
  { id: 'admin-2', email: 'kevinadlib@gmail.com', name: 'Kevin (Director)', role: 'admin', active: true },
  { id: 'admin-3', email: 'case@med360.mu',  name: 'Sarah Case Manager', role: 'case_manager', active: true },
];

const MOCK_PASSWORD = 'med360admin';

// ─── Context Shape ────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const stored = sessionStorage.getItem('med360_admin_user');
      return stored ? JSON.parse(atob(stored)) : null;
    } catch {
      return null;
    }
  });

  // Listen to live Supabase Auth session changes
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const adminUser: AdminUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Admin Med360',
          role: (session.user.user_metadata?.role as any) || 'admin',
          active: true,
        };
        setUser(adminUser);
        sessionStorage.setItem('med360_admin_user', btoa(JSON.stringify(adminUser)));
      }
    }).catch(() => {});

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const adminUser: AdminUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Admin Med360',
          role: (session.user.user_metadata?.role as any) || 'admin',
          active: true,
        };
        setUser(adminUser);
        sessionStorage.setItem('med360_admin_user', btoa(JSON.stringify(adminUser)));
      } else if (!session && !sessionStorage.getItem('med360_admin_user')) {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    // Brute force protection check
    const attempts = parseInt(localStorage.getItem('med360_login_attempts') || '0', 10);
    const lockoutUntil = parseInt(localStorage.getItem('med360_lockout_until') || '0', 10);
    
    if (Date.now() < lockoutUntil) {
      alert('Too many failed attempts. Account locked temporarily.');
      return false;
    }

    // 1. Attempt Live Supabase Authentication
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (data?.user && !error) {
          localStorage.removeItem('med360_login_attempts');
          localStorage.removeItem('med360_lockout_until');

          const adminUser: AdminUser = {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Admin Med360',
            role: (data.user.user_metadata?.role as any) || 'admin',
            active: true,
          };
          setUser(adminUser);
          sessionStorage.setItem('med360_admin_user', btoa(JSON.stringify(adminUser)));
          return true;
        }
      } catch (err) {
        console.warn('Supabase auth attempt failed, checking fallback credentials:', err);
      }
    }

    // 2. Fallback Mock/Emergency Credentials Check
    const fallbackMatch = MOCK_ADMINS.find(a => a.email.toLowerCase() === email.toLowerCase() && a.active);
    if (!fallbackMatch || password !== MOCK_PASSWORD) {
      const newAttempts = attempts + 1;
      localStorage.setItem('med360_login_attempts', newAttempts.toString());
      
      if (newAttempts >= 5) {
        // Lockout for 5 minutes
        localStorage.setItem('med360_lockout_until', (Date.now() + 5 * 60 * 1000).toString());
      }
      return false;
    }

    // Success with emergency admin credentials
    localStorage.removeItem('med360_login_attempts');
    localStorage.removeItem('med360_lockout_until');
    
    setUser(fallbackMatch);
    sessionStorage.setItem('med360_admin_user', btoa(JSON.stringify(fallbackMatch)));
    return true;
  }

  function logout() {
    if (isSupabaseConfigured) {
      supabase.auth.signOut().catch(() => {});
    }
    setUser(null);
    sessionStorage.removeItem('med360_admin_user');
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
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
