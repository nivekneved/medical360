import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Clock,
  Send,
  Phone,
  MapPin,
  Stethoscope,
  Radio,
  Zap,
} from 'lucide-react';
import { getWhatsAppConsultationLogs, type WhatsAppConsultationLog, buildWhatsAppUrl } from '../../../../core/services/whatsapp.service';

export const WhatsAppSyncLogPanel: React.FC = () => {
  const [logs, setLogs] = useState<WhatsAppConsultationLog[]>([]);
  const [testTriggered, setTestTriggered] = useState(false);

  const refreshLogs = () => {
    setLogs(getWhatsAppConsultationLogs());
  };

  useEffect(() => {
    refreshLogs();
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSimulateWebhook = async () => {
    setTestTriggered(true);
    try {
      await fetch('/api/webhooks/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'whatsapp.consultation_initiated',
          data: {
            id: `wa-sim-${Date.now()}`,
            timestamp: new Date().toISOString(),
            source: 'Admin Live Simulation Webhook',
            patientName: 'Test Patient (Webhook Ping)',
            country: 'Mauritius',
            specialty: 'Oncology / Second Opinion',
            phone: '+230 5918 8275',
            prefilledMessage: 'Automated test webhook ping from Med360 coordinator console.',
            webhookStatus: 'dispatched',
          },
        }),
      });
      refreshLogs();
    } catch (e) {
      console.warn('Simulation failed:', e);
    } finally {
      setTimeout(() => setTestTriggered(false), 3000);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
      {/* Top Banner */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1.5px solid var(--color-border)',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(37, 211, 102, 0.12)',
            color: '#25D366',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <MessageCircle size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
              WhatsApp 24/7 Webhook & Lead Sync Logs
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0.2rem 0 0 0' }}>
              Real-time synchronization for patient consultations initiated via WhatsApp across Med360.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={refreshLogs}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <RefreshCw size={14} /> Refresh Logs
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleSimulateWebhook}
            disabled={testTriggered}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Zap size={14} /> {testTriggered ? 'Webhook Dispatched!' : 'Test Webhook Ping'}
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ background: 'var(--color-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Total WhatsApp Leads</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#25D366', marginTop: '0.25rem' }}>{logs.length}</div>
        </div>
        <div style={{ background: 'var(--color-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Webhook Endpoint Status</span>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.45rem' }}>
            <Radio size={16} /> Active (/api/webhooks/whatsapp)
          </div>
        </div>
        <div style={{ background: 'var(--color-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Coordinator Hotline</span>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text)', marginTop: '0.45rem' }}>+230 5918 8275 (Mauritius)</div>
        </div>
      </div>

      {/* Logs Table */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1.5px solid var(--color-border)',
        overflow: 'hidden',
      }}>
        {logs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No WhatsApp consultations logged yet. Click "Test Webhook Ping" to simulate incoming lead traffic.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>Timestamp</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>Lead / Patient</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>Specialty & Origin</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>Referral Source</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>Webhook Status</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s ease' }}>
                    <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                      <Clock size={13} style={{ display: 'inline', marginRight: 4 }} />
                      {formatDate(log.timestamp)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <strong style={{ color: 'var(--color-text)' }}>{log.patientName}</strong>
                      {log.phone && (
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          <Phone size={11} style={{ display: 'inline', marginRight: 2 }} /> {log.phone}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{log.specialty}</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                        <MapPin size={11} style={{ display: 'inline', marginRight: 2 }} /> {log.country}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ background: 'var(--color-surface-2)', padding: '2px 8px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600 }}>
                        {log.source}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: log.webhookStatus === 'dispatched' ? '#059669' : '#d97706',
                        background: log.webhookStatus === 'dispatched' ? 'rgba(5, 150, 105, 0.1)' : 'rgba(217, 119, 6, 0.1)',
                        padding: '2px 8px',
                        borderRadius: 999,
                      }}>
                        <CheckCircle2 size={12} /> {log.webhookStatus}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <a
                        href={buildWhatsAppUrl('23059188275', log.prefilledMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                        style={{ color: '#25D366', borderColor: 'rgba(37, 211, 102, 0.4)', padding: '0.25rem 0.65rem' }}
                      >
                        <MessageCircle size={13} /> Chat
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
