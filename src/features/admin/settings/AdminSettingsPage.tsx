import { useDataConfig } from '../../../providers/DataProvider';
import { Database, Zap, Wifi, WifiOff, RotateCcw } from 'lucide-react';
import type { MockConfig } from '../../../core/types';

export function AdminSettingsPage() {
  const { mockConfig, updateMockConfig, resetMock } = useDataConfig();

  function setLatency(latency: MockConfig['latency']) {
    updateMockConfig({ ...mockConfig, latency });
  }

  function toggleMock() {
    updateMockConfig({ ...mockConfig, enabled: !mockConfig.enabled });
  }

  const LATENCY_OPTIONS: Array<{ value: MockConfig['latency']; label: string }> = [
    { value: 'instant', label: 'Instant (0ms)' },
    { value: 'normal',  label: 'Normal (350ms)' },
    { value: 'slow',    label: 'Slow (1.2s)' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: 640 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Settings</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
        Configure the Mock Data Center and application settings.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Mock Toggle */}
        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Database size={20} color="var(--color-primary)" />
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Mock Data Center</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Toggle between mock data and live Supabase</p>
              </div>
            </div>
            <button
              onClick={toggleMock}
              id="settings-mock-toggle-btn"
              style={{ width: 52, height: 28, borderRadius: 999, background: mockConfig.enabled ? 'var(--color-primary)' : 'var(--color-border)', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '3px', transition: 'all 0.2s', border: 'none' }}
            >
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'white', transform: mockConfig.enabled ? 'translateX(24px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
            </button>
          </div>
          <div style={{ background: mockConfig.enabled ? 'rgba(0,212,177,0.06)' : 'rgba(255,69,96,0.06)', border: '1px solid ' + (mockConfig.enabled ? 'rgba(0,212,177,0.2)' : 'rgba(255,69,96,0.2)'), borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.875rem', color: mockConfig.enabled ? 'var(--color-accent-dark)' : 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {mockConfig.enabled
              ? <><Wifi size={16} /> Using Mock Data - No real Supabase calls</>
              : <><WifiOff size={16} /> Live Mode - Supabase connection required</>
            }
          </div>
        </div>

        {/* Latency */}
        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
            <Zap size={20} color="var(--color-primary)" />
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Simulated Network Latency</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Simulate different network speeds for testing</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {LATENCY_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                id={`settings-latency-${value}-btn`}
                onClick={() => setLatency(value)}
                style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-lg)', border: '2px solid ' + (mockConfig.latency === value ? 'var(--color-primary)' : 'var(--color-border)'), background: mockConfig.latency === value ? 'rgba(26,107,255,0.06)' : 'var(--color-surface-2)', color: mockConfig.latency === value ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.15s' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Reset */}
        <div style={{ background: 'var(--color-surface)', border: '1.5px solid rgba(255,69,96,0.2)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <RotateCcw size={20} color="var(--color-danger)" />
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Reset Mock Data</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Reset all mock data to the original seed datasets</p>
              </div>
            </div>
            <button
              onClick={resetMock}
              id="settings-reset-btn"
              style={{ padding: '0.5rem 1.25rem', borderRadius: 999, border: '2px solid rgba(255,69,96,0.3)', color: 'var(--color-danger)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', background: 'transparent', transition: 'all 0.15s' }}
            >
              Reset Seeds
            </button>
          </div>
        </div>

        <div style={{ background: 'rgba(26,107,255,0.04)', border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          <strong>Admin credentials (Demo):</strong> admin@med360.mu / med360admin<br />
          <strong>Case Manager:</strong> case@med360.mu / med360admin
        </div>
      </div>
    </div>
  );
}
