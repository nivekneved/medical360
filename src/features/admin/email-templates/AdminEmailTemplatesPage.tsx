import { useState, useMemo } from 'react';
import {
  Save,
  RotateCcw,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Monitor,
  Layers,
} from 'lucide-react';
import {
  EmailTemplateConfig,
  getEmailTemplateConfig,
  saveEmailTemplateConfig,
  resetEmailTemplateConfig,
  renderEmailHtml,
  formatSubject,
  sendTestEmail,
} from '../../../core/services/email.service';
import { sanitizeHtml } from '../../../core/services/security.service';

const SAMPLE_SCENARIOS = {
  cardiology: {
    label: '❤️ Cardiology (Urgent)',
    data: {
      firstName: 'Jean-Luc',
      lastName: 'Marie',
      email: 'jeanluc.marie@example.mu',
      phone: '+230 5918 8275',
      countryOfResidence: 'Mauritius',
      specialtyName: 'Cardiology & Heart Surgery',
      serviceName: 'Medical Visa & Travel Planning',
      description: 'Seeking a second opinion for triple coronary artery bypass graft. Current angiogram reports attached for evaluation.',
      urgency: 'urgent',
      preferredCountry: 'India',
      budgetMin: '7000',
      budgetMax: '14000',
    },
  },
  orthopedics: {
    label: '🦴 Orthopedics (Routine)',
    data: {
      firstName: 'Ananya',
      lastName: 'Patel',
      email: 'ananya.p@example.com',
      phone: '+230 5723 4410',
      countryOfResidence: 'Mauritius',
      specialtyName: 'Orthopedic Surgery & Joint Replacement',
      serviceName: 'Free Expert Medical Opinion',
      description: 'Severe bilateral knee osteoarthritis. Inquiring about robotic total knee replacement surgery options.',
      urgency: 'routine',
      preferredCountry: 'Thailand',
      budgetMin: '8000',
      budgetMax: '15000',
    },
  },
  emergency: {
    label: '🚨 Oncology / Emergency',
    data: {
      firstName: 'Farhad',
      lastName: 'Goolam',
      email: 'f.goolam@example.com',
      phone: '+230 5255 1199',
      countryOfResidence: 'Mauritius',
      specialtyName: 'Oncology & Cancer Care',
      serviceName: 'Priority Hospital Admission & Transfer',
      description: 'Immediate specialized oncology consultation required for metastatic gastrointestinal tumor staging.',
      urgency: 'emergency',
      preferredCountry: 'Singapore',
      budgetMin: '20000',
      budgetMax: '40000',
    },
  },
};

