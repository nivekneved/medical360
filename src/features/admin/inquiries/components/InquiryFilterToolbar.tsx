import React from 'react';
import { Search, X, RotateCcw, ArrowUpDown, LayoutGrid, List } from 'lucide-react';
import type { InquiryStatus, Specialty } from '../../../../core/types';

interface InquiryFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  selectedUrgency: string;
  onUrgencyChange: (val: string) => void;
  selectedSpecialty: string;
  onSpecialtyChange: (val: string) => void;
  sortBy: string;
  onSortChange: (val: any) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (val: 'grid' | 'table') => void;
  statusOptions: InquiryStatus[];
  specialties: Specialty[];
}

export const InquiryFilterToolbar: React.FC<InquiryFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedUrgency,
  onUrgencyChange,
  selectedSpecialty,
  onSpecialtyChange,
  sortBy,
  onSortChange,
  hasActiveFilters,
  onResetFilters,
  viewMode,
  onViewModeChange,
  statusOptions,
  specialties,
}) => {
  return (
    <div className="admin-toolbar">
      {/* Search Input */}
      <div className="admin-toolbar__left">
        <div className="admin-toolbar__search-box">
          <Search size={16} className="admin-toolbar__search-icon" />
          <input
            type="text"
            className="admin-toolbar__search-input"
            placeholder="Search patient, phone, specialty..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              className="admin-toolbar__clear-search"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Filters and View Switcher */}
      <div className="admin-toolbar__right">
        {/* Status Filter */}
        <select
          className="admin-toolbar__select"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {statusOptions.map((st) => (
            <option key={st} value={st}>
              {st.replace(/_/g, ' ')}
            </option>
          ))}
        </select>

        {/* Urgency Filter */}
        <select
          className="admin-toolbar__select"
          value={selectedUrgency}
          onChange={(e) => onUrgencyChange(e.target.value)}
        >
          <option value="all">All Urgencies</option>
          <option value="routine">Routine</option>
          <option value="urgent">Urgent</option>
          <option value="emergency">Emergency</option>
        </select>

        {/* Specialty Filter */}
        <select
          className="admin-toolbar__select"
          value={selectedSpecialty}
          onChange={(e) => onSpecialtyChange(e.target.value)}
        >
          <option value="all">All Specialties</option>
          {specialties.map((spec) => (
            <option key={spec.id} value={spec.id}>{spec.name}</option>
          ))}
        </select>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            className="admin-toolbar__reset-btn"
            onClick={onResetFilters}
            title="Reset all filters"
          >
            <RotateCcw size={14} /> Clear
          </button>
        )}

        {/* Sort By Dropdown */}
        <div className="admin-toolbar__sort-wrapper">
          <ArrowUpDown size={15} className="admin-toolbar__sort-icon" />
          <select
            className="admin-toolbar__select admin-toolbar__select--sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="urgency-desc">Highest Urgency</option>
            <option value="name-asc">Patient Name (A-Z)</option>
          </select>
        </div>

        {/* View Switcher Buttons */}
        <div className="admin-toolbar__view-toggle">
          <button
            className={`admin-toolbar__view-btn ${viewMode === 'table' ? 'admin-toolbar__view-btn--active' : ''}`}
            onClick={() => onViewModeChange('table')}
            title="Table View"
            aria-label="Table View"
          >
            <List size={16} />
          </button>
          <button
            className={`admin-toolbar__view-btn ${viewMode === 'grid' ? 'admin-toolbar__view-btn--active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Grid Cards View"
            aria-label="Grid Cards View"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
