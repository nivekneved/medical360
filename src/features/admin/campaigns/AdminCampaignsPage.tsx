import { useState, useRef, useEffect } from 'react';
import {
  Mail,
  Users,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
} from 'lucide-react';
import {
  Campaign,
  AudienceList,
  getCampaigns,
  saveCampaign,
  deleteCampaign,
  getAudiences,
  saveAudience,
  deleteAudience,
  dispatchCampaign,
  renderCampaignHtml,
} from '../../../core/services/campaign.service';
import { sanitizeHtml } from '../../../core/services/security.service';
import { CampaignListTab } from './components/CampaignListTab';
import { CampaignAudiencesTab } from './components/CampaignAudiencesTab';
import { CampaignComposerTab } from './components/CampaignComposerTab';

export function AdminCampaignsPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'audiences' | 'composer'>('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>(getCampaigns);
  const [audiences, setAudiences] = useState<AudienceList[]>(getAudiences);
  
  // Campaigns list controls
  const [campaignViewMode, setCampaignViewMode] = useState<'list' | 'grid'>('list');
  const [campaignSearch, setCampaignSearch] = useState('');
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<'all' | 'sent' | 'draft'>('all');
  const [campaignPage, setCampaignPage] = useState(1);
  const [campaignsPerPage, setCampaignsPerPage] = useState(6);

  // Senders list controls
  const [selectedAudienceId, setSelectedAudienceId] = useState<string>(() => audiences[0]?.id || '');

  // Active selected campaign for composer / editing
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [previewCampaign, setPreviewCampaign] = useState<Campaign | null>(null);

  // Dispatch progress state
  const [dispatchStatus, setDispatchStatus] = useState<{ running: boolean; total: number; sent: number; errors: string[] } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const showNotification = (text: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setNotification(text);
    timerRef.current = setTimeout(() => setNotification(null), 3500);
  };

  const refreshData = () => {
    setCampaigns(getCampaigns());
    setAudiences(getAudiences());
  };

  const handleNewCampaign = () => {
    const defaultAudience = audiences[0];
    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      title: 'Untitled Email Campaign',
      subject: 'Specialist Medical Review & Coordination',
      preheader: 'Exclusive care coordination with accredited hospitals',
      audienceId: defaultAudience?.id || 'aud-all-inquiries',
      audienceName: defaultAudience?.name || 'All Patient Inquiries',
      recipientCount: defaultAudience?.contacts.length || 0,
      sentCount: 0,
      openedCount: 0,
      clickedCount: 0,
      status: 'draft',
      createdAt: new Date().toISOString(),
      template: {
        bannerTitle: 'Medical 360 • Healthcare Concierge',
        bannerBg: '#065f46',
        bannerTextColor: '#ffffff',
        headline: 'Specialist Medical Second Opinion & Care Coordination',
        introText: 'Dear {{name}},\n\nWe are pleased to share the latest treatment pathways and specialized hospital options available for patients in Mauritius and the Indian Ocean.',
        bulletPoints: [
          'Direct consultation with board-certified chief surgeons',
          'Complete travel, visa, and bedside concierge arrangements',
          'Transparent, itemized pricing packages with zero hidden costs'
        ],
        ctaText: 'Request Free Medical Assessment',
        ctaUrl: 'https://medical360-zeta.vercel.app/describe-need',
        ctaBgColor: '#059669',
        showWhatsAppButton: true,
        whatsAppText: 'Chat Directly with Care Coordinator',
        showFooter: true,
        footerNote: 'You received this confidential medical communication because of your previous inquiry with Medical360.'
      }
    };
    setEditingCampaign(newCamp);
    setActiveTab('composer');
  };

  const handleEditCampaign = (c: Campaign) => {
    setEditingCampaign(JSON.parse(JSON.stringify(c)));
    setActiveTab('composer');
  };

  const handleSaveComposer = () => {
    if (!editingCampaign) return;
    saveCampaign(editingCampaign);
    refreshData();
    showNotification(`Campaign "${editingCampaign.title}" saved.`);
  };

  const handleDuplicateCampaign = (c: Campaign) => {
    const dup: Campaign = {
      ...c,
      id: `camp-${Date.now()}`,
      title: `${c.title} (Copy)`,
      status: 'draft',
      sentAt: undefined,
      sentCount: 0,
      openedCount: 0,
      clickedCount: 0,
      createdAt: new Date().toISOString(),
    };
    saveCampaign(dup);
    refreshData();
    showNotification(`Duplicated "${c.title}".`);
  };

  const handleDeleteCampaign = (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    deleteCampaign(id);
    refreshData();
    showNotification('Campaign deleted.');
  };

  const handleDispatchCampaign = async (c: Campaign) => {
    if (!confirm(`Dispatch campaign "${c.title}" to all recipients now?`)) return;
    const audience = audiences.find(a => a.id === c.audienceId) || audiences[0];
    const contacts = audience?.contacts || [];
    if (contacts.length === 0) {
      alert('The target audience has no recipients.');
      return;
    }
    setDispatchStatus({ running: true, total: contacts.length, sent: 0, errors: [] });
    try {
      const result = await dispatchCampaign(c, contacts, (sent, total) => {
        setDispatchStatus(prev => prev ? { ...prev, sent, total } : null);
      });
      refreshData();
      showNotification(`Successfully dispatched to ${result.sentCount} recipients!`);
    } catch (err: any) {
      alert(`Dispatch error: ${err.message}`);
    } finally {
      setDispatchStatus(null);
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '1.5rem 0' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>
            Email Marketing & Patient Follow-Up
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Create broadcast emails, manage audience lists, and automate clinical recovery outreach.
          </p>
        </div>

        {notification && (
          <div style={{ background: 'rgba(6, 95, 70, 0.1)', color: 'var(--color-primary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-lg)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={16} /> {notification}
          </div>
        )}
      </div>

      {/* Main Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('campaigns')}
          style={{
            padding: '0.75rem 1.25rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'campaigns' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
            color: activeTab === 'campaigns' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <Mail size={16} /> Campaigns ({campaigns.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audiences')}
          style={{
            padding: '0.75rem 1.25rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'audiences' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
            color: activeTab === 'audiences' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <Users size={16} /> Audience Segments ({audiences.length})
        </button>

        {editingCampaign && (
          <button
            type="button"
            onClick={() => setActiveTab('composer')}
            style={{
              padding: '0.75rem 1.25rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'composer' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
              color: activeTab === 'composer' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <Sparkles size={16} /> Active Composer: {editingCampaign.title}
          </button>
        )}
      </div>

      {/* Inline Preview Console */}
      {previewCampaign && (
        <div style={{
          background: 'var(--color-surface)',
          border: '2px solid var(--color-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          animation: 'fadeIn 0.2s ease',
          boxShadow: 'var(--shadow-md)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
              Preview: {previewCampaign.title}
            </h3>
            <button type="button" onClick={() => setPreviewCampaign(null)} className="btn btn-outline btn-sm">
              <X size={14} /> Close Preview
            </button>
          </div>
          <div style={{ background: '#ffffff', borderRadius: 10, border: '1px solid var(--color-border)', overflow: 'hidden', padding: '1rem', maxHeight: 500, overflowY: 'auto' }}>
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(renderCampaignHtml(previewCampaign, { name: 'Jean-Luc Marie', country: 'Mauritius' })) }} />
          </div>
        </div>
      )}

      {/* Tab Contents */}
      {activeTab === 'campaigns' && (
        <CampaignListTab
          campaigns={campaigns}
          audiences={audiences}
          search={campaignSearch}
          onSearchChange={setCampaignSearch}
          statusFilter={campaignStatusFilter}
          onStatusFilterChange={setCampaignStatusFilter}
          viewMode={campaignViewMode}
          onViewModeChange={setCampaignViewMode}
          currentPage={campaignPage}
          onPageChange={setCampaignPage}
          itemsPerPage={campaignsPerPage}
          onItemsPerPageChange={setCampaignsPerPage}
          onNewCampaign={handleNewCampaign}
          onEditCampaign={handleEditCampaign}
          onDuplicateCampaign={handleDuplicateCampaign}
          onDeleteCampaign={handleDeleteCampaign}
          onPreviewCampaign={setPreviewCampaign}
          onDispatchCampaign={handleDispatchCampaign}
        />
      )}

      {activeTab === 'audiences' && (
        <CampaignAudiencesTab
          audiences={audiences}
          selectedAudienceId={selectedAudienceId}
          setSelectedAudienceId={setSelectedAudienceId}
          onSaveAudience={(aud) => { saveAudience(aud); refreshData(); }}
          onDeleteAudience={(id) => { deleteAudience(id); refreshData(); }}
          onNotify={showNotification}
        />
      )}

      {activeTab === 'composer' && editingCampaign && (
        <CampaignComposerTab
          campaign={editingCampaign}
          setCampaign={setEditingCampaign}
          audiences={audiences}
          onSave={handleSaveComposer}
          onDispatch={handleDispatchCampaign}
          onBackToList={() => setActiveTab('campaigns')}
        />
      )}
    </div>
  );
}
