import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Save,
  RotateCcw,
  ExternalLink,
  Globe,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Plus,
  Trash2,
  Search,
  Copy,
  SlidersHorizontal,
  X,
  Image as ImageIcon,
  Type,
  FileText as FileTextIcon,
} from 'lucide-react';
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
  const [searchFilter, setSearchFilter] = useState('');

  // Add field modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'multiline' | 'image'>('text');
  const [newFieldValFr, setNewFieldValFr] = useState('');
  const [newFieldValEn, setNewFieldValEn] = useState('');
  const [newFieldValKr, setNewFieldValKr] = useState('');

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

  const handleAddField = () => {
    const key = newFieldKey.trim();
    if (!key) {
      alert('Please enter a valid unique field key.');
      return;
    }
    if (formData[key]) {
      alert(`Field key "${key}" already exists on this page.`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [key]: {
        fr: newFieldValFr.trim(),
        en: newFieldValEn.trim() || newFieldValFr.trim(),
        kr: newFieldValKr.trim() || newFieldValFr.trim(),
      },
    }));

    setNewFieldKey('');
    setNewFieldValFr('');
    setNewFieldValEn('');
    setNewFieldValKr('');
    setShowAddModal(false);
  };

  const handleDeleteField = (fieldKey: string) => {
    if (!confirm(`Are you sure you want to remove the field "${fieldKey}"?`)) {
      return;
    }
    setFormData((prev) => {
      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });
  };

  const handleCopyLang = (fromLang: 'fr' | 'en' | 'kr', toLang: 'fr' | 'en' | 'kr') => {
    if (fromLang === toLang) return;
    if (!confirm(`Copy all text values from ${fromLang.toUpperCase()} into ${toLang.toUpperCase()} for any empty fields?`)) {
      return;
    }
    setFormData((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        const val = next[key];
        if (val && typeof val === 'object') {
          if (!val[toLang] || val[toLang] === '') {
            val[toLang] = val[fromLang] || '';
          }
        }
      });
      return next;
    });
    alert(`Copied text from ${fromLang.toUpperCase()} to ${toLang.toUpperCase()}!`);
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
    if (pid === 'visa-guide') return '/visa-guide';
    if (pid === 'cost-calculator') return '/cost-calculator';
    if (pid === 'privacy') return '/privacy';
    if (pid === 'terms') return '/terms';
    if (pid === 'contact') return '/contact';
    if (pid === 'about') return '/about';
    if (pid === 'services') return '/services';
    return `/${pid}`;
  };

  const filteredFieldEntries = useMemo(() => {
    const entries = Object.entries(formData);
    if (!searchFilter.trim()) return entries;
    const q = searchFilter.toLowerCase();
    return entries.filter(([key, val]) => {
      const keyMatch = key.toLowerCase().includes(q);
      const strVal = typeof val === 'string' ? val : Object.values(val || {}).join(' ');
      const valMatch = strVal.toLowerCase().includes(q);
      return keyMatch || valMatch;
    });
  }, [formData, searchFilter]);

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

  return (
    <div style={{ padding: '2rem' }}>
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
            Live content management with instant preview, field addition, and multilingual synchronization (EN / FR / KR).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setShowAddModal(true)}
            style={{ fontWeight: 700, borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
          >
            <Plus size={15} /> Add New Field
          </button>
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
            <RotateCcw size={14} /> {resetting ? 'Resetting...' : 'Reset Defaults'}
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            disabled={saving}
            id="admin-cms-save-btn"
            style={{ minWidth: 140, fontWeight: 700 }}
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
          Content saved successfully! All updates are live.
        </div>
      )}

      {/* Language Tabs & Toolbar Card */}
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
        {/* Left: Language Selection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Globe size={18} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Language:</span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              type="button"
              className={`btn ${activeLang === 'fr' ? 'btn-primary' : 'btn-outline'} btn-sm`}
              onClick={() => setActiveLang('fr')}
              style={{ fontWeight: 700 }}
            >
              🇫🇷 Français (French)
            </button>
            <button
              type="button"
              className={`btn ${activeLang === 'kr' ? 'btn-primary' : 'btn-outline'} btn-sm`}
              onClick={() => setActiveLang('kr')}
              style={{ fontWeight: 700 }}
            >
              🇲🇺 Kreol Morisien
            </button>
            <button
              type="button"
              className={`btn ${activeLang === 'en' ? 'btn-primary' : 'btn-outline'} btn-sm`}
              onClick={() => setActiveLang('en')}
              style={{ fontWeight: 700 }}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* Right: Search Filter and Language Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 220 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Filter fields..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{ paddingLeft: '2rem', height: 36, fontSize: '0.8125rem' }}
            />
            {searchFilter && (
              <button
                type="button"
                onClick={() => setSearchFilter('')}
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={12} />
              </button>
            )}
          </div>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => handleCopyLang('fr', activeLang === 'fr' ? 'en' : activeLang)}
            title="Pre-populate empty fields from French"
            style={{ fontSize: '0.78rem', gap: '0.35rem' }}
          >
            <Copy size={13} /> Copy from FR
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
            Editable Content Fields ({filteredFieldEntries.length} of {Object.keys(formData).length})
          </div>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            Editing tab: <strong style={{ textTransform: 'uppercase', color: 'var(--color-primary)' }}>{activeLang}</strong>
          </span>
        </div>

        {filteredFieldEntries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
            <SlidersHorizontal size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No matching fields found.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
              {searchFilter ? 'Try clearing your search filter.' : 'Click "Add New Field" or "Reset Defaults" to seed content.'}
            </p>
          </div>
        ) : (
          filteredFieldEntries.map(([fieldKey, fieldVal]) => {
            const currentValue = typeof fieldVal === 'string'
              ? fieldVal
              : (fieldVal?.[activeLang] ?? fieldVal?.['en'] ?? '');

            const isMultiline = typeof currentValue === 'string' && (
              currentValue.length > 70 ||
              currentValue.includes('\n') ||
              fieldKey.toLowerCase().includes('desc') ||
              fieldKey.toLowerCase().includes('subtitle') ||
              fieldKey.toLowerCase().includes('p1') ||
              fieldKey.toLowerCase().includes('p2') ||
              fieldKey.toLowerCase().includes('p3') ||
              fieldKey.toLowerCase().includes('tagline') ||
              fieldKey.toLowerCase().includes('disclaimer') ||
              fieldKey.toLowerCase().includes('guidance') ||
              fieldKey.toLowerCase().includes('hours')
            );

            // Format human-readable label
            const labelText = fieldKey
              .replace(/([A-Z])/g, ' $1')
              .replace(/_/g, ' ')
              .trim()
              .replace(/^./, (str) => str.toUpperCase());

            const isImage = fieldKey.toLowerCase().includes('image') ||
              fieldKey.toLowerCase().includes('banner') ||
              fieldKey.toLowerCase().includes('img') ||
              fieldKey.toLowerCase().includes('photo') ||
              (typeof currentValue === 'string' && (currentValue.startsWith('http') || currentValue.startsWith('data:image')) && (currentValue.includes('.jpg') || currentValue.includes('.png') || currentValue.includes('.webp') || currentValue.includes('unsplash') || currentValue.includes('data:image')));

            return (
              <div
                key={fieldKey}
                style={{
                  background: 'rgba(0,0,0,0.015)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  transition: 'border-color 0.2s',
                  position: 'relative',
                }}
              >
                {/* Field Top Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)' }}>
                      {isImage ? 'Image' : isMultiline ? 'Long Text' : 'Text'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteField(fieldKey)}
                      style={{ color: 'var(--color-danger)', opacity: 0.6, cursor: 'pointer', padding: 2 }}
                      title={`Delete field "${fieldKey}"`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Field Control */}
                {isImage ? (
                  <ImageField
                    label={labelText}
                    value={currentValue}
                    onChange={(url) => handleUpdate(fieldKey, activeLang, url)}
                    helpText={`Field Key: ${fieldKey} • ${activeLang.toUpperCase()}`}
                  />
                ) : isMultiline ? (
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

                {/* Field Footer Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  <span>Tab: <strong>{activeLang.toUpperCase()}</strong></span>
                  <span>{currentValue.length} characters</span>
                </div>
              </div>
            );
          })
        )}

        {/* Bottom Save Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={14} /> Add Another Field
          </button>

          <div style={{ display: 'flex', gap: '1rem' }}>
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
              style={{ minWidth: 160, fontWeight: 700 }}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Add New Field Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div style={{
            background: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            width: '100%',
            maxWidth: 520,
            padding: '2rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={20} color="var(--color-primary)" /> Add Content Field
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                  Field Key (camelCase) *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. heroBannerTitle, awardsSubtext, ctaNotice"
                  value={newFieldKey}
                  onChange={(e) => setNewFieldKey(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Use unique camelCase (alphanumeric only).
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                  Field Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className={`btn ${newFieldType === 'text' ? 'btn-primary' : 'btn-outline'} btn-sm`}
                    onClick={() => setNewFieldType('text')}
                  >
                    <Type size={14} /> Short Text
                  </button>
                  <button
                    type="button"
                    className={`btn ${newFieldType === 'multiline' ? 'btn-primary' : 'btn-outline'} btn-sm`}
                    onClick={() => setNewFieldType('multiline')}
                  >
                    <FileTextIcon size={14} /> Long Text
                  </button>
                  <button
                    type="button"
                    className={`btn ${newFieldType === 'image' ? 'btn-primary' : 'btn-outline'} btn-sm`}
                    onClick={() => setNewFieldType('image')}
                  >
                    <ImageIcon size={14} /> Image URL
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                  Initial French Value (FR)
                </label>
                {newFieldType === 'multiline' ? (
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Texte en français..."
                    value={newFieldValFr}
                    onChange={(e) => setNewFieldValFr(e.target.value)}
                    style={{ width: '100%' }}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Texte en français..."
                    value={newFieldValFr}
                    onChange={(e) => setNewFieldValFr(e.target.value)}
                    style={{ width: '100%' }}
                  />
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                  Initial English Value (EN)
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Text in English (optional)..."
                  value={newFieldValEn}
                  onChange={(e) => setNewFieldValEn(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddField}
                  disabled={!newFieldKey.trim()}
                  style={{ fontWeight: 700 }}
                >
                  Add Field
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
