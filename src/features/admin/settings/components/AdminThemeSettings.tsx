import React from 'react';
import { Palette, CheckCircle2, Sun, Moon, Sparkles, Monitor, RefreshCw, Eye } from 'lucide-react';
import { useTheme, THEME_PRESETS, type ThemeId } from '../../../../providers/ThemeProvider';

interface AdminThemeSettingsProps {
  onNotify: (msg: { text: string; isError?: boolean }) => void;
}

export const AdminThemeSettings: React.FC<AdminThemeSettingsProps> = ({ onNotify }) => {
  const { theme, currentTheme, availableThemes, isDark, setTheme, toggleTheme } = useTheme();

  const handleSelectTheme = (themeId: ThemeId, themeName: string) => {
    setTheme(themeId);
    onNotify({ text: `Active theme changed to "${themeName}". All platform colors updated.` });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Palette size={20} color="var(--color-primary)" />
            Themes, Colors & Global Branding
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0' }}>
            Select your preferred visual palette across the patient portal, public pages, and admin interface.
          </p>
        </div>

        {/* Mode Quick Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="btn btn-outline btn-sm"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 700,
            borderRadius: '999px',
            padding: '0.5rem 1.15rem',
          }}
        >
          {isDark ? <Sun size={15} color="#eab308" /> : <Moon size={15} color="#6366f1" />}
          <span>{isDark ? 'Switch to Light Palette' : 'Switch to Dark Palette'}</span>
        </button>
      </div>

      {/* Currently Active Theme Highlight Bar */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-primary)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: currentTheme.primaryColor,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <strong style={{ fontSize: '1.05rem', color: 'var(--color-text)' }}>
                {currentTheme.name}
              </strong>
              <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                ✓ Currently Active
              </span>
              {currentTheme.badge && (
                <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
                  {currentTheme.badge}
                </span>
              )}
            </div>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
              {currentTheme.description}
            </p>
          </div>
        </div>

        {/* Live Color Swatches for Current Theme */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: currentTheme.primaryColor,
              border: '2px solid var(--color-border)',
              margin: '0 auto',
            }} />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginTop: 2 }}>
              Primary
            </span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: currentTheme.accentColor,
              border: '2px solid var(--color-border)',
              margin: '0 auto',
            }} />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginTop: 2 }}>
              Accent
            </span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: currentTheme.previewBg,
              border: '2px solid var(--color-border)',
              margin: '0 auto',
            }} />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginTop: 2 }}>
              Surface
            </span>
          </div>
        </div>
      </div>

      {/* Theme Presets Grid */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text)' }}>
          Available Curated Palettes & Presets
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}>
          {availableThemes.map((preset) => {
            const isActive = theme === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectTheme(preset.id, preset.name)}
                style={{
                  background: 'var(--color-surface)',
                  border: isActive ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.35rem',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: isActive ? '0 8px 24px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--color-text)' }}>
                      {preset.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      {preset.isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
                    </span>
                  </div>

                  {isActive ? (
                    <span className="badge badge-primary" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={12} /> Active
                    </span>
                  ) : preset.badge ? (
                    <span className="badge badge-accent" style={{ fontSize: '0.72rem' }}>
                      {preset.badge}
                    </span>
                  ) : null}
                </div>

                <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.45 }}>
                  {preset.description}
                </p>

                {/* Visual Palette Preview Box */}
                <div style={{
                  background: preset.previewBg,
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}>
                  {/* Miniature UI simulation */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: preset.textColor }}>
                      Med360 Preview
                    </span>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        background: preset.primaryColor,
                        color: '#ffffff',
                      }}>
                        Primary
                      </span>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        background: preset.accentColor,
                        color: '#ffffff',
                      }}>
                        Accent
                      </span>
                    </div>
                  </div>

                  {/* Swatches strip */}
                  <div style={{ display: 'flex', height: 18, borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ flex: 2, background: preset.primaryColor }} title={`Primary: ${preset.primaryColor}`} />
                    <div style={{ flex: 1.5, background: preset.accentColor }} title={`Accent: ${preset.accentColor}`} />
                    <div style={{ flex: 1, background: preset.textColor }} title={`Text: ${preset.textColor}`} />
                    <div style={{ flex: 1.5, background: preset.previewBg, borderLeft: '1px solid rgba(0,0,0,0.1)' }} title={`Bg: ${preset.previewBg}`} />
                  </div>
                </div>

                {/* Selection button */}
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTheme(preset.id, preset.name);
                    }}
                    className={isActive ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                    style={{ width: '100%', fontWeight: 700 }}
                  >
                    {isActive ? '✓ Selected as Active Theme' : `Activate ${preset.shortName}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
