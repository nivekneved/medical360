import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';
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

  const fillAdmin = () => {
    setEmail('admin@med360.mu');
    setPassword('med360admin');
    setError('');
  };

  const fillCaseManager = () => {
    setEmail('case@med360.mu');
    setPassword('med360admin');
    setError('');
  };

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
    <main style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #0f172a 0%, #090d10 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 450,
        height: 450,
        background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 10 }}>
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'rgba(255, 255, 255, 0.65)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#34d399')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)')}
          >
            <ArrowLeft size={16} />
            <span>Back to Medical 360</span>
          </Link>
        </div>

        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img 
            src="/assets/logo.png" 
            alt="Medical 360" 
            style={{ 
              height: 52, 
              width: 'auto', 
              maxWidth: 220, 
              objectFit: 'contain', 
              margin: '0 auto 1.25rem', 
              display: 'block' 
            }} 
          />
          <h1 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Admin Portal
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>
            Medical 360 · Clinical & Content Management
          </p>
        </div>

        {/* Card Form */}
        <div style={{
          background: 'rgba(17, 24, 34, 0.95)',
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 24,
          padding: '2.25rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(20px)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

            {/* Email Field */}
            <div>
              <label htmlFor="admin-email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>
                Admin Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    height: 46,
                    paddingLeft: '2.75rem',
                    paddingRight: '1rem',
                    background: '#1e293b',
                    border: '1.5px solid #334155',
                    borderRadius: 12,
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#10b981')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#334155')}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="admin-password" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                <input
                  id="admin-password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    height: 46,
                    paddingLeft: '2.75rem',
                    paddingRight: '3rem',
                    background: '#1e293b',
                    border: '1.5px solid #334155',
                    borderRadius: 12,
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#10b981')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#334155')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1.5px solid rgba(239, 68, 68, 0.4)',
                borderRadius: 10,
                padding: '0.75rem 1rem',
                color: '#f87171',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}>
                {error}
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              id="admin-login-btn"
              style={{
                width: '100%',
                height: 48,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 12,
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: '0.5rem',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <KeyRound size={18} />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>

            {/* Quick Demo Credentials Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
              
              {/* Admin Credentials */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 10,
                padding: '0.65rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#10b981', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                    Admin Access (Demo)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#e2e8f0', fontFamily: 'monospace', marginTop: 1 }}>
                    admin@med360.mu • med360admin
                  </div>
                </div>
                <button
                  type="button"
                  onClick={fillAdmin}
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#34d399',
                    borderRadius: 6,
                    padding: '0.25rem 0.55rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Auto-Fill
                </button>
              </div>

              {/* Case Manager Credentials */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 10,
                padding: '0.65rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                    Case Manager Access (Demo)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#e2e8f0', fontFamily: 'monospace', marginTop: 1 }}>
                    case@med360.mu • med360admin
                  </div>
                </div>
                <button
                  type="button"
                  onClick={fillCaseManager}
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    color: '#38bdf8',
                    borderRadius: 6,
                    padding: '0.25rem 0.55rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Auto-Fill
                </button>
              </div>

            </div>
          </form>
        </div>

        {/* Security Footer Note */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '1.5rem' }}>
          <ShieldCheck size={14} color="#10b981" />
          <span>Protected by 256-bit SSL & Role-Based Access Control</span>
        </div>
      </div>
    </main>
  );
}
