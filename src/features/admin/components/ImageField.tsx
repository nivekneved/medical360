import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Check, Sparkles, X } from 'lucide-react';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  helpText?: string;
  category?: string;
}

const PRESET_GALLERY = [
  { label: 'Hospital Building (Modern)', url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&q=80' },
  { label: 'Medical Center / Clinic', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80' },
  { label: 'Modern Operating Theatre', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80' },
  { label: 'Male Chief Surgeon', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80' },
  { label: 'Senior Male Doctor', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&q=80' },
  { label: 'Senior Female Doctor', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80' },
  { label: 'Female Oncologist', url: 'https://images.unsplash.com/photo-1594824813589-3253b27cf17b?w=800&q=80' },
  { label: 'Heart & Cardiology Care', url: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&q=80' },
  { label: 'Cancer & Oncology Care', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80' },
  { label: 'Orthopedics & Joint Care', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80' },
  { label: 'Neurosurgery & Spine', url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&q=80' },
  { label: 'IVF & Fertility Care', url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80' },
  { label: 'Patient Story (Recovery)', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80' },
  { label: 'Patient Story (Senior Male)', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80' },
];

export function ImageField({ label, value, onChange, required, helpText }: ImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showGallery, setShowGallery] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label className="form-label" style={{ fontWeight: 700, fontSize: '0.9rem' }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>

      {/* Image Preview & Selection Controls */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.02)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1rem',
      }}>
        {/* Thumbnail Preview */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          {value ? (
            <img
              src={value}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                // If broken link, show fallback icon
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <ImageIcon size={32} style={{ color: 'var(--color-text-muted)', opacity: 0.5 }} />
          )}
        </div>

        {/* Buttons */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => fileInputRef.current?.click()}
              id={`select-image-btn-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            >
              <Upload size={14} /> Select Image
            </button>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setShowGallery(true)}
            >
              <Sparkles size={14} /> Choose from Presets
            </button>
          </div>

          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Upload from device or choose a curated medical preset.
          </span>
        </div>
      </div>

      {/* Image URL text input below button */}
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
          Image URL
        </label>
        <input
          type="text"
          className="form-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg or data:image/..."
          required={required}
          style={{ width: '100%', fontSize: '0.85rem' }}
        />
        {helpText && (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem', display: 'block' }}>
            {helpText}
          </span>
        )}
      </div>

      {/* Preset Gallery Inline Panel (NO POPUPS) */}
      {showGallery && (
        <div style={{
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-primary)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)',
          marginTop: '0.75rem',
          animation: 'fadeIn 0.2s ease-out',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>Choose Curated Medical Preset Image</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Click any medical asset to select it directly
              </span>
            </div>
            <button
              type="button"
              className="btn btn-icon btn-outline btn-sm"
              onClick={() => setShowGallery(false)}
            >
              <X size={15} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.65rem' }}>
            {PRESET_GALLERY.map((preset, idx) => {
              const isSelected = value === preset.url;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    onChange(preset.url);
                    setShowGallery(false);
                  }}
                  style={{
                    cursor: 'pointer',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    position: 'relative',
                    background: 'var(--color-surface-2)',
                    transition: 'transform 0.15s, border-color 0.15s',
                  }}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    style={{ width: '100%', height: 80, objectFit: 'cover' }}
                  />
                  <div style={{ padding: '0.35rem 0.45rem', fontSize: '0.72rem', fontWeight: 600 }}>
                    {preset.label}
                  </div>
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      background: 'var(--color-primary)',
                      color: 'white',
                      borderRadius: '50%',
                      width: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Check size={11} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
