import React, { useState } from 'react';
import {
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
  X,
  Check,
} from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { formatCostRange, formatCostMur } from '../../../core/services/format.service';
import { Honeypot } from '../../../components/Honeypot/Honeypot';
import { isHoneypotClean, detectSqlInjection, sanitizeInput } from '../../../core/services/validation.service';
import type { Specialty, Procedure } from '../../../core/types';

interface ProcedureInlineManagerProps {
  specialty: Specialty;
  onSaved?: (updatedSpecialty: Specialty) => void;
  l10n: (fr: string, kr: string, en: string) => string;
  l: (obj: any, field: string) => string;
  onQuoteClick?: (specialtyId: string) => void;
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

export const ProcedureInlineManager: React.FC<ProcedureInlineManagerProps> = ({
  specialty,
  onSaved,
  l10n,
  l,
  onQuoteClick,
}) => {
  const [procedures, setProcedures] = useState<Procedure[]>(specialty.procedures || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProcedureFormData>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState('');
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'fr' | 'kr'>('en');
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Keep synced if parent updates
  React.useEffect(() => {
    setProcedures(specialty.procedures || []);
  }, [specialty]);

  const handleOpenAdd = () => {
    setIsEditing(true);
    setEditingIndex(null);
    setFormData({
      ...EMPTY_FORM,
      id: `proc-${Date.now()}`,
    });
    setFieldErrors({});
    setHoneypot('');
    setDeleteConfirmIndex(null);
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
    setDeleteConfirmIndex(null);
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
    persistChanges(updated, 'Procedure duplicated');
  };

  const handleDelete = (index: number) => {
    const updated = procedures.filter((_, i) => i !== index);
    setProcedures(updated);
    setDeleteConfirmIndex(null);
    persistChanges(updated, 'Procedure removed');
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
      errors.name = 'Procedure title is required.';
    } else if (detectSqlInjection(formData.name)) {
      errors.name = 'Invalid characters detected.';
    }

    if (!formData.description.trim()) {
      errors.description = 'Clinical description is required.';
    } else if (detectSqlInjection(formData.description)) {
      errors.description = 'Invalid characters detected.';
    }

    if (formData.estimatedDurationDays <= 0 || isNaN(formData.estimatedDurationDays)) {
      errors.estimatedDurationDays = 'Duration must be at least 1 day.';
    }

    if (formData.minCostUSD <= 0 || isNaN(formData.minCostUSD)) {
      errors.minCostUSD = 'Min cost must be greater than 0.';
    }

    if (formData.maxCostUSD <= 0 || isNaN(formData.maxCostUSD)) {
      errors.maxCostUSD = 'Max cost must be greater than 0.';
    } else if (formData.maxCostUSD < formData.minCostUSD) {
      errors.maxCostUSD = 'Max cost cannot be less than Min cost.';
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
    persistChanges(updated, editingIndex !== null ? 'Procedure card saved' : 'New procedure added');
  };

  const persistChanges = async (updatedList: Procedure[], msg: string) => {
    setSaving(true);
    setStatusMessage(null);
    try {
      const updatedSpecialty = await mockEngine.updateSpecialty(specialty.id, {
        procedures: updatedList,
      });
      setStatusMessage({ text: msg });
      if (onSaved) onSaved(updatedSpecialty);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      console.error('Failed to update procedures:', err);
      setStatusMessage({ text: 'Failed to save changes. Please retry.', isError: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Section Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h2 className="text-h2" style={{ fontSize: '1.4rem', margin: 0 }}>
            {l10n('Procédures et Tarifs Estimés', 'Bann Tretman & Pri Estime', 'Procedures & Estimated Cost Breakdown')}
          </h2>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)', padding: '2px 8px', borderRadius: 12 }}>
            {procedures.length} {l10n('procédures', 'tretman', 'procedures')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {statusMessage && (
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: statusMessage.isError ? 'var(--color-danger)' : 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              {statusMessage.isError ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
              {statusMessage.text}
            </span>
          )}

          {!isEditing && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
            >
              <Plus size={14} /> {l10n('Ajouter une Procédure', 'Azout Tretman', 'Add Procedure')}
            </button>
          )}
        </div>
      </div>

      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
        {l10n(
          'Les coûts comprennent généralement le séjour à l\'hôpital, les honoraires du chirurgien, les examens préopératoires et les soins post-opératoires.',
          'Pri la kouver lasam lopital, fré sirizien, test avan loperasion ek swen apre tretman.',
          'Costs typically include hospital room stay, surgeon fees, pre-operative tests, and standard recovery medications.'
        )}
      </p>

      {/* ─────────────────────────────────────────────────────────────
         INLINE ADD / EDIT FORM (EXPANDABLE - ZERO POPUPS)
         ───────────────────────────────────────────────────────────── */}
      {isEditing && (
        <div
          style={{
            background: 'var(--color-surface)',
            border: '2px solid var(--color-primary)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--color-primary)" />
              <strong style={{ fontSize: '1.05rem', color: 'var(--color-text)' }}>
                {editingIndex !== null ? 'Edit Procedure Card' : 'Create New Procedure Card'}
              </strong>
            </div>

            {/* Language Switcher */}
            <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--color-surface-2)', padding: 3, borderRadius: 8 }}>
              <button
                type="button"
                onClick={() => setActiveLangTab('en')}
                style={{
                  padding: '3px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeLangTab === 'en' ? 'var(--color-primary)' : 'transparent',
                  color: activeLangTab === 'en' ? '#fff' : 'var(--color-text-muted)',
                }}
              >
                🇬🇧 EN
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('fr')}
                style={{
                  padding: '3px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeLangTab === 'fr' ? 'var(--color-primary)' : 'transparent',
                  color: activeLangTab === 'fr' ? '#fff' : 'var(--color-text-muted)',
                }}
              >
                🇫🇷 FR
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('kr')}
                style={{
                  padding: '3px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeLangTab === 'kr' ? 'var(--color-primary)' : 'transparent',
                  color: activeLangTab === 'kr' ? '#fff' : 'var(--color-text-muted)',
                }}
              >
                🇲🇺 KR
              </button>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Honeypot value={honeypot} onChange={setHoneypot} id="inline_proc_hp" name="inline_proc_hp" />

            {/* Fields according to active language */}
            {activeLangTab === 'en' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Procedure Title (English) <span style={{ color: 'var(--color-danger)' }}>*</span>
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
                  {fieldErrors.name && <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: 2, display: 'block' }}>{fieldErrors.name}</span>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Clinical Description (English) <span style={{ color: 'var(--color-danger)' }}>*</span>
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
                  {fieldErrors.description && <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: 2, display: 'block' }}>{fieldErrors.description}</span>}
                </div>
              </>
            )}

            {activeLangTab === 'fr' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Titre de la Procédure (Français)
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
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Description Clinique (Français)
                  </label>
                  <textarea
                    className="form-input"
                    rows={2}
                    placeholder="ex: Ablation microchirurgicale des tumeurs intracrâniennes."
                    value={formData.description_fr}
                    onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                  />
                </div>
              </>
            )}

            {activeLangTab === 'kr' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Non Tretman (Kreol Morisien)
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
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.25rem' }}>
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
              </>
            )}

            {/* Metrics: Stay Duration & USD Range */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Stay Duration (Days) <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Clock size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    type="number"
                    min={1}
                    max={120}
                    className="form-input"
                    value={formData.estimatedDurationDays}
                    onChange={(e) => setFormData({ ...formData, estimatedDurationDays: parseInt(e.target.value) || 0 })}
                    style={{ paddingLeft: '2.2rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Min Cost (USD $) <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    type="number"
                    min={100}
                    step={100}
                    className="form-input"
                    value={formData.minCostUSD}
                    onChange={(e) => setFormData({ ...formData, minCostUSD: parseInt(e.target.value) || 0 })}
                    style={{ paddingLeft: '2.2rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Max Cost (USD $) <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    type="number"
                    min={100}
                    step={100}
                    className="form-input"
                    value={formData.maxCostUSD}
                    onChange={(e) => setFormData({ ...formData, maxCostUSD: parseInt(e.target.value) || 0 })}
                    style={{ paddingLeft: '2.2rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingIndex(null);
                }}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
                {saving ? 'Saving...' : editingIndex !== null ? 'Save Changes' : 'Add Procedure'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         PROCEDURES LIST CARDS
         ───────────────────────────────────────────────────────────── */}
      {procedures.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-xl)', border: '1.5px dashed var(--color-border)' }}>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            {l10n('Aucune procédure enregistrée pour cette spécialité.', 'Pankor ena tretman anrezistre pou sa spesialite-la.', 'No procedures cataloged for this specialty yet.')}
          </p>
          <button type="button" onClick={handleOpenAdd} className="btn btn-primary btn-sm">
            <Plus size={14} /> {l10n('Ajouter une Procédure', 'Azout Tretman', 'Add Procedure')}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {procedures.map((proc, index) => (
            <div
              key={proc.id || index}
              style={{
                background: 'var(--color-surface)',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                position: 'relative',
              }}
            >
              {/* Left Details */}
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
                    {l(proc, 'name')}
                  </h3>
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '0 0 0.4rem', lineHeight: 1.4 }}>
                  {l(proc, 'description')}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  <Clock size={12} color="var(--color-primary)" />
                  <span>{l10n('Durée de séjour :', 'Dirasion sejour :', 'Stay duration:')} ~{proc.estimatedDurationDays || 7} {l10n('jours', 'zour', 'days')}</span>
                </div>
              </div>

              {/* Right: Pricing & Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', textAlign: 'right' }}>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                    {formatCostRange(proc.estimatedCostUSD?.min || 0, proc.estimatedCostUSD?.max || 0)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    ~{formatCostMur(proc.estimatedCostUSD?.min || 0, proc.estimatedCostUSD?.max || 0)}
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: '0.4rem' }}
                    onClick={() => onQuoteClick && onQuoteClick(specialty.id)}
                  >
                    {l10n('Demander un Devis', 'Demann Devi', 'Get Quote')}
                  </button>
                </div>

                {/* Inline Action Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: '0.75rem', borderLeft: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      style={{
                        background: 'var(--color-surface-2)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 4,
                        padding: '2px 4px',
                        cursor: index === 0 ? 'not-allowed' : 'pointer',
                        opacity: index === 0 ? 0.3 : 1,
                      }}
                      title="Move Up"
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={index === procedures.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      style={{
                        background: 'var(--color-surface-2)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 4,
                        padding: '2px 4px',
                        cursor: index === procedures.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: index === procedures.length - 1 ? 0.3 : 1,
                      }}
                      title="Move Down"
                    >
                      <ChevronDown size={12} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(index)}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '3px 6px', fontSize: '0.7rem' }}
                      title="Edit inline"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(index)}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '3px 6px' }}
                      title="Duplicate"
                    >
                      <Copy size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmIndex(deleteConfirmIndex === index ? null : index)}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '3px 6px', color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Inline Delete Confirmation Banner (Zero Popups) */}
              {deleteConfirmIndex === index && (
                <div
                  style={{
                    width: '100%',
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 8,
                    padding: '0.6rem 0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.5rem',
                    animation: 'fadeIn 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-danger)', fontWeight: 700 }}>
                    Delete "{proc.name}" permanently?
                  </span>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmIndex(null)}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="btn btn-sm"
                      style={{ padding: '2px 8px', fontSize: '0.75rem', background: 'var(--color-danger)', color: '#fff' }}
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
