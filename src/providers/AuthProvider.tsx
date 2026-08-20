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
      return stored ? JSON.parse(atob(stored)) : null;
    } catch {
      return null;
    }
  });

  async function login(email: string, password: string): Promise<boolean> {
    // Brute force protection check
    const attempts = parseInt(localStorage.getItem('med360_login_attempts') || '0', 10);
    const lockoutUntil = parseInt(localStorage.getItem('med360_lockout_until') || '0', 10);
    
    if (Date.now() < lockoutUntil) {
      alert('Too many failed attempts. Account locked temporarily.');
      return false;
    }

    // Since this is mock logic, we use a basic string check.
    // In production this would be hashed on the server.
    if (password !== MOCK_PASSWORD || !MOCK_ADMINS.find(a => a.email === email && a.active)) {
      const newAttempts = attempts + 1;
      localStorage.setItem('med360_login_attempts', newAttempts.toString());
      
      if (newAttempts >= 3) {
        // Lockout for 5 minutes
        localStorage.setItem('med360_lockout_until', (Date.now() + 5 * 60 * 1000).toString());
      }
      return false;
    }

    // Success
    localStorage.removeItem('med360_login_attempts');
    localStorage.removeItem('med360_lockout_until');
    
    const found = MOCK_ADMINS.find(a => a.email === email && a.active)!;
    setUser(found);
    // Obfuscate token for mock environment
    sessionStorage.setItem('med360_admin_user', btoa(JSON.stringify(found)));
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