export function AdminEmailTemplatesPage() {
  const [config, setConfig] = useState<EmailTemplateConfig>(getEmailTemplateConfig);
  const [activeScenario, setActiveScenario] = useState<keyof typeof SAMPLE_SCENARIOS>('cardiology');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Test email state
  const defaultAdmin = import.meta.env.VITE_ADMIN_EMAIL || 'kevinadlib@gmail.com';
  const [testEmail, setTestEmail] = useState(defaultAdmin);
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const sampleData = SAMPLE_SCENARIOS[activeScenario].data;

  const renderedHtml = useMemo(() => {
    return renderEmailHtml(config, sampleData);
  }, [config, sampleData]);

  const renderedSubject = useMemo(() => {
    return formatSubject(config.subject, {
      firstName: sampleData.firstName,
      lastName: sampleData.lastName,
      specialtyName: sampleData.specialtyName,
      serviceName: sampleData.serviceName,
      urgency: sampleData.urgency,
      countryOfResidence: sampleData.countryOfResidence,
    });
  }, [config.subject, sampleData]);

  const handleSave = () => {
    saveEmailTemplateConfig(config);
    setSaveStatus('Template saved successfully!');
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const handleReset = () => {
    if (confirm('Reset template to default settings? Any custom wording and colors will be replaced with defaults.')) {
      const def = resetEmailTemplateConfig();
      setConfig(def);
      setSaveStatus('Reset to default template!');
      setTimeout(() => setSaveStatus(null), 3500);
    }
  };

  const handleSendTest = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      setTestResult({ success: false, message: 'Please enter a valid email address.' });
      return;
    }
    setSendingTest(true);
    setTestResult(null);

    const res = await sendTestEmail(testEmail, config);
    setSendingTest(false);
    if (res.success) {
      setTestResult({ success: true, message: `Test email sent to ${testEmail}! Check your inbox.` });
    } else {
      setTestResult({ success: false, message: res.error || 'Failed to send test email.' });
    }
    setTimeout(() => setTestResult(null), 6000);
  };

  const insertVariable = (varName: string) => {
    setConfig(prev => ({
      ...prev,
      subject: prev.subject + ' ' + varName,
    }));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1400, margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ background: 'linear-gradient(135deg, #065f46, #059669)', color: '#ffffff', padding: '3px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Email Notifications
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>
            Inquiry Email Template Builder
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '0.875rem' }}>
            Pick and customize predefined email components. All changes automatically apply to live inquiry notifications.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={handleReset}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            title="Reset to default template"
          >
            <RotateCcw size={15} /> Reset Defaults
          </button>

          <button
            onClick={handleSave}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
          >
            <Save size={16} /> Save Template
          </button>
        </div>
      </div>

      {/* Alert toast notification */}
      {saveStatus && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.75rem 1.25rem', borderRadius: 8, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
          <CheckCircle2 size={18} color="#059669" /> {saveStatus}
        </div>
      )}

      {/* Main Grid: Left Controls (Pick & Choose) | Right (Live Preview & Test) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(420px, 1fr) minmax(460px, 1fr)', gap: '1.75rem', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: Modular Components Builder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Subject Line Card */}
          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '1.25rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
              Email Subject Line
            </label>
            <input
              type="text"
              className="form-input"
              value={config.subject}
              onChange={e => setConfig(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="e.g. [New Inquiry] {{patientName}} - {{specialty}}"
              style={{ width: '100%', marginBottom: '0.5rem', fontFamily: 'monospace', fontSize: '0.875rem' }}
            />
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginRight: 4 }}>Insert variable:</span>
              {['{{patientName}}', '{{specialty}}', '{{urgency}}', '{{country}}'].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => insertVariable(tag)}
                  style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 4, padding: '2px 6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'monospace' }}
                >
                  +{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Component 1: Top Banner */}
          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: config.banner.enabled ? '1rem' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Layers size={18} color="var(--color-primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>1. Header Banner Block</span>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={config.banner.enabled}
                  onChange={e => setConfig(prev => ({ ...prev, banner: { ...prev.banner, enabled: e.target.checked } }))}
                />
                Enabled
              </label>
            </div>

            {config.banner.enabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-light)' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 2 }}>Banner Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={config.banner.title}
                    onChange={e => setConfig(prev => ({ ...prev, banner: { ...prev.banner, title: e.target.value } }))}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 2 }}>Banner Subtitle</label>
                  <input
                    type="text"
                    className="form-input"
                    value={config.banner.subtitle}
                    onChange={e => setConfig(prev => ({ ...prev, banner: { ...prev.banner, subtitle: e.target.value } }))}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 2 }}>Background Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="color"
                        value={config.banner.bgColor}
                        onChange={e => setConfig(prev => ({ ...prev, banner: { ...prev.banner, bgColor: e.target.value } }))}
                        style={{ width: 36, height: 32, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        className="form-input"
                        value={config.banner.bgColor}
                        onChange={e => setConfig(prev => ({ ...prev, banner: { ...prev.banner, bgColor: e.target.value } }))}
                        style={{ fontSize: '0.8125rem' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 2 }}>Text Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="color"
                        value={config.banner.textColor}
                        onChange={e => setConfig(prev => ({ ...prev, banner: { ...prev.banner, textColor: e.target.value } }))}
                        style={{ width: 36, height: 32, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        className="form-input"
                        value={config.banner.textColor}
                        onChange={e => setConfig(prev => ({ ...prev, banner: { ...prev.banner, textColor: e.target.value } }))}
                        style={{ fontSize: '0.8125rem' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Component 2: Patient Info */}
          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: config.patientInfo.enabled ? '1rem' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Layers size={18} color="var(--color-primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>2. Patient Contact Details Block</span>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={config.patientInfo.enabled}
                  onChange={e => setConfig(prev => ({ ...prev, patientInfo: { ...prev.patientInfo, enabled: e.target.checked } }))}
                />
                Enabled
              </label>
            </div>

            {config.patientInfo.enabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-light)' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 2 }}>Section Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={config.patientInfo.title}
                    onChange={e => setConfig(prev => ({ ...prev, patientInfo: { ...prev.patientInfo, title: e.target.value } }))}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}>
                    <input
                      type="checkbox"
                      checked={config.patientInfo.showName}
                      onChange={e => setConfig(prev => ({ ...prev, patientInfo: { ...prev.patientInfo, showName: e.target.checked } }))}
                    />
                    Include Full Name
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}>
                    <input
                      type="checkbox"
                      checked={config.patientInfo.showEmail}
                      onChange={e => setConfig(prev => ({ ...prev, patientInfo: { ...prev.patientInfo, showEmail: e.target.checked } }))}
                    />
                    Include Email Link
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}>
                    <input
                      type="checkbox"
                      checked={config.patientInfo.showPhone}
                      onChange={e => setConfig(prev => ({ ...prev, patientInfo: { ...prev.patientInfo, showPhone: e.target.checked } }))}
                    />
                    Include Phone / WhatsApp
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}>
                    <input
                      type="checkbox"
                      checked={config.patientInfo.showCountry}
                      onChange={e => setConfig(prev => ({ ...prev, patientInfo: { ...prev.patientInfo, showCountry: e.target.checked } }))}
                    />
                    Include Country
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Component 3: Medical Details */}
          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: config.medicalDetails.enabled ? '1rem' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Layers size={18} color="var(--color-primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>3. Medical Requirements Block</span>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={config.medicalDetails.enabled}
                  onChange={e => setConfig(prev => ({ ...prev, medicalDetails: { ...prev.medicalDetails, enabled: e.target.checked } }))}
                />
                Enabled
              </label>
            </div>

            {config.medicalDetails.enabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-light)' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 2 }}>Section Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={config.medicalDetails.title}
                    onChange={e => setConfig(prev => ({ ...prev, medicalDetails: { ...prev.medicalDetails, title: e.target.value } }))}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}>
                    <input
                      type="checkbox"
                      checked={config.medicalDetails.showService !== false}
                      onChange={e => setConfig(prev => ({ ...prev, medicalDetails: { ...prev.medicalDetails, showService: e.target.checked } }))}
                    />
                    Include Requested Service
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}>
                    <input
                      type="checkbox"
                      checked={config.medicalDetails.showSpecialty}
                      onChange={e => setConfig(prev => ({ ...prev, medicalDetails: { ...prev.medicalDetails, showSpecialty: e.target.checked } }))}
                    />
                    Include Specialty Name
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}>
                    <input
                      type="checkbox"
                      checked={config.medicalDetails.showUrgency}
                      onChange={e => setConfig(prev => ({ ...prev, medicalDetails: { ...prev.medicalDetails, showUrgency: e.target.checked } }))}
                    />
                    Include Urgency Badge
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}>
                    <input
                      type="checkbox"
                      checked={config.medicalDetails.showDescription}
                      onChange={e => setConfig(prev => ({ ...prev, medicalDetails: { ...prev.medicalDetails, showDescription: e.target.checked } }))}
                    />
                    Include Description Box
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <input
                      type="color"
                      value={config.medicalDetails.accentColor}
                      onChange={e => setConfig(prev => ({ ...prev, medicalDetails: { ...prev.medicalDetails, accentColor: e.target.value } }))}
                      style={{ width: 26, height: 26, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Accent Border</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Component 4: Preferences & Budget */}
          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: config.preferences.enabled ? '1rem' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Layers size={18} color="var(--color-primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>4. Destination & Budget Preferences</span>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={config.preferences.enabled}
                  onChange={e => setConfig(prev => ({ ...prev, preferences: { ...prev.preferences, enabled: e.target.checked } }))}
                />
                Enabled
              </label>
            </div>

            {config.preferences.enabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-light)' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 2 }}>Section Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={config.preferences.title}
                    onChange={e => setConfig(prev => ({ ...prev, preferences: { ...prev.preferences, title: e.target.value } }))}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}>
                    <input
                      type="checkbox"
                      checked={config.preferences.showDestination}
                      onChange={e => setConfig(prev => ({ ...prev, preferences: { ...prev.preferences, showDestination: e.target.checked } }))}
                    />
                    Show Destination Preference
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}>
                    <input
                      type="checkbox"
                      checked={config.preferences.showBudget}
                      onChange={e => setConfig(prev => ({ ...prev, preferences: { ...prev.preferences, showBudget: e.target.checked } }))}
                    />
                    Show Budget Estimate
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Component 5: Call to Action & Buttons */}
          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: config.callToAction.enabled ? '1rem' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Layers size={18} color="var(--color-primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>5. Action Buttons & Follow-Up Note</span>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={config.callToAction.enabled}
                  onChange={e => setConfig(prev => ({ ...prev, callToAction: { ...prev.callToAction, enabled: e.target.checked } }))}
                />
                Enabled
              </label>
            </div>

            {config.callToAction.enabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-light)' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 2 }}>Internal Follow-up Note</label>
                  <input
                    type="text"
                    className="form-input"
                    value={config.callToAction.customNote}
                    onChange={e => setConfig(prev => ({ ...prev, callToAction: { ...prev.callToAction, customNote: e.target.value } }))}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}>
                    <input
                      type="checkbox"
                      checked={config.callToAction.showWhatsAppBtn}
                      onChange={e => setConfig(prev => ({ ...prev, callToAction: { ...prev.callToAction, showWhatsAppBtn: e.target.checked } }))}
                    />
                    Include "Reply via WhatsApp" Button
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}>
                    <input
                      type="checkbox"
                      checked={config.callToAction.showDashboardBtn}
                      onChange={e => setConfig(prev => ({ ...prev, callToAction: { ...prev.callToAction, showDashboardBtn: e.target.checked } }))}
                    />
                    Include "View in Admin" Button
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Component 6: Footer */}
          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: config.footer.enabled ? '1rem' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Layers size={18} color="var(--color-primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>6. Footer & Branding Block</span>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={config.footer.enabled}
                  onChange={e => setConfig(prev => ({ ...prev, footer: { ...prev.footer, enabled: e.target.checked } }))}
                />
                Enabled
              </label>
            </div>

            {config.footer.enabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-light)' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 2 }}>Disclaimer Text</label>
                  <input
                    type="text"
                    className="form-input"
                    value={config.footer.disclaimer}
                    onChange={e => setConfig(prev => ({ ...prev, footer: { ...prev.footer, disclaimer: e.target.value } }))}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 2 }}>Branding / Organization Line</label>
                  <input
                    type="text"
                    className="form-input"
                    value={config.footer.brandingText}
                    onChange={e => setConfig(prev => ({ ...prev, footer: { ...prev.footer, brandingText: e.target.value } }))}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Live Preview & Instant Test Dispatch */}
        <div style={{ position: 'sticky', top: 'calc(var(--navbar-height, 70px) + 1.5rem)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Preview Toolbar */}
          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={17} color="var(--color-primary)" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Live Preview</span>
            </div>

            {/* Scenario selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select
                className="form-select"
                value={activeScenario}
                onChange={e => setActiveScenario(e.target.value as any)}
                style={{ fontSize: '0.8125rem', padding: '0.35rem 0.75rem', width: 'auto' }}
              >
                {Object.entries(SAMPLE_SCENARIOS).map(([key, s]) => (
                  <option key={key} value={key}>{s.label}</option>
                ))}
              </select>

              {/* Viewport switch */}
              <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 6, overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setViewMode('desktop')}
                  style={{ padding: '4px 8px', background: viewMode === 'desktop' ? 'var(--color-primary)' : 'var(--color-surface)', color: viewMode === 'desktop' ? 'white' : 'var(--color-text-secondary)', border: 'none', cursor: 'pointer' }}
                  title="Desktop View"
                >
                  <Monitor size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('mobile')}
                  style={{ padding: '4px 8px', background: viewMode === 'mobile' ? 'var(--color-primary)' : 'var(--color-surface)', color: viewMode === 'mobile' ? 'white' : 'var(--color-text-secondary)', border: 'none', cursor: 'pointer' }}
                  title="Mobile View"
                >
                  <Smartphone size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Rendered Subject preview */}
          <div style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '0.6rem 1rem', fontSize: '0.8125rem' }}>
            <span style={{ color: 'var(--color-text-muted)', fontWeight: 600, marginRight: 6 }}>Subject:</span>
            <strong style={{ color: 'var(--color-text-primary)' }}>{renderedSubject}</strong>
          </div>

          {/* Email Preview Frame */}
          <div
            style={{
              background: '#cbd5e1',
              padding: '1.5rem 1rem',
              borderRadius: 12,
              border: '1.5px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'center',
              maxHeight: 560,
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: viewMode === 'desktop' ? 580 : 380,
                transition: 'max-width 0.25s ease',
              }}
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(renderedHtml) }}
            />
          </div>

          {/* Send Live Test Section */}
          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '1.25rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
              ⚡ Send Live Test Email to Your Inbox
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                className="form-input"
                value={testEmail}
                onChange={e => setTestEmail(e.target.value)}
                placeholder="your-email@example.com"
                style={{ flex: 1, fontSize: '0.85rem' }}
              />
              <button
                type="button"
                onClick={handleSendTest}
                disabled={sendingTest}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, whiteSpace: 'nowrap' }}
              >
                <Send size={14} /> {sendingTest ? 'Sending…' : 'Send Test'}
              </button>
            </div>

            {testResult && (
              <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.85rem', borderRadius: 6, fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', background: testResult.success ? '#ecfdf5' : '#fef2f2', border: '1px solid ' + (testResult.success ? '#a7f3d0' : '#fecaca'), color: testResult.success ? '#065f46' : '#991b1b' }}>
                {testResult.success ? <CheckCircle2 size={16} color="#059669" /> : <AlertCircle size={16} color="#dc2626" />}
                {testResult.message}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
