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
import { AdminPagination } from './AdminPagination';
import { AdminBulkActionBar } from './AdminBulkActionBar';
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

  // Form Save
  const handleFormSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);
    try {
      await onSave(editingItem, isNewItem);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setEditingItem(null);
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
  };

  const openEditModal = (item: T) => {
    setIsNewItem(false);
    setEditingItem({ ...item });
  };

  const updateItemField = (key: string, value: any) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [key]: value });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1400, margin: '0 auto' }}>
      
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

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>

        {/* Dynamic Filters */}
        {filterDefinitions.map(f => (
          <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>{f.label}:</span>
            <select
              className="admin-toolbar__select"
              value={activeFilters[f.key] || 'all'}
              onChange={(e) => {
                setActiveFilters(prev => ({ ...prev, [f.key]: e.target.value }));
                setCurrentPage(1);
              }}
            >
              {f.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        ))}

        {/* Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowUpDown size={14} color="var(--color-text-muted)" />
          <select
            className="admin-toolbar__select"
            value={activeSort}
            onChange={(e) => { setActiveSort(e.target.value); setCurrentPage(1); }}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* View Mode */}
        <div className="admin-toolbar__views">
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
            title="Table List View"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* ── Bulk Action Bar ── */}
      <AdminBulkActionBar
        selectedCount={selectedIds.size}
        totalCount={filteredItems.length}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        onDeleteSelected={handleDeleteSelected}
        onPrintPdfSelected={handlePrintPdf}
        onExportCsvSelected={handleExportCsv}
        unitName={entityName.toLowerCase() + 's'}
      />

      {/* ── Content View ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
          Loading {entityName}s…
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1.5px dashed var(--color-border)' }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text)' }}>No {entityName}s found</p>
          <p style={{ margin: '0.5rem 0 1.25rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Try clearing filters or search query.</p>
          <button onClick={() => { setSearchQuery(''); setActiveFilters({}); }} className="btn btn-outline btn-sm">
            <RotateCcw size={14} /> Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {paginatedItems.map(item => renderCard(
            item,
            () => openEditModal(item),
            () => setViewingItem(item),
            selectedIds.has(item.id),
            () => toggleSelect(item.id)
          ))}
        </div>
      ) : (
        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'auto', marginBottom: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-2)' }}>
                <th style={{ width: 44, padding: '0.875rem 0.75rem', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={filteredItems.length > 0 && selectedIds.size === filteredItems.length}
                    onChange={selectedIds.size === filteredItems.length ? handleClearSelection : handleSelectAll}
                    style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                  />
                </th>
                {renderTableColumns.map((col, idx) => (
                  <th key={col} style={{ padding: '0.875rem 0.85rem', textAlign: idx === renderTableColumns.length - 1 ? 'right' : 'left', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item) => renderTableRow(
                item,
                () => openEditModal(item),
                () => setViewingItem(item),
                selectedIds.has(item.id),
                () => toggleSelect(item.id)
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ── */}
      {filteredItems.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalItems={filteredItems.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(num) => { setItemsPerPage(num); setCurrentPage(1); }}
          pageSizeOptions={[6, 12, 24, 48]}
          unitName={entityName.toLowerCase() + 's'}
        />
      )}

      {/* ── Edit / Add Modal ── */}
      {editingItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', maxWidth: 720, width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1.5px solid var(--color-border)', boxShadow: '0 24px 48px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, background: 'var(--color-surface)', zIndex: 10 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                  {isNewItem ? `Add New ${entityName}` : `Edit ${entityName}`}
                </h3>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>ID: {editingItem.id}</p>
              </div>
              <button onClick={() => setEditingItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSave} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {fields.map(f => {
                const val = (editingItem as any)[f.key];
                return (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
                      {f.label} {f.required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
                    </label>

                    {f.type === 'image' ? (
                      <ImageField
                        value={val || ''}
                        onChange={(newUrl) => updateItemField(f.key, newUrl)}
                        label={f.label}
                      />
                    ) : f.type === 'textarea' ? (
                      <textarea
                        className="form-input"
                        rows={3}
                        value={val || ''}
                        onChange={e => updateItemField(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        required={f.required}
                        style={{ width: '100%', fontSize: '0.875rem' }}
                      />
                    ) : f.type === 'number' ? (
                      <input
                        type="number"
                        className="form-input"
                        value={val !== undefined ? val : ''}
                        onChange={e => updateItemField(f.key, Number(e.target.value))}
                        placeholder={f.placeholder}
                        required={f.required}
                        style={{ width: '100%', fontSize: '0.875rem' }}
                      />
                    ) : f.type === 'boolean' ? (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                        <input
                          type="checkbox"
                          checked={!!val}
                          onChange={e => updateItemField(f.key, e.target.checked)}
                          style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }}
                        />
                        <span>Enable {f.label}</span>
                      </label>
                    ) : f.type === 'select' && f.options ? (
                      <select
                        className="form-input"
                        value={val || ''}
                        onChange={e => updateItemField(f.key, e.target.value)}
                        required={f.required}
                        style={{ width: '100%', fontSize: '0.875rem' }}
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
                          style={{ width: '100%', fontSize: '0.875rem' }}
                        />
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Separate items with commas</span>
                      </div>
                    ) : (
                      <input
                        type="text"
                        className="form-input"
                        value={val || ''}
                        onChange={e => updateItemField(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        required={f.required}
                        style={{ width: '100%', fontSize: '0.875rem' }}
                      />
                    )}
                    {f.help && <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{f.help}</div>}
                  </div>
                );
              })}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setEditingItem(null)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm" style={{ minWidth: 120 }}>
                  {saving ? 'Saving…' : savedSuccess ? (
                    <>
                      <CheckCircle2 size={15} /> Saved!
                    </>
                  ) : (
                    <>
                      <Save size={15} /> Save {entityName}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View Modal / Drawer ── */}
      {viewingItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', maxWidth: 640, width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1.5px solid var(--color-border)', boxShadow: '0 24px 48px rgba(0,0,0,0.25)', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{entityName} Details</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>ID: {viewingItem.id}</span>
              </div>
              <button onClick={() => setViewingItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {renderViewModalContent ? renderViewModalContent(viewingItem) : (
              <pre style={{ fontSize: '0.8rem', background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 8, overflow: 'auto' }}>
                {JSON.stringify(viewingItem, null, 2)}
              </pre>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <button onClick={() => { const item = viewingItem; setViewingItem(null); openEditModal(item); }} className="btn btn-primary btn-sm">
                <Edit3 size={14} /> Edit {entityName}
              </button>
              <button onClick={() => setViewingItem(null)} className="btn btn-outline btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
