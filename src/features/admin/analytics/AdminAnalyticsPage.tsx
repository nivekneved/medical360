import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  MessageCircle,
  Calculator,
  Building2,
  Stethoscope,
  Clock,
  ArrowUpRight,
  Filter,
  RefreshCw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import type { Inquiry } from '../../../core/types';
import { SITE_METRICS } from '../../../core/config/site';
import { analyticsService } from '../../../core/services/analytics.service';
import './AdminAnalytics.css';

export function AdminAnalyticsPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  useEffect(() => {
    mockEngine.getInquiries().then(setInquiries).finally(() => setLoading(false));
  }, []);

  const totalInquiries = inquiries.length;
  const confirmedInquiries = inquiries.filter((i: Inquiry) => i.status === 'confirmed' || i.status === 'completed').length;
  const urgentInquiries = inquiries.filter((i: Inquiry) => i.urgency === 'urgent' || i.urgency === 'emergency').length;

  const totalAssistedBaseline = 3000;
  const displayTotalPatients = totalAssistedBaseline + totalInquiries;

  // Dynamic Funnel calculations
  const visitorsCount = timeRange === '7d' ? 4250 : timeRange === '30d' ? 18600 : 74000;
  const catalogBrowsersCount = Math.round(visitorsCount * 0.62);
  const leadEngagementsCount = Math.round(visitorsCount * 0.26);
  const submittedDossiersCount = Math.max(totalInquiries, Math.round(visitorsCount * 0.08));

  // Procedure Interest Breakdown
  const PROCEDURE_METRICS = [
    { name: 'Cardiac Surgery & Interventional Cardiology', share: 34, inquiries: 142, tag: 'High Urgency' },
    { name: 'Oncology & Radiation Therapy', share: 28, inquiries: 118, tag: 'Comprehensive' },
    { name: 'Orthopaedics & Joint Replacement', share: 16, inquiries: 67, tag: 'Elective' },
    { name: 'Organ Transplants (Liver / Kidney)', share: 12, inquiries: 51, tag: 'Complex' },
    { name: 'Paediatric Specialised Surgery', share: 6, inquiries: 25, tag: 'NGO Priority' },
    { name: 'Neurology & Spine Care', share: 4, inquiries: 17, tag: 'Specialised' },
  ];

  // WhatsApp Source Attribution
  const WHATSAPP_SOURCES = [
    { source: 'Hero Section Primary CTA', clicks: 312, conversionRate: '32%' },
    { source: 'Floating Urgent Care Widget', clicks: 245, conversionRate: '28%' },
    { source: 'Hospital Detail Page Direct Contact', clicks: 184, conversionRate: '41%' },
    { source: 'Cost Calculator Result Card', clicks: 129, conversionRate: '47%' },
    { source: 'Header Hotline Button', clicks: 96, conversionRate: '22%' },
  ];

  return (
    <div className="admin-analytics-container">
      {/* ── Top Header ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <TrendingUp size={24} color="var(--color-primary)" />
            Lead Analytics & Conversion Funnel
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Real-time attribution for patient inquiries, WhatsApp consultations, and hospital quote requests.
          </p>
        </div>

        {/* Time Range Filter */}
        <div style={{ display: 'inline-flex', background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-lg, 0.75rem)', padding: '3px' }}>
          {(['7d', '30d', 'all'] as const).map(tr => (
            <button
              key={tr}
              type="button"
              onClick={() => setTimeRange(tr)}
              style={{
                background: timeRange === tr ? 'var(--color-primary)' : 'transparent',
                color: timeRange === tr ? '#fff' : 'var(--color-text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-md, 0.5rem)',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tr === '7d' ? 'Last 7 Days' : tr === '30d' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* ── 1. Top Metrics Grid ── */}
      <div className="analytics-metrics-grid">
        <div className="analytics-metric-card">
          <div className="analytics-metric-icon" style={{ background: 'rgba(6, 95, 70, 0.12)', color: 'var(--color-primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="analytics-metric-val">{displayTotalPatients.toLocaleString()}</div>
            <div className="analytics-metric-label">Total Patients Coordinated</div>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-metric-icon" style={{ background: 'rgba(22, 163, 74, 0.12)', color: '#16a34a' }}>
            <MessageCircle size={24} />
          </div>
          <div>
            <div className="analytics-metric-val">966</div>
            <div className="analytics-metric-label">WhatsApp Leads Generated</div>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-metric-icon" style={{ background: 'rgba(37, 99, 235, 0.12)', color: '#2563eb' }}>
            <Calculator size={24} />
          </div>
          <div>
            <div className="analytics-metric-val">1,420</div>
            <div className="analytics-metric-label">Treatment Cost Calculations</div>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-metric-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="analytics-metric-val">{urgentInquiries}</div>
            <div className="analytics-metric-label">Urgent / Evacuation Inquiries</div>
          </div>
        </div>
      </div>

      {/* ── 2. Conversion Funnel & Specialty Distribution ── */}
      <div className="analytics-grid-two">
        {/* Left: Patient Conversion Funnel */}
        <div className="analytics-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="var(--color-primary)" />
            Patient Navigation Conversion Funnel
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '0 0 1.5rem 0' }}>
            Step-by-step progression from initial discovery to confirmed hospital admission.
          </p>

          <div className="funnel-step">
            <div className="funnel-step__header">
              <span>1. Total Website Visitors & Discovery</span>
              <span>{visitorsCount.toLocaleString()} (100%)</span>
            </div>
            <div className="funnel-step__bar-bg">
              <div className="funnel-step__bar-fill" style={{ width: '100%' }} />
            </div>
          </div>

          <div className="funnel-step">
            <div className="funnel-step__header">
              <span>2. Hospitals & Specialties Evaluated</span>
              <span>{catalogBrowsersCount.toLocaleString()} (62%)</span>
            </div>
            <div className="funnel-step__bar-bg">
              <div className="funnel-step__bar-fill" style={{ width: '62%' }} />
            </div>
          </div>

          <div className="funnel-step">
            <div className="funnel-step__header">
              <span>3. WhatsApp or Intake Initiated</span>
              <span>{leadEngagementsCount.toLocaleString()} (26%)</span>
            </div>
            <div className="funnel-step__bar-bg">
              <div className="funnel-step__bar-fill" style={{ width: '26%' }} />
            </div>
          </div>

          <div className="funnel-step">
            <div className="funnel-step__header">
              <span>4. Medical Dossier Submitted & Quoted</span>
              <span>{submittedDossiersCount.toLocaleString()} (8%)</span>
            </div>
            <div className="funnel-step__bar-bg">
              <div className="funnel-step__bar-fill" style={{ width: '8%', background: '#10b981' }} />
            </div>
          </div>
        </div>

        {/* Right: Specialty Interest Distribution */}
        <div className="analytics-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Stethoscope size={18} color="var(--color-primary)" />
            Clinical Specialty Demand Breakdown
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '0 0 1rem 0' }}>
            Distribution of patient inquiries across medical departments.
          </p>

          <div>
            {PROCEDURE_METRICS.map((item, idx) => (
              <div key={idx} className="distribution-row">
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{item.name}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    {item.inquiries} inquiries · {item.tag}
                  </span>
                </div>
                <div style={{ textAlign: 'right', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {item.share}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. WhatsApp Source Attribution ── */}
      <div className="analytics-card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageCircle size={18} color="#16a34a" />
          WhatsApp Channel Attribution & Touchpoints
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '0 0 1.25rem 0' }}>
          Which website touchpoints trigger the most patient consultations.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Touchpoint Source</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Clicks Generated</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Consultation Rate</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {WHATSAPP_SOURCES.map((s, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700 }}>{s.source}</td>
                  <td style={{ padding: '0.85rem 0.5rem' }}>{s.clicks} leads</td>
                  <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: '#10b981' }}>{s.conversionRate}</td>
                  <td style={{ padding: '0.85rem 0.5rem' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: 'rgba(16, 185, 129, 0.12)',
                      color: '#10b981',
                    }}>
                      Active Tracking
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
