import { Trash2, Printer, Download, X, CheckSquare, Square } from 'lucide-react';

interface AdminBulkActionBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDeleteSelected?: () => void;
  onPrintPdfSelected?: () => void;
  onExportCsvSelected?: () => void;
  unitName?: string;
}

export function AdminBulkActionBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onDeleteSelected,
  onPrintPdfSelected,
  onExportCsvSelected,
  unitName = 'records',
}: AdminBulkActionBarProps) {
  if (selectedCount === 0) return null;

  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        background: 'linear-gradient(135deg, #090d10, #131b22)',
        color: '#ffffff',
        border: '1.5px solid rgba(16, 185, 129, 0.3)',
        borderRadius: 12,
        padding: '0.75rem 1.25rem',
        marginBottom: '1.25rem',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.18)',
        animation: 'adminBulkSlideIn 0.2s ease-out',
      }}
    >
      {/* Left: Selection Counter & Toggle All */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={isAllSelected ? onClearSelection : onSelectAll}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#ffffff',
            borderRadius: 6,
            padding: '4px 8px',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {isAllSelected ? <CheckSquare size={14} color="#34d399" /> : <Square size={14} />}
          {isAllSelected ? 'Deselect All' : `Select All (${totalCount})`}
        </button>

        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)' }}>
          <strong style={{ color: '#34d399', fontSize: '0.95rem' }}>{selectedCount}</strong> {unitName} selected
        </span>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {onPrintPdfSelected && (
          <button
            type="button"
            onClick={onPrintPdfSelected}
            style={{
              background: '#065f46',
              color: '#ffffff',
              border: '1px solid #059669',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              transition: 'background 0.15s ease',
            }}
            title="Print or Save as PDF"
          >
            <Printer size={14} /> Print / Export PDF
          </button>
        )}

        {onExportCsvSelected && (
          <button
            type="button"
            onClick={onExportCsvSelected}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
            title="Export as CSV spreadsheet"
          >
            <Download size={14} /> Export CSV
          </button>
        )}

        {onDeleteSelected && (
          <button
            type="button"
            onClick={onDeleteSelected}
            style={{
              background: 'rgba(239, 68, 68, 0.18)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
            title="Delete Selected Items"
          >
            <Trash2 size={14} /> Delete ({selectedCount})
          </button>
        )}

        <button
          type="button"
          onClick={onClearSelection}
          style={{
            background: 'transparent',
            color: 'rgba(255, 255, 255, 0.6)',
            border: 'none',
            borderRadius: 6,
            padding: '4px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Clear Selection"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
