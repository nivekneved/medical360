import { useState, useEffect } from 'react';
import { useDataConfig } from '../../../providers/DataProvider';
import { Database, Zap, Wifi, CheckCircle2, AlertCircle, RotateCcw, Cloud, Server, RefreshCw } from 'lucide-react';
import type { MockConfig } from '../../../core/types';
import { supabase } from '../../../core/supabase/client';

export function AdminSettingsPage() {
  const { mockConfig, updateMockConfig, resetMock } = useDataConfig();
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    online: boolean;
    message: string;
    hospitalsCount?: number;
    inquiriesCount?: number;
  }>({ tested: false, online: false, message: '' });

  function setLatency(latency: MockConfig['latency']) {
    updateMockConfig({ ...mockConfig, latency });
  }

  function setMode(live: boolean) {
    updateMockConfig({ ...mockConfig, enabled: !live });
  }

  const testSupabaseConnection = async () => {
    setTestingConnection(true);
    try {
      const [hospRes, inqRes] = await Promise.all([
        supabase.from('hospitals').select('*', { count: 'exact', head: true }),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }),
      ]);

      if (hospRes.error) {
        setConnectionStatus({
          tested: true,
          online: false,
          message: `Supabase Error: ${hospRes.error.message}`,
        });
      } else {
        setConnectionStatus({
          tested: true,
          online: true,
          message: 'Connected to Supabase PostgreSQL Database (Cloud)',
          hospitalsCount: hospRes.count ?? 0,
          inquiriesCount: inqRes.count ?? 0,
        });
      }
    } catch (err: any) {
      setConnectionStatus({
        tested: true,
        online: false,
        message: err.message || 'Connection failed.',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const LATENCY_OPTIONS: Array<{ value: MockConfig['latency']; label: string }> = [
    { value: 'instant', label: 'Instant (0ms)' },
    { value: 'normal',  label: 'Normal (300ms)' },
    { value: 'slow',    label: 'Slow (1.0s)' },
  ];

  const isLive = !mockConfig.enabled;

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2.5rem)', maxWidth: 1000, margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.4rem 0' }}>Data Source & System Settings</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Switch between live cloud Supabase PostgreSQL and offline mock data engine across the entire platform.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        
        {/* ─── 1. DATA SOURCE SELECTION CARDS ──────────────────────────────── */}
        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: isLive ? 'rgba(16,185,129,0.12)' : 'rgba(234,179,8,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isLive ? '#059669' : '#ca8a04' }}>
                <Database size={22} />
              </div>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Active Platform Data Source</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '2px 0 0 0' }}>
                  Currently running on: <strong>{isLive ? '🟢 Live Supabase Database' : '🟡 Mock Data Engine'}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={testSupabaseConnection}
              disabled={testingConnection}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600 }}
            >
              <RefreshCw size={13} className={testingConnection ? 'spin' : ''} />
              {testingConnection ? 'Pinging DB...' : 'Test Connection'}
            </button>
          </div>

          {/* Mode Cards Switcher */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            
            {/* Live Supabase Option */}
            <div
              onClick={() => setMode(true)}
              style={{
                border: isLive ? '2px solid #059669' : '1.5px solid var(--color-border)',
                background: isLive ? 'rgba(5, 150, 105, 0.05)' : 'var(--color-surface-2)',
                borderRadius: 12,
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Cloud size={20} color="#059669" />
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Live Supabase DB</span>
                </div>
                {isLive && (
                  <span style={{ background: '#059669', color: 'white', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: 999, textTransform: 'uppercase' }}>
                    Active
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0 0 0.75rem 0', lineHeight: 1.4 }}>
                Real-time PostgreSQL read/write queries via Supabase Cloud. All patient inquiries, changes, and deletions persist live in your database.
              </p>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, fontFamily: 'monospace' }}>
                URL: https://vtcywighvyndtoxfvmny.supabase.co
              </div>
            </div>

            {/* Mock Data Center Option */}
            <div
              onClick={() => setMode(false)}
              style={{
                border: !isLive ? '2px solid #ca8a04' : '1.5px solid var(--color-border)',
                background: !isLive ? 'rgba(234, 179, 8, 0.05)' : 'var(--color-surface-2)',
                borderRadius: 12,
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Server size={20} color="#ca8a04" />
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Mock Data Center</span>
                </div>
                {!isLive && (
                  <span style={{ background: '#ca8a04', color: 'white', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: 999, textTransform: 'uppercase' }}>
                    Active
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0 0 0.75rem 0', lineHeight: 1.4 }}>
                Simulated offline data engine with persistent browser localStorage. Ideal for offline staging, high-speed demos, and stress tests.
              </p>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                Storage Key: localStorage('med360_mock_store_v4')
              </div>
            </div>

          </div>

          {/* Connection Status Banner */}
          {connectionStatus.tested && (
            <div style={{
              background: connectionStatus.online ? '#ecfdf5' : '#fef2f2',
              border: `1px solid ${connectionStatus.online ? '#a7f3d0' : '#fecaca'}`,
              color: connectionStatus.online ? '#065f46' : '#991b1b',
              padding: '0.75rem 1rem',
              borderRadius: 8,
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                {connectionStatus.online ? <CheckCircle2 size={16} color="#059669" /> : <AlertCircle size={16} color="#dc2626" />}
                <span>{connectionStatus.message}</span>
              </div>
              {connectionStatus.online && (
                <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>
                  {connectionStatus.hospitalsCount} Hospitals • {connectionStatus.inquiriesCount} Inquiries registered
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── 2. SIMULATED LATENCY (For Mock Mode) ─────────────────────────── */}
        {!isLive && (
          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(26,107,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <Zap size={20} />
              </div>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', margin: 0 }}>Simulated Network Latency</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0 }}>Test responsive UI loading skeletons and state transitions</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {LATENCY_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  id={`settings-latency-${value}-btn`}
                  onClick={() => setLatency(value)}
                  style={{
                    flex: 1,
                    minWidth: 140,
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '2px solid ' + (mockConfig.latency === value ? 'var(--color-primary)' : 'var(--color-border)'),
                    background: mockConfig.latency === value ? 'rgba(26,107,255,0.06)' : 'var(--color-surface-2)',
                    color: mockConfig.latency === value ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── 3. RESET SEEDS ──────────────────────────────────────────────── */}
        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-danger)' }}>
                <RotateCcw size={18} />
              </div>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', margin: 0 }}>Reset Local Data Cache</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0 }}>Reset local storage data to initial fresh state</p>
              </div>
            </div>
            <button
              onClick={resetMock}
              id="settings-reset-btn"
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.3)', fontWeight: 700 }}
            >
              Reset Local Storage
            </button>
          </div>
        </div>

        {/* ─── 4. DEMO CREDENTIALS QUICK REFERENCE ─────────────────────────── */}
        <div style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          <div style={{ fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 4 }}>System Access Credentials:</div>
          <div>👑 <strong>Administrator (Full Access):</strong> <code style={{ color: 'var(--color-primary)' }}>admin@med360.mu</code> / <code style={{ color: 'var(--color-primary)' }}>med360admin</code></div>
          <div>📋 <strong>Case Manager (Inquiries):</strong> <code style={{ color: '#0284c7' }}>case@med360.mu</code> / <code style={{ color: '#0284c7' }}>med360admin</code></div>
        </div>

      </div>
    </div>
  );
}
