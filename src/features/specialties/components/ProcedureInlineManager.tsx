import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle2,
  Copy,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { formatCostRange, formatCostMur } from '../../../core/services/format.service';
import { isHoneypotClean, detectSqlInjection, sanitizeInput } from '../../../core/services/validation.service';
import { ProcedureFormCard, type ProcedureFormData } from './ProcedureFormCard';
import type { Specialty, Procedure } from '../../../core/types';

interface ProcedureInlineManagerProps {
  specialty: Specialty;
  onSaved?: (updatedSpecialty: Specialty) => void;
  l10n: (fr: string, kr: string, en: string) => string;
  l: (obj: any, field: string) => string;
  onQuoteClick?: (specialtyId: string) => void;
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

      {/* Inline Form (Zero Popups) */}
      {isEditing && (
        <ProcedureFormCard
          formData={formData}
          setFormData={setFormData}
          fieldErrors={fieldErrors}
          setFieldErrors={setFieldErrors}
          honeypot={honeypot}
          setHoneypot={setHoneypot}
          activeLangTab={activeLangTab}
          setActiveLangTab={setActiveLangTab}
          isEditing={isEditing}
          editingIndex={editingIndex}
          saving={saving}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsEditing(false);
            setEditingIndex(null);
          }}
        />
      )}

      {/* Procedures List */}
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

                {/* Action Bar */}
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

              {/* Delete Banner */}
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
