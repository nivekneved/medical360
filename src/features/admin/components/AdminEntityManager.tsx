import { useState, useMemo, type ReactNode, type FormEvent } from 'react';
import {
  LayoutGrid,
  List,
  Search,
  ArrowUpDown,
  Plus,
  Printer,
  Download,
  Edit3,
  X,
  CheckCircle2,
  Save,
  RotateCcw,
} from 'lucide-react';
import { ImageField } from './ImageField';
import { RichTextEditor } from './RichTextEditor';
import { AdminPagination } from './AdminPagination';
import { AdminBulkActionBar } from './AdminBulkActionBar';
import { Honeypot } from '../../../components/Honeypot/Honeypot';
import { isHoneypotClean, detectSqlInjection, deepSanitize } from '../../../core/services/validation.service';
import { printOrExportPdf, exportToCsv, type ExportColumn } from '../../../core/services/export.service';
import '../AdminToolbar.css';

export interface FieldDefinition<T> {
  key: keyof T & string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'image' | 'array' | 'select';
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  help?: string;
  isMultilingual?: boolean;
}

export interface SortOption<T> {
  value: string;
  label: string;
  comparator: (a: T, b: T) => number;
}

export interface FilterDefinition<T> {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  predicate: (item: T, selectedValue: string) => boolean;
}

export interface AdminEntityManagerProps<T extends { id: string }> {
  title: string;
  subtitle: string;
  entityName: string;
  items: T[];
  loading?: boolean;
  fields: FieldDefinition<T>[];
  exportColumns: ExportColumn[];
  sortOptions: SortOption<T>[];
  filterDefinitions?: FilterDefinition<T>[];
  searchPredicate: (item: T, query: string) => boolean;
  renderCard: (item: T, onEdit: () => void, onView: () => void, isSelected: boolean, onToggleSelect: () => void) => ReactNode;
  renderTableColumns: string[];
  renderTableRow: (item: T, onEdit: () => void, onView: () => void, isSelected: boolean, onToggleSelect: () => void) => ReactNode;
  renderViewModalContent?: (item: T) => ReactNode;
  renderCustomField?: (key: string, value: any, onChange: (v: any) => void, item: T) => ReactNode | null;
  headerActions?: ReactNode;
  onSave: (item: T, isNew: boolean) => Promise<void>;
  onDelete: (ids: string[]) => Promise<void>;
  getInitialItem: () => T;
}

