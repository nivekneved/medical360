import { useState } from 'react';
import { Database, CheckCircle2, RefreshCw, Server, HardDrive, ShieldCheck } from 'lucide-react';
import {
  activeDatabaseProvider,
  setActiveDatabaseProvider,
  isNeonConfigured,
  isSupabaseNativeConfigured,
  databaseEndpoints,
  type DatabaseProvider,
} from '../../../../core/supabase/client';

interface Props {
  onNotify: (msg: { text: string; isError?: boolean }) => void;
}

export function AdminDatabaseProviderSettings({ onNotify }: Props) {
  const [selected, setSelected] = useState<DatabaseProvider>(activeDatabaseProvider);
  const [switching, setSwitching] = useState(false);

  const handleApply = () => {
    if (selected === 'neon' && !isNeonConfigured) {
      onNotify({ text: 'Neon environment variables are not configured.', isError: true });
      return;
    }
    if (selected === 'supabase' && !isSupabaseNativeConfigured) {
      onNotify({ text: 'Supabase environment variables are not configured.', isError: true });
      return;
    }

    setSwitching(true);
    setActiveDatabaseProvider(selected);
    onNotify({
      text: `Switched database provider to ${selected === 'neon' ? 'Neon (Lakebase Postgres)' : 'Supabase'}. Reloading...`,
    });
    setTimeout(() => {
      window.location.reload();
    }, 650);
  };

  const providers: Array<{
    id: DatabaseProvider;
    name: string;
    badge: string;
    configured: boolean;
    endpoint: string;
    highlights: string[];
  }> = [
    {
      id: 'neon',
      name: 'Neon — Lakebase Postgres',
      badge: 'Default Recommended',
      configured: isNeonConfigured,
      endpoint: databaseEndpoints.neonDataApiUrl || 'Not configured (VITE_NEON_DATA_API_URL)',
      highlights: [
        'Serverless Lakebase Postgres 18 with instant copy-on-write branching',
        'Managed Neon Auth (Better Auth) & PostgREST-compatible Data API',
        'Integrated S3-compatible Neon Object Storage (uploads bucket)',
      ],
    },
    {
      id: 'supabase',
      name: 'Supabase — Postgres',
      badge: 'Fallback / Legacy',
      configured: isSupabaseNativeConfigured,
      endpoint: databaseEndpoints.supabaseUrl || 'Not configured (VITE_SUPABASE_URL)',
      highlights: [
        'Managed PostgreSQL with PostgREST REST API & Row Level Security',
        'Supabase Auth session management',
        'Instant fallback option without code changes',
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div
        className="card"
        style={{
          padding: '1.75rem',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--color-surface)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <Database size={20} style={{ color: 'var(--color-primary)' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Active Database &amp; Auth Provider
              </h2>
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              Choose whether Med360 connects to <strong>Neon (Default)</strong> or <strong>Supabase</strong>. Switching clears local cache and reloads the platform cleanly.
            </p>
          </div>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.4rem 0.9rem',
              borderRadius: '9999px',
              background: 'rgba(13, 148, 136, 0.12)',
              color: 'var(--color-primary)',
              fontSize: '0.8rem',
              fontWeight: 800,
            }}
          >
            <Server size={14} />
            Active: {activeDatabaseProvider === 'neon' ? 'Neon (Default)' : 'Supabase'}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          {providers.map((p) => {
            const isSelected = selected === p.id;
            const isLive = activeDatabaseProvider === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected(p.id)}
                style={{
                  textAlign: 'left',
                  padding: '1.35rem',
                  borderRadius: 'var(--radius-lg)',
                  border: isSelected
                    ? '2px solid var(--color-primary)'
                    : '1.5px solid var(--color-border)',
                  background: isSelected
                    ? 'color-mix(in srgb, var(--color-primary) 6%, var(--color-surface))'
                    : 'var(--color-bg)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  transition: 'all 0.18s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-text)' }}>
                    {p.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      background: p.id === 'neon' ? 'rgba(13, 148, 136, 0.14)' : 'rgba(100, 116, 139, 0.14)',
                      color: p.id === 'neon' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    }}
                  >
                    {p.badge}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: p.configured ? '#10b981' : '#ef4444',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ fontWeight: 600, color: p.configured ? '#059669' : '#dc2626' }}>
                    {p.configured ? 'Configured & Ready' : 'Not Configured'}
                  </span>
                  {isLive && (
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      ● Currently Active
                    </span>
                  )}
                </div>

                <div
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: 'var(--color-text-muted)',
                    background: 'var(--color-surface)',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%',
                  }}
                  title={p.endpoint}
                >
                  {p.endpoint}
                </div>

                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                  {p.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            <ShieldCheck size={16} style={{ color: 'var(--color-primary)' }} />
            <span>Neon Object Storage bucket <code>uploads</code> is provisioned on branch <code>production</code>.</span>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            disabled={switching || selected === activeDatabaseProvider}
            onClick={handleApply}
            id="save-db-provider-btn"
          >
            {switching ? <RefreshCw size={15} className="spin" /> : <CheckCircle2 size={15} />}
            <span>
              {selected === activeDatabaseProvider
                ? `Using ${selected === 'neon' ? 'Neon' : 'Supabase'}`
                : `Switch to ${selected === 'neon' ? 'Neon (Default)' : 'Supabase'}`}
            </span>
          </button>
        </div>
      </div>

      <div
        className="card"
        style={{
          padding: '1.25rem 1.5rem',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--color-surface)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          fontSize: '0.86rem',
          color: 'var(--color-text-secondary)',
        }}
      >
        <HardDrive size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
        <div>
          <strong>Note on Admin Sessions:</strong> When switching between Neon Auth and Supabase Auth, you will sign in with the selected provider&apos;s credentials (active admin: <code>kevinadlib@gmail.com</code>).
        </div>
      </div>
    </div>
  );
}
