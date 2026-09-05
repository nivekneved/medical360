import React from 'react';
import { Link } from 'react-router-dom';

interface PageItem {
  id: string;
  label: string;
  icon: string;
}

interface PageEditorNavSidebarProps {
  pages: PageItem[];
  activePageId: string;
}

export const PageEditorNavSidebar: React.FC<PageEditorNavSidebarProps> = ({ pages, activePageId }) => {
  return (
    <div style={{
      width: 240,
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-xl)',
      border: '1.5px solid var(--color-border)',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
      flexShrink: 0,
    }}>
      <h3 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: '0 0 0.5rem 0' }}>
        Editable Pages ({pages.length})
      </h3>
      {pages.map((p) => {
        const isActive = p.id === activePageId;
        return (
          <Link
            key={p.id}
            to={`/admin/pages/${p.id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.6rem 0.85rem',
              borderRadius: 'var(--radius-lg)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: isActive ? 700 : 500,
              background: isActive ? 'color-mix(in srgb, var(--color-primary) 10%, transparent)' : 'transparent',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
              transition: 'var(--transition-fast)',
            }}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
