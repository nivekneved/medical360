import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  pageSizeOptions?: number[];
  unitName?: string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [6, 12, 24],
  unitName,
  className = '',
}: PaginationProps) {
  const { i18n } = useTranslation();
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';
  const defaultUnit = isFr ? 'éléments' : isKr ? 'eleman' : 'items';
  const displayUnit = unitName || defaultUnit;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  if (totalItems <= 0) return null;

  return (
    <div
      className={`pagination-bar ${className}`}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginTop: '2.5rem',
        padding: '1.25rem 0 0.5rem',
        borderTop: '1px solid var(--color-border)',
        width: '100%',
      }}
    >
      {/* Left: Range and Page Size */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          {isFr ? 'Affichage de ' : isKr ? 'Pe montre ' : 'Showing '}
          <strong>{startItem}</strong>–<strong>{endItem}</strong> {isFr ? 'sur ' : isKr ? 'lor ' : 'of '}
          <strong>{totalItems}</strong> {displayUnit}
        </span>

        {onItemsPerPageChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              {isFr ? 'Par page :' : isKr ? 'Par paz :' : 'Per page:'}
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                onItemsPerPageChange(Number(e.target.value));
                onPageChange(1);
              }}
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Navigation Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        {/* First */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(1)}
          style={{
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: currentPage <= 1 ? 'var(--color-text-muted)' : 'var(--color-text)',
            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage <= 1 ? 0.4 : 1,
            transition: 'all 0.15s ease',
          }}
          title={isFr ? 'Première page' : 'First page'}
          aria-label="First page"
        >
          <ChevronsLeft size={15} />
        </button>

        {/* Prev */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          style={{
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: currentPage <= 1 ? 'var(--color-text-muted)' : 'var(--color-text)',
            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage <= 1 ? 0.4 : 1,
            transition: 'all 0.15s ease',
          }}
          title={isFr ? 'Page précédente' : 'Previous page'}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>

        {/* Numbered Buttons */}
        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`dots-${idx}`} style={{ padding: '0 4px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                …
              </span>
            );
          }
          const isCurrent = p === currentPage;
          return (
            <button
              key={`pg-${p}`}
              type="button"
              onClick={() => onPageChange(Number(p))}
              style={{
                minWidth: 34,
                height: 34,
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-sm)',
                border: isCurrent ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                background: isCurrent ? 'var(--color-primary)' : 'var(--color-surface)',
                color: isCurrent ? '#ffffff' : 'var(--color-text)',
                fontWeight: isCurrent ? 800 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isCurrent ? '0 2px 8px color-mix(in srgb, var(--color-primary) 35%, transparent)' : 'none',
              }}
            >
              {p}
            </button>
          );
        })}

        {/* Next */}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          style={{
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: currentPage >= totalPages ? 'var(--color-text-muted)' : 'var(--color-text)',
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage >= totalPages ? 0.4 : 1,
            transition: 'all 0.15s ease',
          }}
          title={isFr ? 'Page suivante' : 'Next page'}
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>

        {/* Last */}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(totalPages)}
          style={{
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: currentPage >= totalPages ? 'var(--color-text-muted)' : 'var(--color-text)',
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage >= totalPages ? 0.4 : 1,
            transition: 'all 0.15s ease',
          }}
          title={isFr ? 'Dernière page' : 'Last page'}
          aria-label="Last page"
        >
          <ChevronsRight size={15} />
        </button>
      </div>
    </div>
  );
}
