import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Search,
  Copy,
} from 'lucide-react';
import { useCMS } from '../../../hooks/useCMS';
import { mockEngine } from '../../../core/mock/engine';
import { ImageField } from '../components/ImageField';
import { RichTextEditor } from '../components/RichTextEditor';
import { FeaturedShowcaseManager } from '../components/FeaturedShowcaseManager';
import { CustomFieldCard } from './components/CustomFieldCard';
import { PageEditorNavSidebar } from './components/PageEditorNavSidebar';

const CMS_PAGES = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'about', label: 'About Us', icon: 'ℹ️' },
  { id: 'services', label: 'Services', icon: '🩺' },
  { id: 'hospitals', label: 'Hospitals', icon: '🏢' },
  { id: 'specialties', label: 'Specialties', icon: '⭐' },
  { id: 'doctors', label: 'Doctors', icon: '👨‍⚕️' },
  { id: 'case-studies', label: 'Stories', icon: '📖' },
  { id: 'cost-calculator', label: 'Calculator', icon: '🧮' },
  { id: 'visa-guide', label: 'Visa Guide', icon: '✈️' },
  { id: 'contact', label: 'Contact', icon: '✉️' },
  { id: 'privacy', label: 'Privacy', icon: '🔒' },
  { id: 'terms', label: 'Terms', icon: '📜' },
];

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

  // Add field state
  const [showAddCard, setShowAddCard] = useState(false);
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
    setShowAddCard(false);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await mockEngine.updateCmsPage(activePageId, formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
      reload();
    } catch (err) {
      console.error(err);
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    if (!confirm(`Reset all content for "${activePageId}" to original factory defaults?`)) {
      return;
    }
    setResetting(true);
    try {
      await mockEngine.resetCmsPage(activePageId);
      reload();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to reset page.');
    } finally {
      setResetting(false);
    }
  };

  const fieldKeys = useMemo(() => {
    return Object.keys(formData).filter((k) => {
      if (!searchFilter.trim()) return true;
      const q = searchFilter.toLowerCase();
      const val = formData[k];
      const valStr = typeof val === 'object' ? JSON.stringify(val) : String(val);
      return k.toLowerCase().includes(q) || valStr.toLowerCase().includes(q);
    });
  }, [formData, searchFilter]);

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Loading CMS editor...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '1.5rem 0' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>CMS Page Content Editor</h1>
            <span style={{ fontSize: '0.8rem', background: 'var(--color-surface-2)', padding: '2px 10px', borderRadius: 999, fontWeight: 700 }}>
              /{activePageId}
            </span>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Edit live multilingual copy, titles, banners, and layout blocks without code deployment.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link
            to={activePageId === 'home' ? '/' : `/${activePageId}`}
            target="_blank"
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <ExternalLink size={14} /> View Live Page
          </Link>

          <button
            type="button"
            onClick={handleResetToDefaults}
            disabled={resetting}
            className="btn btn-outline btn-sm"
            style={{ color: 'var(--color-warning)', borderColor: 'rgba(217, 119, 6, 0.4)' }}
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Left Sidebar: Pages Navigation */}
        <PageEditorNavSidebar pages={CMS_PAGES} activePageId={activePageId} />

        {/* Right Content Area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Active Page Featured Showcase Manager for Home */}
          {activePageId === 'home' && (
            <div style={{ marginBottom: '1.75rem' }}>
              <FeaturedShowcaseManager />
            </div>
          )}

          {/* Inline Add Dynamic Field Card */}
          {showAddCard && (
            <CustomFieldCard
              newFieldKey={newFieldKey}
              onFieldKeyChange={setNewFieldKey}
              newFieldType={newFieldType}
              onFieldTypeChange={setNewFieldType}
              newFieldValFr={newFieldValFr}
              onFieldValFrChange={setNewFieldValFr}
              newFieldValEn={newFieldValEn}
              onFieldValEnChange={setNewFieldValEn}
              newFieldValKr={newFieldValKr}
              onFieldValKrChange={setNewFieldValKr}
              onSave={handleAddField}
              onCancel={() => setShowAddCard(false)}
            />
          )}

          {/* Editor Container */}
          <form onSubmit={handleSave} style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
            {/* Action Bar inside form */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
              {/* Language Switcher Tabs */}
              <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--color-surface-2)', padding: 4, borderRadius: 'var(--radius-md)' }}>
                <button
                  type="button"
                  onClick={() => setActiveLang('fr')}
                  className={`btn btn-sm ${activeLang === 'fr' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ border: 'none' }}
                >
                  🇫🇷 Français (Default)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLang('en')}
                  className={`btn btn-sm ${activeLang === 'en' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ border: 'none' }}
                >
                  🇬🇧 English
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLang('kr')}
                  className={`btn btn-sm ${activeLang === 'kr' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ border: 'none' }}
                >
                  🇲🇺 Kreol Morisien
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowAddCard(!showAddCard)}
                  className="btn btn-outline btn-sm"
                  style={{ fontWeight: 700 }}
                >
                  <Plus size={14} /> {showAddCard ? 'Close Form' : 'Add Custom Field'}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary btn-sm"
                  style={{ fontWeight: 700, minWidth: 130 }}
                >
                  <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {savedSuccess && (
              <div style={{ background: 'rgba(6, 95, 70, 0.1)', color: 'var(--color-primary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-lg)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} /> All page modifications have been saved and applied instantly!
              </div>
            )}

            {/* Search Filter */}
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                placeholder="Filter CMS fields on this page..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>

            {/* Field Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {fieldKeys.map((key) => {
                const val = formData[key];
                const isImage = key.toLowerCase().includes('image') || key.toLowerCase().includes('banner') || (typeof val === 'string' && val.startsWith('/assets/'));
                const isRichText = key.toLowerCase().includes('content') || key.toLowerCase().includes('body') || (typeof val === 'string' && val.includes('<'));

                return (
                  <div key={key} style={{ background: 'var(--color-surface-2)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '0.875rem', color: 'var(--color-text)' }}>
                        {key}
                      </strong>
                      <button
                        type="button"
                        onClick={() => handleDeleteField(key)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', opacity: 0.6 }}
                        title="Delete field"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {isImage ? (
                      <ImageField
                        value={typeof val === 'object' ? val[activeLang] || val['fr'] || '' : val}
                        onChange={(newVal) => handleUpdate(key, activeLang, newVal)}
                        label=""
                      />
                    ) : isRichText ? (
                      <RichTextEditor
                        value={typeof val === 'object' ? val[activeLang] || val['fr'] || '' : val}
                        onChange={(newVal) => handleUpdate(key, activeLang, newVal)}
                        label=""
                      />
                    ) : typeof val === 'object' ? (
                      <input
                        type="text"
                        className="form-input"
                        value={val[activeLang] ?? val['fr'] ?? ''}
                        onChange={(e) => handleUpdate(key, activeLang, e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-input"
                        value={val ?? ''}
                        onChange={(e) => handleUpdate(key, activeLang, e.target.value)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
