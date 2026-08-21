import React from 'react';
import { ArrowUpDown, LayoutGrid, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './ListToolbar.css';

export interface SortOption {
  value: string;
  label: string;
  icon?: string;
}

export interface ListToolbarProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  sortOptions: SortOption[];
  totalCount: number;
  countUnit?: string;
  countUnitPlural?: string;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  extraControls?: React.ReactNode;
}

export function ListToolbar({
  sortBy,
  onSortChange,
  sortOptions,
  totalCount,
  countUnit,
  countUnitPlural,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  extraControls,
}: ListToolbarProps) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';

  const defaultUnit = isFr ? 'élément' : isKr ? 'eleman' : 'item';
  const defaultPlural = isFr ? 'éléments' : isKr ? 'eleman' : 'items';

  const unit = totalCount <= 1 ? (countUnit || defaultUnit) : (countUnitPlural || countUnit || defaultPlural);

  return (
    <div className="list-toolbar-wrap">
      <div className="list-toolbar">
        {/* Left Side: Search & Filter Pills */}
        <div className="list-toolbar__left">
          {onSearchChange !== undefined && (
            <div className="list-toolbar__search-pill">
              <span className="list-toolbar__search-icon">🔍</span>
              <input
                type="text"
                className="list-toolbar__search-input"
                placeholder={searchPlaceholder || (isFr ? 'Rechercher...' : isKr ? 'Rode...' : 'Search...')}
                value={searchQuery || ''}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="list-toolbar__clear-search"
                  onClick={() => onSearchChange('')}
                  title="Clear"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {extraControls}
        </div>

        {/* Right Side: Sort Pill, Count Badge, View Switcher */}
        <div className="list-toolbar__controls">
          {/* 1. Sort By Dropdown Pill */}
          <div className="list-toolbar__sort-pill">
            <ArrowUpDown size={15} className="list-toolbar__sort-icon" />
            <span className="list-toolbar__sort-label">
              {isFr ? 'Trier par :' : isKr ? 'Triye par :' : 'Sort by :'}
            </span>
            <select
              className="list-toolbar__sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.icon ? `${opt.icon} ` : ''}{opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Total Count Badge */}
          <div className="list-toolbar__count-badge">
            <span className="list-toolbar__count-num">{totalCount}</span>
            <span className="list-toolbar__count-unit">{unit}</span>
          </div>

          {/* 3. View Mode Toggle (Grid / List) */}
          <div className="list-toolbar__view-switcher" role="group" aria-label="View switcher">
            <button
              type="button"
              className={`list-toolbar__view-btn ${viewMode === 'grid' ? 'list-toolbar__view-btn--active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              title={isFr ? 'Vue Grille' : 'Grid View'}
            >
              <LayoutGrid size={15} />
              <span>{isFr ? 'Grille' : isKr ? 'Gril' : 'Grid'}</span>
            </button>

            <button
              type="button"
              className={`list-toolbar__view-btn ${viewMode === 'list' ? 'list-toolbar__view-btn--active' : ''}`}
              onClick={() => onViewModeChange('list')}
              title={isFr ? 'Vue Liste' : 'List View'}
            >
              <List size={15} />
              <span>{isFr ? 'Liste' : isKr ? 'List' : 'List'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
