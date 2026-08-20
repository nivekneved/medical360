import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AdminUser } from '../core/types';

// ─── Mock Admin Credentials ───────────────────────────────────────────────────
const MOCK_ADMINS: AdminUser[] = [
  { id: 'admin-1', email: 'admin@med360.mu', name: 'Admin Med360', role: 'admin', active: true },
  { id: 'admin-2', email: 'case@med360.mu',  name: 'Sarah Case Manager', role: 'case_manager', active: true },
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
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  async function login(email: string, password: string): Promise<boolean> {
    if (password !== MOCK_PASSWORD) return false;
    const found = MOCK_ADMINS.find(a => a.email === email && a.active);
    if (!found) return false;
    setUser(found);
    sessionStorage.setItem('med360_admin_user', JSON.stringify(found));
    return true;
  }

  function logout() {
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
