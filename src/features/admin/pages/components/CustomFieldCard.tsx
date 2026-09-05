import React from 'react';
import { Sparkles, Type, FileText, Image as ImageIcon } from 'lucide-react';

interface CustomFieldCardProps {
  newFieldKey: string;
  onFieldKeyChange: (val: string) => void;
  newFieldType: 'text' | 'multiline' | 'image';
  onFieldTypeChange: (val: 'text' | 'multiline' | 'image') => void;
  newFieldValFr: string;
  onFieldValFrChange: (val: string) => void;
  newFieldValEn: string;
  onFieldValEnChange: (val: string) => void;
  newFieldValKr: string;
  onFieldValKrChange: (val: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const CustomFieldCard: React.FC<CustomFieldCardProps> = ({
  newFieldKey,
  onFieldKeyChange,
  newFieldType,
  onFieldTypeChange,
  newFieldValFr,
  onFieldValFrChange,
  newFieldValEn,
  onFieldValEnChange,
  newFieldValKr,
  onFieldValKrChange,
  onSave,
  onCancel,
}) => {
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '2px solid var(--color-primary)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      animation: 'fadeIn 0.2s ease',
      boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
        <Sparkles size={18} color="var(--color-primary)" />
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
          Create Custom Dynamic CMS Field
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
              Field Key (camelCase identifier) *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. heroBannerTitle"
              value={newFieldKey}
              onChange={e => onFieldKeyChange(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
              Field Type
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${newFieldType === 'text' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => onFieldTypeChange('text')}
                style={{ flex: 1 }}
              >
                <Type size={14} /> Text
              </button>
              <button
                type="button"
                className={`btn btn-sm ${newFieldType === 'multiline' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => onFieldTypeChange('multiline')}
                style={{ flex: 1 }}
              >
                <FileText size={14} /> Paragraph
              </button>
              <button
                type="button"
                className={`btn btn-sm ${newFieldType === 'image' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => onFieldTypeChange('image')}
                style={{ flex: 1 }}
              >
                <ImageIcon size={14} /> Image
              </button>
            </div>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
            Default Content (French / Français) *
          </label>
          {newFieldType === 'multiline' ? (
            <textarea
              className="form-input"
              rows={2}
              value={newFieldValFr}
              onChange={e => onFieldValFrChange(e.target.value)}
            />
          ) : (
            <input
              type="text"
              className="form-input"
              value={newFieldValFr}
              onChange={e => onFieldValFrChange(e.target.value)}
            />
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
              English Translation
            </label>
            <input
              type="text"
              className="form-input"
              value={newFieldValEn}
              onChange={e => onFieldValEnChange(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
              Kreol Morisien Translation
            </label>
            <input
              type="text"
              className="form-input"
              value={newFieldValKr}
              onChange={e => onFieldValKrChange(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline btn-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="btn btn-primary btn-sm"
            style={{ fontWeight: 700 }}
          >
            Add Field to Page
          </button>
        </div>
      </div>
    </div>
  );
};
