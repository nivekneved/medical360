import React from 'react';
import { Sparkles, Clock, DollarSign } from 'lucide-react';
import { Honeypot } from '../../../components/Honeypot/Honeypot';

export interface ProcedureFormData {
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

interface ProcedureFormCardProps {
  formData: ProcedureFormData;
  setFormData: (data: ProcedureFormData) => void;
  fieldErrors: Record<string, string>;
  setFieldErrors: (errors: Record<string, string>) => void;
  honeypot: string;
  setHoneypot: (val: string) => void;
  activeLangTab: 'en' | 'fr' | 'kr';
  setActiveLangTab: (tab: 'en' | 'fr' | 'kr') => void;
  isEditing: boolean;
  editingIndex: number | null;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const ProcedureFormCard: React.FC<ProcedureFormCardProps> = ({
  formData,
  setFormData,
  fieldErrors,
  setFieldErrors,
  honeypot,
  setHoneypot,
  activeLangTab,
  setActiveLangTab,
  editingIndex,
  saving,
  onSubmit,
  onCancel,
}) => {
  return (
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

      <form onSubmit={onSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            onClick={onCancel}
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
  );
};
