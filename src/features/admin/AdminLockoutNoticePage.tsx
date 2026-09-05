import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock, FileWarning } from 'lucide-react';
import { SEO } from '../../components/SEO/SEO';

export function AdminLockoutNoticePage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #0f172a 0%, #06090c 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
      color: '#fff',
      fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
    }}>
      <SEO
        title="403 Access Restricted — Security Notice"
        description="Administrative access to this endpoint is restricted."
        canonical="/admin"
      />

      {/* Ambient security warning glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 500,
        height: 500,
        background: 'radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: 520,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '1.5rem',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(239, 68, 68, 0.1)',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Security Shield Icon */}
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))',
          border: '1.5px solid rgba(239, 68, 68, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: '#ef4444',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)',
        }}>
          <ShieldAlert size={36} />
        </div>

        {/* Warning Tag */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.3rem 0.85rem',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '9999px',
          color: '#f87171',
          fontSize: '0.78rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '1rem',
        }}>
          <Lock size={12} />
          <span>Restricted Endpoint · Monitoring Active</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: '#fff',
          margin: '0 0 1rem',
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
        }}>
          Administrative Access Restricted
        </h1>

        {/* Description */}
        <p style={{
          fontSize: '0.92rem',
          lineHeight: 1.65,
          color: 'rgba(255, 255, 255, 0.65)',
          margin: '0 0 1.75rem',
        }}>
          Public access to this legacy administration endpoint is strictly disabled. For healthcare compliance and patient data privacy, all connection attempts, network identifiers, and timestamps are actively audited.
        </p>

        {/* Security Audit Note */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          background: 'rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '0.75rem',
          padding: '0.9rem 1rem',
          textAlign: 'left',
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.5)',
          marginBottom: '2rem',
          lineHeight: 1.5,
        }}>
          <FileWarning size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
          <span>
            Authorized medical staff and patient coordinators must connect exclusively through their designated internal portal credentials.
          </span>
        </div>

        {/* Return Button */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
            padding: '0.85rem 1.5rem',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '0.75rem',
            fontWeight: 700,
            fontSize: '0.95rem',
            boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.3)',
            transition: 'transform 0.2s, opacity 0.2s',
          }}
        >
          <ArrowLeft size={16} />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </main>
  );
}
export default AdminLockoutNoticePage;
