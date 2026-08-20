import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Save, RotateCcw, ExternalLink, Globe, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useCMS } from '../../../hooks/useCMS';
import { mockEngine } from '../../../core/mock/engine';
import { ImageField } from '../components/ImageField';

export function AdminPageEditor() {
  const { pageId } = useParams<{ pageId: string }>();
  const activePageId = pageId || 'home';
  const { data, loading, reload } = useCMS(activePageId);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeLang, setActiveLang] = useState<'en' | 'fr' | 'kr'>('fr');

  useEffect(() => {
    if (data && data.content) {
      setFormData(JSON.parse(JSON.stringify(data.content)));
    }
  }, [data]);

  const handleUpdate = (field: string, lang: string, value: string) => {
    setSavedSuccess(false);
    setFormData((prev) => {
      const existing = prev[field];
      if (typeof existing === 'string') {
        return { ...prev, [field]: value };
      }
      return {
        ...prev,
        [field]: {
          ...(existing || {}),
          [lang]: value,
        },
      };
    });
  };

  const handleSave = async () => {
    if (!activePageId) return;
    setSaving(true);
    try {
      await mockEngine.updateCmsPage(activePageId, formData);
      reload();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    if (!confirm('Are you sure you want to reset this page to its default prefilled content? Any unsaved edits will be replaced.')) {
      return;
    }
    setResetting(true);
    try {
      const resetPage = await mockEngine.resetCmsPage(activePageId);
      setFormData(JSON.parse(JSON.stringify(resetPage.content)));
      reload();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to reset page to defaults.');
    } finally {
      setResetting(false);
    }
  };

  const getPublicLink = (pid: string) => {
    if (pid === 'home') return '/';
    if (pid === 'describe-need') return '/describe-need';
    if (pid === 'case-studies') return '/case-studies';
    if (pid === 'specialties') return '/specialties';
    if (pid === 'hospitals') return '/hospitals';
    if (pid === 'doctors') return '/doctors';
    return `/${pid}`;
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <div className="skeleton" style={{ height: 40, width: 250, margin: '0 auto 1.5rem', borderRadius: 8 }} />
        <div className="skeleton" style={{ height: 300, maxWidth: 800, margin: '0 auto', borderRadius: 16 }} />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
        <h2>Page "{activePageId}" Not Found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
          Please select a valid page from the sidebar menu.
        </p>
      </div>
    );
  }

  const fieldEntries = Object.entries(formData);

  return (
    <div style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
              CMS Content Manager
            </span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>/</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{data.title}</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            Editing: {data.title}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Edit live text & copy across English, French, and Kreol Morisien with instant front-end synchronization.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a
            href={getPublicLink(activePageId)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
            title="View this page on the live website"
          >
            <ExternalLink size={14} /> Preview Live Page
          </a>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleResetToDefault}
            disabled={resetting || saving}
            title="Revert back to default seed text"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <RotateCcw size={14} /> {resetting ? 'Resetting...' : 'Reset to Default'}
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            disabled={saving}
            id="admin-cms-save-btn"
            style={{ minWidth: 130 }}
          >
            <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Success alert banner */}
      {savedSuccess && (
        <div style={{
          background: 'rgba(22, 163, 74, 0.12)',
          border: '1.5px solid rgba(22, 163, 74, 0.3)',
          color: '#16a34a',
          padding: '0.875rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: 600,
          fontSize: '0.9375rem',
        }}>
          <CheckCircle2 size={18} />
          Content saved successfully! The front-end has been updated in real-time.
        </div>
      )}

      {/* Language Tabs Card */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={18} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Active Language Tab:</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className={`btn ${activeLang === 'fr' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setActiveLang('fr')}
            style={{ fontWeight: 600 }}
          >
            🇫🇷 Français (French)
          </button>
          <button
            type="button"
            className={`btn ${activeLang === 'kr' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setActiveLang('kr')}
            style={{ fontWeight: 600 }}
          >
            🇲🇺 Kreol Morisien
          </button>
          <button
            type="button"
            className={`btn ${activeLang === 'en' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setActiveLang('en')}
            style={{ fontWeight: 600 }}
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      {/* Content Form Fields */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-2xl)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem' }}>
            <Sparkles size={18} style={{ color: 'var(--color-accent)' }} />
            Prefilled Editable Copy ({fieldEntries.length} text blocks)
          </div>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            Showing values for: <strong style={{ textTransform: 'uppercase' }}>{activeLang}</strong>
          </span>
        </div>

        {fieldEntries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
            No editable text fields found for this page. Click "Reset to Default" to load prefilled seeds.
          </div>
        ) : (
          fieldEntries.map(([fieldKey, fieldVal]) => {
            const currentValue = typeof fieldVal === 'string'
              ? fieldVal
              : (fieldVal?.[activeLang] ?? fieldVal?.['en'] ?? '');

            const isMultiline = typeof currentValue === 'string' && (
              currentValue.length > 80 ||
              currentValue.includes('\n') ||
              fieldKey.toLowerCase().includes('desc') ||
              fieldKey.toLowerCase().includes('subtitle') ||
              fieldKey.toLowerCase().includes('p1') ||
              fieldKey.toLowerCase().includes('p2') ||
              fieldKey.toLowerCase().includes('p3') ||
              fieldKey.toLowerCase().includes('tagline')
            );

            // Format human-readable title
            const labelText = fieldKey
              .replace(/([A-Z])/g, ' $1')
              .replace(/_/g, ' ')
              .trim()
              .replace(/^./, (str) => str.toUpperCase());

            const isImage = fieldKey.toLowerCase().includes('image') || fieldKey.toLowerCase().includes('banner') || fieldKey.toLowerCase().includes('img') || fieldKey.toLowerCase().includes('photo') || (typeof currentValue === 'string' && (currentValue.startsWith('http') || currentValue.startsWith('data:image')) && (currentValue.includes('.jpg') || currentValue.includes('.png') || currentValue.includes('.webp') || currentValue.includes('unsplash') || currentValue.includes('data:image')));

            if (isImage) {
              return (
                <div
                  key={fieldKey}
                  style={{
                    background: 'rgba(0,0,0,0.015)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                  }}
                >
                  <ImageField
                    label={labelText}
                    value={currentValue}
                    onChange={(url) => handleUpdate(fieldKey, activeLang, url)}
                    helpText={`Key: ${fieldKey} (${activeLang.toUpperCase()})`}
                  />
                </div>
              );
            }

            return (
              <div
                key={fieldKey}
                style={{
                  background: 'rgba(0,0,0,0.015)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label
                    htmlFor={`cms-field-${fieldKey}`}
                    style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)' }}
                  >
                    {labelText}
                  </label>
                  <code style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.05)', padding: '0.15rem 0.4rem', borderRadius: 4, color: 'var(--color-text-muted)' }}>
                    {fieldKey}
                  </code>
                </div>

                {isMultiline ? (
                  <textarea
                    id={`cms-field-${fieldKey}`}
                    className="form-textarea"
                    rows={4}
                    value={currentValue}
                    placeholder={`Enter ${labelText} in ${activeLang.toUpperCase()}...`}
                    onChange={(e) => handleUpdate(fieldKey, activeLang, e.target.value)}
                    style={{ width: '100%', resize: 'vertical', lineHeight: 1.6 }}
                  />
                ) : (
                  <input
                    id={`cms-field-${fieldKey}`}
                    type="text"
                    className="form-input"
                    value={currentValue}
                    placeholder={`Enter ${labelText} in ${activeLang.toUpperCase()}...`}
                    onChange={(e) => handleUpdate(fieldKey, activeLang, e.target.value)}
                    style={{ width: '100%' }}
                  />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  <span>Language: <strong>{activeLang.toUpperCase()}</strong></span>
                  <span>{currentValue.length} characters</span>
                </div>
              </div>
            );
          })
        )}

        {/* Bottom Save Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleResetToDefault}
            disabled={resetting || saving}
          >
            Revert to Defaults
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
            style={{ minWidth: 150 }}
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
