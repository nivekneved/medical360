import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Edit3,
  Trash2,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Search,
  Eye,
} from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { formatCostRange, formatCostMur } from '../../../core/services/format.service';
import { Honeypot } from '../../../components/Honeypot/Honeypot';
import { isHoneypotClean, detectSqlInjection, sanitizeInput } from '../../../core/services/validation.service';
import type { Specialty, Procedure } from '../../../core/types';

interface ProcedureManagerModalProps {
  isOpen: boolean;
  specialty: Specialty | null;
  onClose: () => void;
  onSaved?: (updatedSpecialty: Specialty) => void;
}

interface ProcedureFormData {
  id?: string;
  name: string;
  name_fr: string;
  name_kr: string;
  description: string;
  description_fr: string;
  description_kr: string;
  estimatedDurationDays: number;
  minCostUSD: number;
  maxCostUSD: number;
}

const EMPTY_FORM: ProcedureFormData = {
  name: '',
  name_fr: '',
  name_kr: '',
  description: '',
  description_fr: '',
  description_kr: '',
  estimatedDurationDays: 7,
  minCostUSD: 3000,
  maxCostUSD: 8000,
};

export const ProcedureManagerModal: React.FC<ProcedureManagerModalProps> = ({
  isOpen,
  specialty,
  onClose,
  onSaved,
}) => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProcedureFormData>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState('');
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'fr' | 'kr'>('en');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (specialty) {
      setProcedures(specialty.procedures ? [...specialty.procedures] : []);
      setIsEditing(false);
      setEditingIndex(null);
      setFormData(EMPTY_FORM);
      setFieldErrors({});
    }
  }, [specialty, isOpen]);

  if (!isOpen || !specialty) return null;

  const handleOpenAdd = () => {
    setIsEditing(true);
    setEditingIndex(null);
    setFormData({
      ...EMPTY_FORM,
      id: `proc-${Date.now()}`,
    });
    setFieldErrors({});
    setHoneypot('');
    setActiveLangTab('en');
  };

  const handleOpenEdit = (index: number) => {
    const p = procedures[index];
    if (!p) return;
    setIsEditing(true);
    setEditingIndex(index);
    setFormData({
      id: p.id,
      name: p.name || '',
      name_fr: p.name_fr || '',
      name_kr: p.name_kr || '',
      description: p.description || '',
      description_fr: p.description_fr || '',
      description_kr: p.description_kr || '',
      estimatedDurationDays: p.estimatedDurationDays || 7,
      minCostUSD: p.estimatedCostUSD?.min || 1000,
      maxCostUSD: p.estimatedCostUSD?.max || 5000,
    });
    setFieldErrors({});
    setHoneypot('');
  };

  const handleDuplicate = (index: number) => {
    const original = procedures[index];
    if (!original) return;
    const duplicated: Procedure = {
      ...original,
      id: `proc-${Date.now()}`,
      name: `${original.name} (Copy)`,
    };
    const updated = [...procedures, duplicated];
    setProcedures(updated);
    persistChanges(updated, 'Procedure duplicated successfully');
  };

  const handleDelete = (index: number) => {
    const p = procedures[index];
    if (!p) return;
    if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
      const updated = procedures.filter((_, i) => i !== index);
      setProcedures(updated);
      persistChanges(updated, 'Procedure deleted successfully');
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= procedures.length) return;
    const updated = [...procedures];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setProcedures(updated);
    persistChanges(updated, 'Order updated');
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Procedure title is required (English).';
    } else if (detectSqlInjection(formData.name)) {
      errors.name = 'Invalid database characters detected.';
    }

    if (!formData.description.trim()) {
      errors.description = 'Clinical description is required (English).';
    } else if (detectSqlInjection(formData.description)) {
      errors.description = 'Invalid characters in description.';
    }

    if (formData.estimatedDurationDays <= 0 || isNaN(formData.estimatedDurationDays)) {
      errors.estimatedDurationDays = 'Stay duration must be at least 1 day.';
    }

    if (formData.minCostUSD <= 0 || isNaN(formData.minCostUSD)) {
      errors.minCostUSD = 'Minimum cost must be greater than 0.';
    }

    if (formData.maxCostUSD <= 0 || isNaN(formData.maxCostUSD)) {
      errors.maxCostUSD = 'Maximum cost must be greater than 0.';
    } else if (formData.maxCostUSD < formData.minCostUSD) {
      errors.maxCostUSD = 'Max cost cannot be lower than Min cost.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isHoneypotClean(honeypot)) {
      setIsEditing(false);
      return;
    }

    if (!validateForm()) return;

    const newProcedure: Procedure = {
      id: formData.id || `proc-${Date.now()}`,
      specialtyId: specialty.id,
      name: sanitizeInput(formData.name.trim()),
      name_fr: sanitizeInput(formData.name_fr.trim()) || undefined,
      name_kr: sanitizeInput(formData.name_kr.trim()) || undefined,
      description: sanitizeInput(formData.description.trim()),
      description_fr: sanitizeInput(formData.description_fr.trim()) || undefined,
      description_kr: sanitizeInput(formData.description_kr.trim()) || undefined,
      estimatedDurationDays: Number(formData.estimatedDurationDays),
      estimatedCostUSD: {
        min: Number(formData.minCostUSD),
        max: Number(formData.maxCostUSD),
      },
    };

    let updated: Procedure[];
    if (editingIndex !== null) {
      updated = procedures.map((p, i) => (i === editingIndex ? newProcedure : p));
    } else {
      updated = [...procedures, newProcedure];
    }

    setProcedures(updated);
    setIsEditing(false);
    setEditingIndex(null);
    setFormData(EMPTY_FORM);
    persistChanges(updated, editingIndex !== null ? 'Procedure card updated' : 'New procedure card added');
  };

  const persistChanges = async (updatedList: Procedure[], msg: string) => {
    setSaving(true);
    setStatusMessage(null);
    try {
      const updatedSpecialty = await mockEngine.updateSpecialty(specialty.id, {
        procedures: updatedList,
      });
      setSaveSuccess(true);
      setStatusMessage(msg);
      if (onSaved) onSaved(updatedSpecialty);
      setTimeout(() => {
        setSaveSuccess(false);
        setStatusMessage(null);
      }, 2500);
    } catch (err: any) {
      console.error('Failed to update procedures:', err);
      setStatusMessage('Error saving changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredProcedures = procedures.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.name_fr || '').toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(9, 13, 16, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-2xl)',
          width: '100%',
          maxWidth: 960,
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-surface-2)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
                Procedures & Estimated Cost Breakdown
              </h2>
              <span
                style={{
                  background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}
              >
                {specialty.name}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              Add, edit, reorder, or delete treatment cards displayed on the public specialty page.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {statusMessage && (
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: saveSuccess ? 'var(--color-primary)' : 'var(--color-danger)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                {saveSuccess ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                {statusMessage}
              </span>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
                padding: 4,
                borderRadius: '50%',
              }}
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          {isEditing ? (
            /* ─────────────────────────────────────────────────────────────
               EDIT / ADD PROCEDURE FORM
               ───────────────────────────────────────────────────────────── */
            <form onSubmit={handleFormSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Honeypot value={honeypot} onChange={setHoneypot} id="proc_form_hp" name="proc_form_hp" />

              <div
                style={{
                  background: 'var(--color-surface-2)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} color="var(--color-primary)" />
                  <strong style={{ fontSize: '0.95rem' }}>
                    {editingIndex !== null ? 'Edit Procedure Card' : 'Create New Procedure Card'}
                  </strong>
                </div>

                {/* Multilingual Tabs */}
                <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--color-surface)', padding: 3, borderRadius: 8, border: '1px solid var(--color-border)' }}>
                  <button
                    type="button"
                    onClick={() => setActiveLangTab('en')}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      borderRadius: 6,
                      border: 'none',
                      cursor: 'pointer',
                      background: activeLangTab === 'en' ? 'var(--color-primary)' : 'transparent',
                      color: activeLangTab === 'en' ? '#ffffff' : 'var(--color-text-muted)',
                    }}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLangTab('fr')}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      borderRadius: 6,
                      border: 'none',
                      cursor: 'pointer',
                      background: activeLangTab === 'fr' ? 'var(--color-primary)' : 'transparent',
                      color: activeLangTab === 'fr' ? '#ffffff' : 'var(--color-text-muted)',
                    }}
                  >
                    🇫🇷 Français
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLangTab('kr')}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      borderRadius: 6,
                      border: 'none',
                      cursor: 'pointer',
                      background: activeLangTab === 'kr' ? 'var(--color-primary)' : 'transparent',
                      color: activeLangTab === 'kr' ? '#ffffff' : 'var(--color-text-muted)',
                    }}
                  >
                    🇲🇺 Kreol
                  </button>
                </div>
              </div>

              {/* Title & Description Tabs */}
              {activeLangTab === 'en' && (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Procedure Name (EN) <span style={{ color: 'var(--color-danger)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Brain Tumour Surgery"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                      }}
                      style={{ borderColor: fieldErrors.name ? 'var(--color-danger)' : undefined }}
                    />
                    {fieldErrors.name && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: 4, display: 'block' }}>
                        {fieldErrors.name}
                      </span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Clinical Description (EN) <span style={{ color: 'var(--color-danger)' }}>*</span>
                    </label>
                    <textarea
                      className="form-input"
                      rows={2}
                      placeholder="e.g. Microsurgical removal of intracranial tumours."
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({ ...formData, description: e.target.value });
                        if (fieldErrors.description) setFieldErrors({ ...fieldErrors, description: '' });
                      }}
                      style={{ borderColor: fieldErrors.description ? 'var(--color-danger)' : undefined }}
                    />
                    {fieldErrors.description && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: 4, display: 'block' }}>
                        {fieldErrors.description}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {activeLangTab === 'fr' && (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Nom de la Procédure (FR)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="ex: Chirurgie des Tumeurs Cérébrales"
                      value={formData.name_fr}
                      onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Description Clinique (FR)
                    </label>
                    <textarea
                      className="form-input"
                      rows={2}
                      placeholder="ex: Ablation microchirurgicale des tumeurs intracrâniennes."
                      value={formData.description_fr}
                      onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {activeLangTab === 'kr' && (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Non Procedir (Kreol Morisien)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="ex: Operasion Timer Servo"
                      value={formData.name_kr}
                      onChange={(e) => setFormData({ ...formData, name_kr: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Deskripsion (Kreol Morisien)
                    </label>
                    <textarea
                      className="form-input"
                      rows={2}
                      placeholder="ex: Sirirzi pou tir timer dan servo."
                      value={formData.description_kr}
                      onChange={(e) => setFormData({ ...formData, description_kr: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Metrics: Stay Duration & USD Price Range */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Stay Duration (Days) <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Clock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      type="number"
                      min={1}
                      max={120}
                      className="form-input"
                      value={formData.estimatedDurationDays}
                      onChange={(e) => setFormData({ ...formData, estimatedDurationDays: parseInt(e.target.value) || 0 })}
                      style={{ paddingLeft: '2.4rem' }}
                    />
                  </div>
                  {fieldErrors.estimatedDurationDays && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: 4, display: 'block' }}>
                      {fieldErrors.estimatedDurationDays}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Min Cost (USD $) <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      type="number"
                      min={100}
                      step={100}
                      className="form-input"
                      value={formData.minCostUSD}
                      onChange={(e) => setFormData({ ...formData, minCostUSD: parseInt(e.target.value) || 0 })}
                      style={{ paddingLeft: '2.4rem' }}
                    />
                  </div>
                  {fieldErrors.minCostUSD && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: 4, display: 'block' }}>
                      {fieldErrors.minCostUSD}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Max Cost (USD $) <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      type="number"
                      min={100}
                      step={100}
                      className="form-input"
                      value={formData.maxCostUSD}
                      onChange={(e) => setFormData({ ...formData, maxCostUSD: parseInt(e.target.value) || 0 })}
                      style={{ paddingLeft: '2.4rem' }}
                    />
                  </div>
                  {fieldErrors.maxCostUSD && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: 4, display: 'block' }}>
                      {fieldErrors.maxCostUSD}
                    </span>
                  )}
                </div>
              </div>

              {/* Real-time Preview Box */}
              <div style={{ background: 'var(--color-surface-2)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.5rem' }}>
                  Live Card Preview (Public Specialty Page)
                </span>

                <div
                  style={{
                    background: 'var(--color-surface)',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.25rem', color: 'var(--color-text)' }}>
                      {formData.name || 'Brain Tumour Surgery'}
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                      {formData.description || 'Microsurgical removal of intracranial tumours.'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      <Clock size={12} /> Stay duration: ~{formData.estimatedDurationDays || 14} days
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      USD {formData.minCostUSD.toLocaleString()} – {formData.maxCostUSD.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      ~{(formData.minCostUSD * 46).toLocaleString()} - {(formData.maxCostUSD * 46).toLocaleString()} MUR
                    </div>
                    <button type="button" className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem', pointerEvents: 'none' }}>
                      Get Quote
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingIndex(null);
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ fontWeight: 700 }}>
                  {saving ? 'Saving...' : editingIndex !== null ? 'Save Changes' : 'Add Procedure Card'}
                </button>
              </div>
            </form>
          ) : (
            /* ─────────────────────────────────────────────────────────────
               PROCEDURE CARDS LIST VIEW
               ───────────────────────────────────────────────────────────── */
            <>
              {/* Toolbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 240, maxWidth: 400 }}>
                  <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search procedures in this specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '2.4rem', height: 40, fontSize: '0.85rem' }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                >
                  <Plus size={16} /> Add Procedure Card
                </button>
              </div>

              {/* Cards Listing */}
              {filteredProcedures.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    background: 'var(--color-surface-2)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1.5px dashed var(--color-border)',
                  }}
                >
                  <AlertCircle size={32} color="var(--color-text-muted)" style={{ margin: '0 auto 0.75rem' }} />
                  <h4 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 700 }}>No procedures found</h4>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    {searchQuery ? 'No procedures match your search query.' : 'Click "Add Procedure Card" to add the first procedure.'}
                  </p>
                  <button type="button" onClick={handleOpenAdd} className="btn btn-primary btn-sm">
                    <Plus size={14} /> Add First Procedure
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {filteredProcedures.map((proc, idx) => {
                    const originalIndex = procedures.findIndex((p) => p.id === proc.id);

                    return (
                      <div
                        key={proc.id || idx}
                        style={{
                          background: 'var(--color-surface)',
                          border: '1.5px solid var(--color-border)',
                          borderRadius: 'var(--radius-xl)',
                          padding: '1.25rem 1.5rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '1.25rem',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                          position: 'relative',
                        }}
                      >
                        {/* Order & Content */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', flex: 1 }}>
                          {/* Reorder Buttons */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                            <button
                              type="button"
                              disabled={originalIndex === 0}
                              onClick={() => handleMove(originalIndex, 'up')}
                              style={{
                                background: 'var(--color-surface-2)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 4,
                                padding: 2,
                                cursor: originalIndex === 0 ? 'not-allowed' : 'pointer',
                                opacity: originalIndex === 0 ? 0.3 : 1,
                                color: 'var(--color-text)',
                              }}
                              title="Move Up"
                            >
                              <ChevronUp size={12} />
                            </button>
                            <button
                              type="button"
                              disabled={originalIndex === procedures.length - 1}
                              onClick={() => handleMove(originalIndex, 'down')}
                              style={{
                                background: 'var(--color-surface-2)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 4,
                                padding: 2,
                                cursor: originalIndex === procedures.length - 1 ? 'not-allowed' : 'pointer',
                                opacity: originalIndex === procedures.length - 1 ? 0.3 : 1,
                                color: 'var(--color-text)',
                              }}
                              title="Move Down"
                            >
                              <ChevronDown size={12} />
                            </button>
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
                                {proc.name}
                              </h3>
                              {proc.name_fr && (
                                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', background: 'var(--color-surface-2)', padding: '1px 6px', borderRadius: 4 }}>
                                  FR: {proc.name_fr}
                                </span>
                              )}
                            </div>

                            <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', margin: '0 0 0.5rem', lineHeight: 1.4 }}>
                              {proc.description}
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                              <Clock size={13} color="var(--color-primary)" />
                              <span>Stay duration: ~{proc.estimatedDurationDays || 7} days</span>
                            </div>
                          </div>
                        </div>

                        {/* Pricing & Management Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                          <div style={{ textAlign: 'right', minWidth: 150 }}>
                            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                              {formatCostRange(proc.estimatedCostUSD?.min || 0, proc.estimatedCostUSD?.max || 0)}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                              ~{formatCostMur(proc.estimatedCostUSD?.min || 0, proc.estimatedCostUSD?.max || 0)}
                            </div>
                          </div>

                          {/* Actions */}
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(originalIndex)}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 4 }}
                              title="Edit Procedure"
                            >
                              <Edit3 size={13} /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDuplicate(originalIndex)}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '6px 8px' }}
                              title="Duplicate Card"
                            >
                              <Copy size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(originalIndex)}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '6px 8px', color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                              title="Delete Card"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid var(--color-border)',
            background: 'var(--color-surface-2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Total <strong>{procedures.length}</strong> procedure cards in catalog
          </div>

          <button type="button" onClick={onClose} className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
