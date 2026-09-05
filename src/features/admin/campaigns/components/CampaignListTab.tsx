import React from 'react';
import {
  Send,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Eye,
  Search,
  LayoutGrid,
  List,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import type { Campaign, AudienceList } from '../../../../core/services/campaign.service';
import { AdminPagination } from '../../components/AdminPagination';

interface CampaignListTabProps {
  campaigns: Campaign[];
  audiences: AudienceList[];
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: 'all' | 'sent' | 'draft';
  onStatusFilterChange: (val: 'all' | 'sent' | 'draft') => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (val: 'list' | 'grid') => void;
  currentPage: number;
  onPageChange: (p: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (p: number) => void;
  onNewCampaign: () => void;
  onEditCampaign: (c: Campaign) => void;
  onDuplicateCampaign: (c: Campaign) => void;
  onDeleteCampaign: (id: string) => void;
  onPreviewCampaign: (c: Campaign) => void;
  onDispatchCampaign: (c: Campaign) => void;
}

export const CampaignListTab: React.FC<CampaignListTabProps> = ({
  campaigns,
  audiences,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  currentPage,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  onNewCampaign,
  onEditCampaign,
  onDuplicateCampaign,
  onDeleteCampaign,
  onPreviewCampaign,
  onDispatchCampaign,
}) => {
  const getAudienceName = (id: string) => {
    return audiences.find(a => a.id === id)?.name || 'Default Audience';
  };

  const filteredCampaigns = campaigns.filter(c => {
    const matchSearch = !search.trim() || c.title.toLowerCase().includes(search.toLowerCase()) || c.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paginated = filteredCampaigns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: 260 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search campaigns..."
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              style={{ paddingLeft: '2.2rem', height: 38, fontSize: '0.875rem' }}
            />
          </div>

          {/* Status Select */}
          <select
            className="form-input"
            value={statusFilter}
            onChange={e => onStatusFilterChange(e.target.value as any)}
            style={{ height: 38, fontSize: '0.875rem', width: 'auto' }}
          >
            <option value="all">All Campaign Statuses</option>
            <option value="draft">Drafts</option>
            <option value="sent">Dispatched / Sent</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 2, background: 'var(--color-surface)', padding: 3, borderRadius: 8, border: '1px solid var(--color-border)' }}>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '4px 8px', border: 'none' }}
              onClick={() => onViewModeChange('list')}
            >
              <List size={14} />
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '4px 8px', border: 'none' }}
              onClick={() => onViewModeChange('grid')}
            >
              <LayoutGrid size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={onNewCampaign}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
          >
            <Plus size={15} /> Create Campaign
          </button>
        </div>
      </div>

      {/* Campaigns Table or Grid */}
      {filteredCampaigns.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1.5px dashed var(--color-border)' }}>
          <p style={{ margin: '0 0 1rem', color: 'var(--color-text-muted)' }}>No campaigns found.</p>
          <button type="button" onClick={onNewCampaign} className="btn btn-primary btn-sm">
            <Plus size={14} /> Create First Campaign
          </button>
        </div>
      ) : viewMode === 'list' ? (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--color-border)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Campaign</th>
                <th style={{ padding: '0.85rem 1rem' }}>Audience</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem' }}>Performance</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(c => {
                const openRate = c.sentCount ? Math.round((c.openedCount / c.sentCount) * 100) : 0;
                const clickRate = c.sentCount ? Math.round((c.clickedCount / c.sentCount) * 100) : 0;
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{c.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.subject}
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                      {getAudienceName(c.audienceId)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: c.status === 'sent' ? 'rgba(6, 95, 70, 0.12)' : 'rgba(234, 179, 8, 0.12)',
                        color: c.status === 'sent' ? 'var(--color-primary)' : '#d97706',
                      }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem' }}>
                      {c.status === 'sent' ? (
                        <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--color-text-muted)' }}>
                          <span>Sent: <strong>{c.sentCount || 0}</strong></span>
                          <span>Opens: <strong style={{ color: '#1a6bff' }}>{openRate}%</strong></span>
                          <span>Clicks: <strong style={{ color: 'var(--color-accent)' }}>{clickRate}%</strong></span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Not dispatched</span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          onClick={() => onPreviewCampaign(c)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '3px 7px' }}
                          title="Preview"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => onEditCampaign(c)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '3px 7px' }}
                          title="Edit in Composer"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => onDuplicateCampaign(c)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '3px 7px' }}
                          title="Duplicate"
                        >
                          <Copy size={13} />
                        </button>
                        {c.status === 'draft' && (
                          <button
                            onClick={() => onDispatchCampaign(c)}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                            title="Dispatch"
                          >
                            <Send size={12} /> Send
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteCampaign(c.id)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '3px 7px', color: 'var(--color-danger)' }}
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {paginated.map(c => (
            <div key={c.id} style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: c.status === 'sent' ? 'var(--color-primary)' : '#d97706' }}>
                    {c.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {getAudienceName(c.audienceId)}
                  </span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.25rem' }}>{c.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.subject}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                <button onClick={() => onEditCampaign(c)} className="btn btn-primary btn-sm" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}>
                  Edit Composer
                </button>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => onPreviewCampaign(c)} className="btn btn-outline btn-sm" style={{ padding: '3px 7px' }}><Eye size={13} /></button>
                  <button onClick={() => onDeleteCampaign(c.id)} className="btn btn-outline btn-sm" style={{ padding: '3px 7px', color: 'var(--color-danger)' }}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {filteredCampaigns.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalItems={filteredCampaigns.length}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
          pageSizeOptions={[6, 12, 24]}
          unitName="campaigns"
        />
      )}
    </div>
  );
};
