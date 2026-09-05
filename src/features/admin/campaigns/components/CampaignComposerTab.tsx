import React, { useState } from 'react';
import {
  Save,
  Send,
  Sparkles,
  Smartphone,
  Monitor,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import {
  Campaign,
  AudienceList,
  renderCampaignHtml,
  sendTestCampaignEmail,
} from '../../../../core/services/campaign.service';
import { sanitizeHtml } from '../../../../core/services/security.service';

interface CampaignComposerTabProps {
  campaign: Campaign;
  setCampaign: (c: Campaign) => void;
  audiences: AudienceList[];
  onSave: () => void;
  onDispatch: (c: Campaign) => void;
  onBackToList: () => void;
}

export const CampaignComposerTab: React.FC<CampaignComposerTabProps> = ({
  campaign,
  setCampaign,
  audiences,
  onSave,
  onDispatch,
  onBackToList,
}) => {
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [testEmailAddress, setTestEmailAddress] = useState(import.meta.env.VITE_ADMIN_EMAIL || 'kevinadlib@gmail.com');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const renderedPreviewHtml = renderCampaignHtml(campaign, {
    name: 'Jean-Luc Marie',
    country: 'Mauritius',
  });

  const handleSendTest = async () => {
    if (!testEmailAddress.trim() || !testEmailAddress.includes('@')) {
      setTestResult({ success: false, message: 'Please enter a valid email address.' });
      return;
    }
    setSendingTest(true);
    setTestResult(null);
    try {
      const res = await sendTestCampaignEmail(campaign, testEmailAddress.trim());
      if (res.success) {
        setTestResult({ success: true, message: 'Test email delivered to ' + testEmailAddress.trim() });
      } else {
        setTestResult({ success: false, message: res.error || 'Failed to dispatch test email.' });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Network error during test dispatch.' });
    } finally {
      setSendingTest(false);
    }
  };

  const updateTemplate = (updates: Partial<typeof campaign.template>) => {
    setCampaign({
      ...campaign,
      template: {
        ...campaign.template,
        ...updates,
      },
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '1.5rem', alignItems: 'start' }}>
      {/* Left Column: Composer Controls */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={18} color="var(--color-primary)" /> Email Campaign Composer
          </h2>
          <button type="button" onClick={onBackToList} className="btn btn-outline btn-sm">
            Back to List
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
              Internal Campaign Title *
            </label>
            <input
              type="text"
              className="form-input"
              value={campaign.title}
              onChange={e => setCampaign({ ...campaign, title: e.target.value })}
              placeholder="e.g. Cardiology Second Opinion Awareness"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
              Target Audience List *
            </label>
            <select
              className="form-input"
              value={campaign.audienceId}
              onChange={e => {
                const aud = audiences.find(a => a.id === e.target.value);
                setCampaign({
                  ...campaign,
                  audienceId: e.target.value,
                  audienceName: aud ? aud.name : campaign.audienceName,
                  recipientCount: aud ? aud.contacts.length : campaign.recipientCount,
                });
              }}
            >
              {audiences.map(aud => (
                <option key={aud.id} value={aud.id}>
                  {aud.name} ({aud.contacts.length} recipients)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
              Subject Line *
            </label>
            <input
              type="text"
              className="form-input"
              value={campaign.subject}
              onChange={e => setCampaign({ ...campaign, subject: e.target.value })}
              placeholder="e.g. Expert Medical Review & Second Opinion from Top Indian Surgeons"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
              Preheader / Inbox Teaser Snippet
            </label>
            <input
              type="text"
              className="form-input"
              value={campaign.preheader || ''}
              onChange={e => setCampaign({ ...campaign, preheader: e.target.value })}
              placeholder="Short teaser displayed in the patient's inbox..."
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
              Email Headline *
            </label>
            <input
              type="text"
              className="form-input"
              value={campaign.template?.headline || ''}
              onChange={e => updateTemplate({ headline: e.target.value })}
              placeholder="e.g. Receive Specialized Cardiology Review Within 48 Hours"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
              Main Content / Body Copy *
            </label>
            <textarea
              className="form-input"
              rows={6}
              value={campaign.template?.introText || ''}
              onChange={e => updateTemplate({ introText: e.target.value })}
              placeholder="Write your email body copy. You can use tags like {{name}}, {{country}}..."
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
              Primary Call-to-Action (CTA Button)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Button Label (e.g. Claim Free Opinion)"
                value={campaign.template?.ctaText || ''}
                onChange={e => updateTemplate({ ctaText: e.target.value })}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Button URL (e.g. https://medical360-zeta.vercel.app/describe-need)"
                value={campaign.template?.ctaUrl || ''}
                onChange={e => updateTemplate({ ctaUrl: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Test Send Card */}
        <div style={{ background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
            Send Test Dispatch
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email to test"
              value={testEmailAddress}
              onChange={e => setTestEmailAddress(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            />
            <button
              type="button"
              disabled={sendingTest}
              onClick={handleSendTest}
              className="btn btn-outline btn-sm"
              style={{ minWidth: 100, fontWeight: 700 }}
            >
              {sendingTest ? 'Sending...' : 'Send Test'}
            </button>
          </div>
          {testResult && (
            <div style={{ marginTop: 6, fontSize: '0.75rem', fontWeight: 600, color: testResult.success ? 'var(--color-primary)' : 'var(--color-danger)' }}>
              {testResult.message}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={onSave}
            className="btn btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
          >
            <Save size={16} /> Save Draft
          </button>
          <button
            type="button"
            onClick={() => onDispatch(campaign)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
          >
            <Send size={16} /> Dispatch Campaign Now
          </button>
        </div>
      </div>

      {/* Right Column: Live Responsive Preview */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        position: 'sticky',
        top: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
            Live Email Rendering Preview
          </span>
          <div style={{ display: 'flex', gap: 4, background: 'var(--color-surface-2)', padding: 3, borderRadius: 8 }}>
            <button
              type="button"
              className={`btn btn-sm ${previewDevice === 'desktop' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '3px 8px', fontSize: '0.75rem', border: 'none' }}
              onClick={() => setPreviewDevice('desktop')}
            >
              <Monitor size={14} /> Desktop
            </button>
            <button
              type="button"
              className={`btn btn-sm ${previewDevice === 'mobile' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '3px 8px', fontSize: '0.75rem', border: 'none' }}
              onClick={() => setPreviewDevice('mobile')}
            >
              <Smartphone size={14} /> Mobile
            </button>
          </div>
        </div>

        <div style={{
          width: previewDevice === 'mobile' ? 340 : '100%',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: 12,
          border: '1px solid var(--color-border)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          maxHeight: 600,
          overflowY: 'auto',
        }}>
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(renderedPreviewHtml),
            }}
          />
        </div>
      </div>
    </div>
  );
};
