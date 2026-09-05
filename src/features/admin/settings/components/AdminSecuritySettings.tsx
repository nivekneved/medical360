import React, { useState } from 'react';
import { Shield, Lock, Eye, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AdminSecuritySettingsProps {
  onNotify: (msg: { text: string; isError?: boolean }) => void;
}

export const AdminSecuritySettings: React.FC<AdminSecuritySettingsProps> = ({ onNotify }) => {
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(60);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
  const [require2FA, setRequire2FA] = useState(false);
  const [honeypotEnabled, setHoneypotEnabled] = useState(true);
  const [sqliScreeningEnabled, setSqliScreeningEnabled] = useState(true);
  const [xssSanitizationEnabled, setXssSanitizationEnabled] = useState(true);
  const [submissionTimingThresholdMs, setSubmissionTimingThresholdMs] = useState(1500);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify({ text: 'Security policies and defensive thresholds saved.' });
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={20} color="var(--color-primary)" />
          Security Suite, Anti-Bot & Threat Defenses
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0' }}>
          Configure client-side screening, brute-force backoff, and honeypot parameters.
        </p>
      </div>

      <div style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
            Admin Session Timeout (Minutes)
          </label>
          <input
            type="number"
            min={15}
            max={480}
            className="form-input"
            value={sessionTimeoutMinutes}
            onChange={e => setSessionTimeoutMinutes(parseInt(e.target.value) || 60)}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
            Max Failed Login Attempts Before Exponential Backoff
          </label>
          <input
            type="number"
            min={3}
            max={10}
            className="form-input"
            value={maxLoginAttempts}
            onChange={e => setMaxLoginAttempts(parseInt(e.target.value) || 5)}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
            Anti-Bot Submission Speed Threshold (ms)
          </label>
          <input
            type="number"
            min={500}
            max={5000}
            step={100}
            className="form-input"
            value={submissionTimingThresholdMs}
            onChange={e => setSubmissionTimingThresholdMs(parseInt(e.target.value) || 1500)}
          />
        </div>
      </div>

      {/* Toggles */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>Invisible Honeypot Protection</strong>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Injects hidden decoy fields across customer inquiry forms to silently deflect automated bot submissions.
            </p>
          </div>
          <input
            type="checkbox"
            checked={honeypotEnabled}
            onChange={e => setHoneypotEnabled(e.target.checked)}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
          <div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>SQL Injection Pattern Screening (SQLi)</strong>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Active pattern analysis for tautologies, stacked queries, UNION SELECT, and quote sanitization.
            </p>
          </div>
          <input
            type="checkbox"
            checked={sqliScreeningEnabled}
            onChange={e => setSqliScreeningEnabled(e.target.checked)}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
          <div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>DOM XSS Multi-Layer HTML Sanitization</strong>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Deep purification of rich text and email templates, stripping scripts, event handlers, and data URIs.
            </p>
          </div>
          <input
            type="checkbox"
            checked={xssSanitizationEnabled}
            onChange={e => setXssSanitizationEnabled(e.target.checked)}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
          Save Security Settings
        </button>
      </div>
    </form>
  );
};