export function AdminEntityManager<T extends { id: string }>({
  title,
  subtitle,
  entityName,
  items,
  loading = false,
  fields,
  exportColumns,
  sortOptions,
  filterDefinitions = [],
  searchPredicate,
  renderCard,
  renderTableColumns,
  renderTableRow,
  renderViewModalContent,
  renderCustomField,
  headerActions,
  onSave,
  onDelete,
  getInitialItem,
}: AdminEntityManagerProps<T>) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState<string>(sortOptions[0]?.value || '');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    filterDefinitions.forEach(f => { init[f.key] = 'all'; });
    return init;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [viewingItem, setViewingItem] = useState<T | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [modalFieldErrors, setModalFieldErrors] = useState<Record<string, string>>({});

  // Filter & Sort Logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. Search Query
      if (searchQuery.trim() && !searchPredicate(item, searchQuery.trim())) {
        return false;
      }
      // 2. Custom Filters
      for (const filter of filterDefinitions) {
        const selected = activeFilters[filter.key];
        if (selected && selected !== 'all' && !filter.predicate(item, selected)) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const sorter = sortOptions.find(s => s.value === activeSort);
      return sorter ? sorter.comparator(a, b) : 0;
    });
  }, [items, searchQuery, activeFilters, activeSort, searchPredicate, filterDefinitions, sortOptions]);

  // Pagination
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  // Selection
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(filteredItems.map(i => i.id)));
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  // Bulk Actions
  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    const confirmMsg = `Are you sure you want to delete ${selectedIds.size} ${entityName}(s)? This action cannot be undone.`;
    if (!window.confirm(confirmMsg)) return;

    await onDelete(Array.from(selectedIds));
    handleClearSelection();
  };

  const handleExportCsv = () => {
    const exportData = selectedIds.size > 0
      ? filteredItems.filter(i => selectedIds.has(i.id))
      : filteredItems;
    exportToCsv(`${entityName.toLowerCase()}_export.csv`, exportColumns, exportData);
  };

  const handlePrintPdf = () => {
    const exportData = selectedIds.size > 0
      ? filteredItems.filter(i => selectedIds.has(i.id))
      : filteredItems;
    printOrExportPdf(title, exportColumns, exportData, subtitle);
  };

  // Form Save with Validation & Honeypot
  const handleFormSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    // 1. Honeypot check
    if (!isHoneypotClean(honeypot)) {
      console.warn('🛡️ Security: Admin form honeypot triggered. Bot discarded.');
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setEditingItem(null);
      }, 500);
      return;
    }

    // 2. Validate required fields & SQL injection security
    const errors: Record<string, string> = {};
    for (const f of fields) {
      const val = (editingItem as any)[f.key];
      if (f.required) {
        if (val === undefined || val === null || val === '') {
          errors[f.key] = `${f.label} is required.`;
        } else if (Array.isArray(val) && val.length === 0) {
          errors[f.key] = `Please select or add at least one ${f.label.toLowerCase()}.`;
        } else if (f.type === 'number' && isNaN(Number(val))) {
          errors[f.key] = `${f.label} must be a valid number.`;
        }
      }
      // Check SQL injection on textual fields
      if (typeof val === 'string' && detectSqlInjection(val)) {
        errors[f.key] = `${f.label} contains invalid or prohibited database query characters.`;
      }
    }

    setModalFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      const cleanItem = deepSanitize(editingItem);
      await onSave(cleanItem, isNewItem);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setEditingItem(null);
        setModalFieldErrors({});
      }, 700);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save. Please check required fields.');
    } finally {
      setSaving(false);
    }
  };

  const openNewItemModal = () => {
    setIsNewItem(true);
    setEditingItem(getInitialItem());
    setModalFieldErrors({});
    setHoneypot('');
  };

  const openEditModal = (item: T) => {
    setIsNewItem(false);
    setEditingItem({ ...item });
    setModalFieldErrors({});
    setHoneypot('');
  };

  const updateItemField = (key: string, value: any) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [key]: value });
    if (modalFieldErrors[key]) {
      setModalFieldErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1400, margin: '0 auto' }}>
        {/* ── List Mode Controls (Only visible when not editing/viewing) ── */}
      {!editingItem && !viewingItem && (
        <>
          {/* ── Header ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem' }}>
                {title}
              </h1>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                {subtitle} · <strong style={{ color: 'var(--color-primary)' }}>{filteredItems.length}</strong> {entityName}(s)
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {headerActions}
              <button onClick={handlePrintPdf} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Printer size={14} /> Print / PDF
              </button>
              <button onClick={handleExportCsv} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Download size={14} /> Export CSV
              </button>
              <button onClick={openNewItemModal} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Plus size={15} /> Add {entityName}
              </button>
            </div>
          </div>

          {/* ── Toolbar ── */}
          <div className="admin-toolbar">
            {/* Search */}
            <div className="admin-toolbar__search">
              <Search size={16} className="admin-toolbar__search-icon" />
              <input
                type="text"
                className="admin-toolbar__search-input"
                placeholder={`Search ${entityName}s by name, details, tags…`}
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>

            {/* Custom Filters */}
            {filterDefinitions.map(filter => (
              <div key={filter.key} className="admin-toolbar__filter-pill">
                <select
                  className="admin-toolbar__filter-select"
                  value={activeFilters[filter.key] || 'all'}
                  onChange={e => {
                    setActiveFilters(prev => ({ ...prev, [filter.key]: e.target.value }));
                    setCurrentPage(1);
                  }}
                >
                  {filter.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            ))}

            {/* Clear Filters */}
            {(searchQuery || Object.values(activeFilters).some(v => v !== 'all')) && (
              <button
                type="button"
                className="admin-toolbar__clear-btn"
                onClick={() => {
                  setSearchQuery('');
                  const resetFilters: Record<string, string> = {};
                  filterDefinitions.forEach(f => { resetFilters[f.key] = 'all'; });
                  setActiveFilters(resetFilters);
                  setCurrentPage(1);
                }}
              >
                <RotateCcw size={13} /> Clear
              </button>
            )}

            {/* Sort */}
            <div className="admin-toolbar__sort">
              <ArrowUpDown size={15} className="admin-toolbar__sort-icon" />
              <select
                className="admin-toolbar__sort-select"
                value={activeSort}
                onChange={e => setActiveSort(e.target.value)}
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="admin-toolbar__view-switcher">
              <button
                type="button"
                className={`admin-toolbar__view-btn ${viewMode === 'grid' ? 'admin-toolbar__view-btn--active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                className={`admin-toolbar__view-btn ${viewMode === 'list' ? 'admin-toolbar__view-btn--active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* ── Bulk Actions Floating Bar ── */}
          <AdminBulkActionBar
            selectedCount={selectedIds.size}
            totalCount={filteredItems.length}
            unitName={entityName.toLowerCase()}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            onDeleteSelected={handleDeleteSelected}
          />
        </>
      )}

      {/* ── Content View ── */}
      {editingItem ? (
        /* ── FULL PAGE EDITOR VIEW (NO POPUPS) ── */
        <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
          {/* Top Sticky Action Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-surface)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--color-border)',
            marginBottom: '1.5rem',
            gap: '1rem',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="btn btn-outline btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
              >
                <RotateCcw size={15} /> Back to {entityName}s
              </button>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
                  {isNewItem ? `Create New ${entityName}` : `Edit ${entityName}`}
                </h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {isNewItem ? `Fill out the details below to add a new ${entityName.toLowerCase()}` : `Updating ID: ${editingItem.id}`}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => handleFormSave(e as any)}
                disabled={saving}
                className="btn btn-primary btn-sm"
                style={{ minWidth: 140, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {saving ? 'Saving…' : savedSuccess ? (
                  <>
                    <CheckCircle2 size={16} /> Saved!
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save {entityName}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Full Page Form Card */}
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--color-border)',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}>
            <form onSubmit={handleFormSave} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Anti-Bot Honeypot */}
              <Honeypot value={honeypot} onChange={setHoneypot} id="admin_edit_page_hp" name="admin_edit_page_hp" />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {fields.map(f => {
                  const val = (editingItem as any)[f.key];
                  const hasError = !!modalFieldErrors[f.key];

                  if (renderCustomField) {
                    const custom = renderCustomField(f.key, val, (newVal) => updateItemField(f.key, newVal), editingItem);
                    if (custom) {
                      return (
                        <div key={f.key} style={{ gridColumn: f.type === 'textarea' || f.type === 'image' ? '1 / -1' : undefined }}>
                          {custom}
                          {hasError && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 4, display: 'block', fontWeight: 600 }}>{modalFieldErrors[f.key]}</span>}
                        </div>
                      );
                    }
                  }

                  const isWide = f.type === 'textarea' || f.type === 'image' || f.type === 'array';

                  return (
                    <div key={f.key} style={{ gridColumn: isWide ? '1 / -1' : undefined }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.4rem' }}>
                        {f.label} {f.required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
                      </label>

                      {f.type === 'image' ? (
                        <ImageField
                          value={val || ''}
                          onChange={(newUrl) => updateItemField(f.key, newUrl)}
                          label={f.label}
                        />
                      ) : f.type === 'textarea' ? (
                        <RichTextEditor
                          value={val || ''}
                          onChange={(newVal) => updateItemField(f.key, newVal)}
                          placeholder={f.placeholder || `Enter ${f.label.toLowerCase()}...`}
                          minHeight={150}
                        />
                      ) : f.type === 'number' ? (
                        <input
                          type="number"
                          className="form-input"
                          value={val !== undefined ? val : ''}
                          onChange={e => updateItemField(f.key, Number(e.target.value))}
                          placeholder={f.placeholder}
                          style={{ width: '100%', fontSize: '0.9rem', borderColor: hasError ? '#ef4444' : undefined }}
                        />
                      ) : f.type === 'boolean' ? (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem', padding: '0.75rem 1rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                          <input
                            type="checkbox"
                            checked={!!val}
                            onChange={e => updateItemField(f.key, e.target.checked)}
                            style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }}
                          />
                          <span style={{ fontWeight: 600 }}>Enable / Activate {f.label}</span>
                        </label>
                      ) : f.type === 'select' && f.options ? (
                        <select
                          className="form-input"
                          value={val || ''}
                          onChange={e => updateItemField(f.key, e.target.value)}
                          style={{ width: '100%', fontSize: '0.9rem', borderColor: hasError ? '#ef4444' : undefined }}
                        >
                          {f.options.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      ) : f.type === 'array' ? (
                        <div>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Comma-separated items (e.g. Item 1, Item 2)"
                            value={Array.isArray(val) ? val.join(', ') : ''}
                            onChange={e => updateItemField(f.key, e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                            style={{ width: '100%', fontSize: '0.9rem', borderColor: hasError ? '#ef4444' : undefined }}
                          />
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4, display: 'block' }}>Separate multiple items with commas</span>
                        </div>
                      ) : (
                        <input
                          type="text"
                          className="form-input"
                          value={val || ''}
                          onChange={e => updateItemField(f.key, e.target.value)}
                          placeholder={f.placeholder}
                          style={{ width: '100%', fontSize: '0.9rem', borderColor: hasError ? '#ef4444' : undefined }}
                        />
                      )}
                      {hasError && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 4, display: 'block', fontWeight: 600 }}>{modalFieldErrors[f.key]}</span>}
                      {f.help && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4 }}>{f.help}</div>}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Submit Action Bar */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditingItem(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ minWidth: 150 }}>
                  {saving ? 'Saving…' : savedSuccess ? (
                    <>
                      <CheckCircle2 size={16} /> Saved!
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Save {entityName}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : viewingItem ? (
        /* ── FULL PAGE DETAIL VIEW (NO POPUPS) ── */
        <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
          {/* Top Action Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-surface)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--color-border)',
            marginBottom: '1.5rem',
            gap: '1rem',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="btn btn-outline btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
              >
                <RotateCcw size={15} /> Back to {entityName}s List
              </button>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
                  {entityName} Full Details
                </h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>ID: {viewingItem.id}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => { const item = viewingItem; setViewingItem(null); openEditModal(item); }}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Edit3 size={15} /> Edit {entityName}
              </button>
              <button onClick={() => setViewingItem(null)} className="btn btn-outline btn-sm">
                Close
              </button>
            </div>
          </div>

          {/* Full Page Content Body */}
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--color-border)',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}>
            {renderViewModalContent ? renderViewModalContent(viewingItem) : (
              <pre style={{ fontSize: '0.85rem', background: 'var(--color-surface-2)', padding: '1.25rem', borderRadius: 8, overflow: 'auto' }}>
                {JSON.stringify(viewingItem, null, 2)}
              </pre>
            )}
          </div>
        </div>
      ) : loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 260, borderRadius: 'var(--radius-xl)' }} />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1.5px dashed var(--color-border)', marginTop: '1.5rem' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', margin: '0 0 1rem' }}>
            No {entityName.toLowerCase()}s found matching your criteria.
          </p>
          <button onClick={openNewItemModal} className="btn btn-primary btn-sm">
            <Plus size={15} /> Create First {entityName}
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          {paginatedItems.map(item =>
            renderCard(
              item,
              () => openEditModal(item),
              () => setViewingItem(item),
              selectedIds.has(item.id),
              () => toggleSelect(item.id)
            )
          )}
        </div>
      ) : (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--color-border)', overflow: 'hidden', marginTop: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ width: 44, padding: '0.875rem 0.75rem', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.size > 0 && selectedIds.size === filteredItems.length}
                    onChange={(e) => { e.target.checked ? handleSelectAll() : handleClearSelection(); }}
                    style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                  />
                </th>
                {renderTableColumns.map(col => (
                  <th key={col} style={{ padding: '0.875rem 0.85rem', fontWeight: 700, color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map(item =>
                renderTableRow(
                  item,
                  () => openEditModal(item),
                  () => setViewingItem(item),
                  selectedIds.has(item.id),
                  () => toggleSelect(item.id)
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination (Only in table/grid list mode) ── */}
      {!editingItem && !viewingItem && filteredItems.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalItems={filteredItems.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          pageSizeOptions={[6, 12, 24, 48]}
          unitName={`${entityName.toLowerCase()}s`}
        />
      )}

    </div>
  );
}
