import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../providers/AuthProvider';

import { validateHoneypot, sanitizeInput, checkRateLimit } from '../../core/services/security.service';

export function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@med360.mu');
  const [password, setPassword] = useState('med360admin');
  const [honeypot, setHoneypot] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 1. Honeypot Check
    if (!validateHoneypot(honeypot)) {
      setError('Authentication failed.');
      return;
    }

    // 2. Rate Limit
    const rateCheck = checkRateLimit('web_admin_login', 5, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      setError(`Too many login attempts. Please wait ${rateCheck.remainingCooldownSeconds}s.`);
      return;
    }

    setLoading(true);
    setError('');
    const cleanEmail = sanitizeInput(email);
    const ok = await login(cleanEmail, password);
    if (ok) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid email or password.');
    }
    setLoading(false);
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', color: 'white', margin: '0 auto 1rem' }}>
            M
          </div>
          <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Admin Portal</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>Medical 360 — Internal Access Only</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ background: 'var(--color-dark-3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-2xl)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
        >
          {/* Honeypot field */}
          <div style={{ display: 'none', position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
            <input
              type="text"
              name="user_verification_auth"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={e => setHoneypot(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-email" style={{ color: 'rgba(255,255,255,0.7)' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <input
                id="admin-email"
                type="email"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ paddingLeft: '2.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password" style={{ color: 'rgba(255,255,255,0.7)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <input
                id="admin-password"
                type={showPw ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ paddingLeft: '2.75rem', paddingRight: '3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(s => !s)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.2)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', color: 'var(--color-danger)', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" id="admin-login-btn" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)' }}>
            Demo: admin@med360.mu / med360admin
          </p>
        </form>
      </div>
    </main>
  );
}
