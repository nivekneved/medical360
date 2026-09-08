import React from 'react';

export interface PageLoaderProps {
  message?: string;
  minHeight?: string | number;
}

export function PageLoader({ message, minHeight = '60vh' }: PageLoaderProps) {
  return (
    <div
      style={{
        minHeight,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        color: 'var(--color-primary, #065f46)',
        fontSize: '0.9rem',
        fontWeight: 600,
      }}
      role="status"
      aria-label="Loading content"
    >
      <div
        style={{
          width: 36,
          height: 36,
          border: '3.5px solid rgba(6, 95, 70, 0.15)',
          borderTopColor: 'var(--color-primary, #065f46)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {message && <div style={{ color: 'var(--color-text-secondary, #475569)' }}>{message}</div>}
    </div>
  );
}

export function InlineSpinner({ size = 20, color }: { size?: number; color?: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `2px solid ${color ? `${color}33` : 'rgba(255, 255, 255, 0.25)'}`,
        borderTopColor: color || '#ffffff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        display: 'inline-block',
      }}
    />
  );
}
