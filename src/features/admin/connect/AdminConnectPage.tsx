import { useState } from 'react';
import {
  Inbox,
  Send,
  Mail,
  Plane,
  MessageSquareShare,
} from 'lucide-react';
import { AdminInquiriesPage } from '../inquiries/AdminInquiriesPage';
import { AdminCampaignsPage } from '../campaigns/AdminCampaignsPage';
import { AdminEmailTemplatesPage } from '../email-templates/AdminEmailTemplatesPage';
import { AdminConciergePage } from '../concierge/AdminConciergePage';

type ConnectTab = 'inbox' | 'campaigns' | 'templates' | 'concierge';

export function AdminConnectPage() {
  const [activeTab, setActiveTab] = useState<ConnectTab>('inbox');

  const TABS: Array<{ id: ConnectTab; label: string; icon: any }> = [
    { id: 'inbox', label: 'Patient Inquiries & WhatsApp', icon: Inbox },
    { id: 'campaigns', label: 'Email Campaigns & Audiences', icon: Send },
    { id: 'templates', label: 'Notification Templates', icon: Mail },
    { id: 'concierge', label: 'Medical Travel & Visa Concierge', icon: Plane },
  ];

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '1rem 0' }}>
      {/* Unified Connect Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-2) 100%)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{
              background: '#065f46',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: 6,
              fontSize: '0.7rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}>
              <MessageSquareShare size={12} /> Med360 Connect
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Patient Triage · WhatsApp 24/7 · Email Outreach · Medical Travel
            </span>
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0 }}>
            Patient Connect & Coordination Hub
          </h1>
        </div>
      </div>

      {/* Unified Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        borderBottom: '1.5px solid var(--color-border)',
        paddingBottom: '0.75rem',
        marginBottom: '1.5rem',
      }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Views */}
      {activeTab === 'inbox' && <AdminInquiriesPage />}
      {activeTab === 'campaigns' && <AdminCampaignsPage />}
      {activeTab === 'templates' && <AdminEmailTemplatesPage />}
      {activeTab === 'concierge' && <AdminConciergePage />}
    </div>
  );
}
