import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';

export interface EntityMultiSelectorProps<T extends { id: string }> {
  items: T[];
  selectedIds: string[];
  onChange: (newIds: string[]) => void;
  label: string;
  getPrimaryText: (item: T) => string;
  getSecondaryText?: (item: T) => string | undefined;
  getImageUrl?: (item: T) => string | undefined;
  getIcon?: (item: T) => React.ReactNode;
  searchPlaceholder?: string;
  filterPredicate?: (item: T, query: string) => boolean;
  themeColor?: string;
  themeBackground?: string;
  badgeBackground?: string;
  badgeTextColor?: string;
  extraFilterSlot?: React.ReactNode;
  disabled?: boolean;
}

export function EntityMultiSelector<T extends { id: string }>({
  items,
  selectedIds = [],
  onChange,
  label,
  getPrimaryText,
  getSecondaryText,
  getImageUrl,
  getIcon,
  searchPlaceholder = 'Search items...',
  filterPredicate,
  themeColor = 'var(--color-primary)',
  themeBackground = 'rgba(16, 185, 129, 0.08)',
  badgeBackground = 'rgba(16, 185, 129, 0.12)',
  badgeTextColor = 'var(--color-primary)',
  extraFilterSlot,
  disabled = false,
}: EntityMultiSelectorProps<T>) {
  const [search, setSearch] = useState('');

  const toggleItem = (id: string) => {
    if (disabled) return;
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    if (disabled) return;
    onChange(items.map((item) => item.id));
  };

  const clearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    if (filterPredicate) {
      return items.filter((item) => filterPredicate(item, q));
    }
    return items.filter((item) => {
      const primary = getPrimaryText(item).toLowerCase();
      const secondary = (getSecondaryText ? getSecondaryText(item) : '')?.toLowerCase() || '';
      return primary.includes(q) || secondary.includes(q) || item.id.toLowerCase().includes(q);
    });
  }, [items, search, filterPredicate, getPrimaryText, getSecondaryText]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', margin: 0 }}>
          {label} ({selectedIds.length}/{items.length} selected)
        </label>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            type="button"
            onClick={selectAll}
            disabled={disabled}
            className="btn btn-outline btn-xs"
            style={{ fontSize: '0.72rem', padding: '2px 8px' }}
          >
            Select All
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={disabled}
            className="btn btn-outline btn-xs"
            style={{ fontSize: '0.72rem', padding: '2px 8px' }}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Search Input and Optional Custom Filter Slot */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
            }}
          />
          <input
            type="text"
            className="form-input"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={disabled}
            style={{ width: '100%', paddingLeft: 30, fontSize: '0.82rem', height: 34 }}
          />
        </div>
        {extraFilterSlot}
      </div>

      {/* Selected Pills */}
      {selectedIds.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem' }}>
          {selectedIds.map((id) => {
            const item = items.find((i) => i.id === id);
            return (
              <span
                key={id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 8px',
                  borderRadius: 999,
                  background: badgeBackground,
                  color: badgeTextColor,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: `1px solid ${themeColor}40`,
                }}
              >
                {item ? getPrimaryText(item) : id}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => toggleItem(id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'inherit',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <X size={12} />
                  </button>
                )}
              </span>
            );
          })}
        </div>
      )}

      {/* Checkbox Grid */}
      <div
        style={{
          maxHeight: 220,
          overflowY: 'auto',
          border: '1.5px solid var(--color-border)',
          borderRadius: 8,
          background: 'var(--color-surface-2)',
          padding: '0.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '0.4rem',
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            No matching items found
          </div>
        ) : (
          filtered.map((item) => {
            const isChecked = selectedIds.includes(item.id);
            const imgUrl = getImageUrl ? getImageUrl(item) : undefined;
            const icon = getIcon ? getIcon(item) : null;
            const primary = getPrimaryText(item);
            const secondary = getSecondaryText ? getSecondaryText(item) : undefined;

            return (
              <label
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '6px 8px',
                  borderRadius: 6,
                  background: isChecked ? themeBackground : 'var(--color-surface)',
                  border: isChecked ? `1px solid ${themeColor}` : '1px solid var(--color-border)',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleItem(item.id)}
                  disabled={disabled}
                  style={{ width: 16, height: 16, accentColor: themeColor, cursor: 'pointer' }}
                />
                {imgUrl && (
                  <img
                    src={imgUrl}
                    alt={primary}
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                {icon && !imgUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-muted)' }}>
                    {icon}
                  </div>
                )}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {primary}
                  </div>
                  {secondary && (
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {secondary}
                    </div>
                  )}
                </div>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}
