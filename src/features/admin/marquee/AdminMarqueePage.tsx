import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Megaphone,
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Sparkles,
  ArrowRight,
  Gauge,
  Link2,
  Globe,
  PanelTop,
  PanelBottom,
} from 'lucide-react';

import { useCMS } from '../../../hooks/useCMS';
import { mockEngine } from '../../../core/mock/engine';
import './AdminMarqueePage.css';

export function AdminMarqueePage() {
  const { data: cmsData, loading, reload } = useCMS('marquee');

  const [activeLang, setActiveLang] = useState<'en' | 'fr' | 'kr'>('en');
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Form State
  const [enabled, setEnabled] = useState(true);
  const [position, setPosition] = useState<'above' | 'below'>('above');
  const [speedSeconds, setSpeedSeconds] = useState('45');
  const [badgeText, setBadgeText] = useState({
    en: 'NGO Enn Rêv Enn Sourir',
    fr: 'ONG Enn Rêv Enn Sourir',
    kr: 'ONG Enn Rev Enn Sourir',
  });
  const [messageText, setMessageText] = useState({
    en: "Med360 is a company owned by the NGO Enn Rev Enn Sourir. After 10 years in helping the needy's have access to specialised treatment in private clinic or abroad, we have now decided to extend our service to those who can afford. The profit will go back to the NGO to continue helping others.",
    fr: "Med360 est une entreprise détenue par l'ONG Enn Rêv Enn Sourir. Après 10 ans à aider les personnes dans le besoin à avoir accès à des soins spécialisés en clinique privée ou à l'étranger, nous avons désormais décidé d'étendre nos services à ceux qui peuvent se le permettre. Les bénéfices sont reversés à l'ONG pour continuer d'aider les autres.",
    kr: "Med360 li enn lakonpanyi ki apartenir a l'ONG Enn Rev Enn Sourir. Apre 10 banlane pe ed bann dimounn dan bezwin gagn akse a bann tretman spesialize dan klinik prive ouswa a letranze, nou finn deside elarzi nou servis pou bann ki kapav peye. Tou profi retourn dan l'ONG pou kontinie ed lezot.",
  });
  const [linkUrl, setLinkUrl] = useState({
    en: '/about',
    fr: '/about',
    kr: '/about',
  });
  const [linkLabel, setLinkLabel] = useState({
    en: 'Learn More',
    fr: 'En savoir plus',
    kr: 'Dekouver Plis',
  });

  // Populate from CMS data
  useEffect(() => {
    if (cmsData?.content) {
      const c = cmsData.content;
      if (typeof c.enabled !== 'undefined') setEnabled(String(c.enabled) !== 'false');
      if (c.position === 'above' || c.position === 'below') setPosition(c.position);
      if (c.speedSeconds) setSpeedSeconds(String(c.speedSeconds));
      if (c.badgeText) setBadgeText(prev => ({ ...prev, ...c.badgeText }));
      if (c.messageText) setMessageText(prev => ({ ...prev, ...c.messageText }));
      if (c.linkUrl) setLinkUrl(prev => ({ ...prev, ...c.linkUrl }));
      if (c.linkLabel) setLinkLabel(prev => ({ ...prev, ...c.linkLabel }));
    }
  }, [cmsData]);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setConfirmReset(false);

    try {
      await mockEngine.updateCmsPage('marquee', {
        enabled: enabled ? 'true' : 'false',
        position,
        speedSeconds,
        badgeText,
        messageText,
        linkUrl,
        linkLabel,
      });
      setSaveSuccess(true);
      reload();
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to save marquee text:', err);
    } finally {
      setSaving(false);
    }
  };


  const handleReset = async () => {
    setResetting(true);
    setConfirmReset(false);
    try {
      await mockEngine.resetCmsPage('marquee');
      reload();
      setSaveSuccess(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to reset marquee text:', err);
    } finally {
      setResetting(false);
    }
  };

  if (loading && !cmsData) {
    return (
      <div className="admin-marquee-page">
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-primary)' }}>
          Loading Scrolling Text configuration...
        </div>
      </div>
    );
  }

  const currentBadge = badgeText[activeLang] || badgeText.en;
  const currentMessage = messageText[activeLang] || messageText.en;
  const currentLink = linkUrl[activeLang] || linkUrl.en;
  const currentLabel = linkLabel[activeLang] || linkLabel.en;

  return (
    <div className="admin-marquee-page animate-fade-in">
      {/* ── Header ── */}
      <div className="admin-marquee-header">
        <div className="admin-marquee-header__title-row">
          <div className="admin-marquee-header__icon">
            <Megaphone size={24} />
          </div>
          <div>
            <h1>Scrolling Mission Ticker</h1>
            <p>Edit the continuous announcement ribbon displayed at the top of the main website.</p>
          </div>
        </div>

        <div className="admin-marquee-actions">
          <Link to="/" target="_blank" className="btn btn-outline btn-sm">
            <ExternalLink size={15} />
            <span>View Live on Site</span>
          </Link>

          {!confirmReset ? (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setConfirmReset(true)}
              disabled={saving || resetting}
            >
              <RotateCcw size={15} />
              <span>Reset Defaults</span>
            </button>
          ) : null}

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            disabled={saving || resetting}
          >
            <Save size={15} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* ── Inline Feedback Notifications (No Modals) ── */}
      {saveSuccess && (
        <div className="marquee-alert-banner marquee-alert-banner--success" role="status">
          <div className="marquee-alert-content">
            <CheckCircle2 size={18} />
            <span>Scrolling ticker text updated successfully! Changes are live across the site.</span>
          </div>
        </div>
      )}

      {confirmReset && (
        <div className="marquee-alert-banner marquee-alert-banner--confirm" role="alert">
          <div className="marquee-alert-content">
            <AlertTriangle size={18} />
            <span>Reset scrolling ticker text and settings to factory default seed data?</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={handleReset}
              disabled={resetting}
            >
              {resetting ? 'Resetting...' : 'Yes, Reset Now'}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => setConfirmReset(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Live Interactive Preview Card ── */}
      <div className="marquee-preview-card">
        <div className="marquee-preview-card__header">
          <div className="marquee-preview-card__title">
            <Sparkles size={16} color="var(--color-primary)" />
            <span>Live Ticker Preview ({activeLang.toUpperCase()})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="marquee-preview-badge" style={{ background: 'rgba(6, 95, 70, 0.08)' }}>
              Placement: {position === 'above' ? 'Above Banner' : 'Below Banner'}
            </span>
            <span className="marquee-preview-badge">
              {enabled ? 'Active • Scrolling' : 'Disabled / Hidden'}
            </span>
          </div>
        </div>


        <div className="marquee-preview-box">
          {enabled ? (
            <div className="mission-marquee" style={{ border: 'none' }}>
              <div className="mission-marquee__inner">
                <div className="mission-marquee__badge">
                  <span className="mission-marquee__pulse" aria-hidden="true">
                    <span className="mission-marquee__dot" />
                  </span>
                  <HeartPulse size={16} />
                  <span className="mission-marquee__badge-text">{currentBadge}</span>
                </div>

                <div className="mission-marquee__container">
                  <div 
                    className="mission-marquee__track"
                    style={{ animationDuration: `${speedSeconds}s` }}
                  >
                    {[1, 2, 3].map(idx => (
                      <div key={idx} className="mission-marquee__item">
                        <span className="mission-marquee__text">
                          <strong className="mission-marquee__highlight">Med360</strong>{' '}
                          {currentMessage}
                        </span>

                        <span className="mission-marquee__link">
                          <span>{currentLabel}</span>
                          <ArrowRight size={12} />
                        </span>

                        <span className="mission-marquee__separator" aria-hidden="true">
                          <Sparkles size={14} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Ticker is currently switched off in settings below.
            </div>
          )}
        </div>
      </div>

      {/* ── Form Fields Grid ── */}
      <div className="marquee-form-grid">
        {/* Left Column: Multilingual Content */}
        <div className="marquee-card">
          <div className="marquee-card__header">
            <h2 className="marquee-card__title">Multilingual Text Content</h2>
            <div className="marquee-lang-tabs">
              <button
                type="button"
                className={`marquee-lang-tab ${activeLang === 'en' ? 'marquee-lang-tab--active' : ''}`}
                onClick={() => setActiveLang('en')}
              >
                English (EN)
              </button>
              <button
                type="button"
                className={`marquee-lang-tab ${activeLang === 'fr' ? 'marquee-lang-tab--active' : ''}`}
                onClick={() => setActiveLang('fr')}
              >
                Français (FR)
              </button>
              <button
                type="button"
                className={`marquee-lang-tab ${activeLang === 'kr' ? 'marquee-lang-tab--active' : ''}`}
                onClick={() => setActiveLang('kr')}
              >
                Kreol (KR)
              </button>
            </div>
          </div>

          <div className="marquee-field-group">
            <label className="marquee-field-label">
              Left Badge Title ({activeLang.toUpperCase()})
            </label>
            <input
              type="text"
              className="marquee-input"
              value={badgeText[activeLang] || ''}
              onChange={e => {
                const val = e.target.value;
                setBadgeText(prev => ({ ...prev, [activeLang]: val }));
              }}
              placeholder="e.g. NGO Enn Rêv Enn Sourir"
            />
            <span className="marquee-field-help">
              Displayed on the static left pulse badge.
            </span>
          </div>

          <div className="marquee-field-group">
            <label className="marquee-field-label">
              Scrolling Mission Statement ({activeLang.toUpperCase()})
            </label>
            <textarea
              className="marquee-textarea"
              rows={4}
              value={messageText[activeLang] || ''}
              onChange={e => {
                const val = e.target.value;
                setMessageText(prev => ({ ...prev, [activeLang]: val }));
              }}
              placeholder="Enter the full mission statement that continuously scrolls across the page..."
            />
            <span className="marquee-field-help">
              Character count: {(messageText[activeLang] || '').length} characters.
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="marquee-field-group">
              <label className="marquee-field-label">
                Link Label ({activeLang.toUpperCase()})
              </label>
              <input
                type="text"
                className="marquee-input"
                value={linkLabel[activeLang] || ''}
                onChange={e => {
                  const val = e.target.value;
                  setLinkLabel(prev => ({ ...prev, [activeLang]: val }));
                }}
                placeholder="e.g. Learn More / En savoir plus"
              />
            </div>

            <div className="marquee-field-group">
              <label className="marquee-field-label">
                Destination URL ({activeLang.toUpperCase()})
              </label>
              <input
                type="text"
                className="marquee-input"
                value={linkUrl[activeLang] || ''}
                onChange={e => {
                  const val = e.target.value;
                  setLinkUrl(prev => ({ ...prev, [activeLang]: val }));
                }}
                placeholder="e.g. /about"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Display & Playback Settings */}
        <div>
          <div className="marquee-card">
            <div className="marquee-card__header">
              <h2 className="marquee-card__title">Playback Settings</h2>
            </div>

            <div className="marquee-toggle-row" style={{ borderBottom: '1px solid var(--color-border)', marginBottom: '1rem', paddingBottom: '1rem' }}>
              <div className="marquee-toggle-info">
                <span className="marquee-toggle-title">Enable Marquee</span>
                <span className="marquee-toggle-desc">Show or hide on the website</span>
              </div>
              <input
                type="checkbox"
                checked={enabled}
                onChange={e => setEnabled(e.target.checked)}
                style={{ width: 20, height: 20, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
              />
            </div>

            <div className="marquee-field-group">
              <label className="marquee-field-label">
                <PanelTop size={14} style={{ display: 'inline', marginRight: 4 }} />
                Banner Placement on Main Page
              </label>
              <div className="marquee-position-grid">
                <button
                  type="button"
                  className={`marquee-position-option ${position === 'above' ? 'marquee-position-option--active' : ''}`}
                  onClick={() => setPosition('above')}
                >
                  <div className="marquee-position-header">
                    <PanelTop size={16} color={position === 'above' ? 'var(--color-primary)' : 'var(--color-text-secondary)'} />
                    <span>Above Banner</span>
                  </div>
                  <span className="marquee-position-desc">
                    Top of page directly below header navbar
                  </span>
                </button>

                <button
                  type="button"
                  className={`marquee-position-option ${position === 'below' ? 'marquee-position-option--active' : ''}`}
                  onClick={() => setPosition('below')}
                >
                  <div className="marquee-position-header">
                    <PanelBottom size={16} color={position === 'below' ? 'var(--color-primary)' : 'var(--color-text-secondary)'} />
                    <span>Below Banner</span>
                  </div>
                  <span className="marquee-position-desc">
                    Between Hero banner and Specialties section
                  </span>
                </button>
              </div>
            </div>

            <div className="marquee-field-group">
              <label className="marquee-field-label">
                <Gauge size={14} style={{ display: 'inline', marginRight: 4 }} />
                Scroll Loop Duration
              </label>
              <select
                className="marquee-input"
                value={speedSeconds}
                onChange={e => setSpeedSeconds(e.target.value)}
              >
                <option value="60">Slow (60 seconds per loop)</option>
                <option value="45">Normal (45 seconds per loop) - Recommended</option>
                <option value="30">Fast (30 seconds per loop)</option>
                <option value="20">Rapid (20 seconds per loop)</option>
              </select>
              <span className="marquee-field-help">
                Controls the speed of the continuous horizontal scroll.
              </span>
            </div>


            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleSave}
                disabled={saving || resetting}
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
