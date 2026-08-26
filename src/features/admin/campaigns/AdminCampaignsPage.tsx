import { useState, useMemo, useRef } from 'react';
import {
  Mail,
  Send,
  Plus,
  Users,
  Upload,
  FileText,
  Trash2,
  Edit3,
  Copy,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Smartphone,
  Monitor,
  Download,
  Search,
  Filter,
  ArrowRight,
  MessageCircle,
  Check,
  ChevronRight,
  X,
  Layers,
  Palette,
  ExternalLink,
  LayoutGrid,
  List,
  Printer,
} from 'lucide-react';
import {
  Campaign,
  AudienceList,
  Contact,
  getCampaigns,
  saveCampaign,
  deleteCampaign,
  getAudiences,
  saveAudience,
  deleteAudience,
  parseCSVContacts,
  renderCampaignHtml,
  sendTestCampaignEmail,
  dispatchCampaign,
} from '../../../core/services/campaign.service';
import { AdminPagination } from '../components/AdminPagination';
import { AdminBulkActionBar } from '../components/AdminBulkActionBar';
import { printOrExportPdf, exportToCsv, type ExportColumn } from '../../../core/services/export.service';

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
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<Set<string>>(new Set());

  // Senders list controls
  const [sendersViewMode, setSendersViewMode] = useState<'list' | 'grid'>('list');
  const [sendersPage, setSendersPage] = useState(1);
  const [sendersPerPage, setSendersPerPage] = useState(10);
  const [selectedAudienceId, setSelectedAudienceId] = useState<string>(() => audiences[0]?.id || '');
  const [contactSearch, setContactSearch] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(new Set());

  // Active selected campaign for composer / editing
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  
  // Modals state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewAudienceModal, setShowNewAudienceModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [previewCampaign, setPreviewCampaign] = useState<Campaign | null>(null);
  
  // Upload CSV state
  const [csvRawText, setCsvRawText] = useState('');
  const [parsedPreviewContacts, setParsedPreviewContacts] = useState<Contact[]>([]);
  const [uploadTargetAudienceId, setUploadTargetAudienceId] = useState(selectedAudienceId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Audience state
  const [newAudienceName, setNewAudienceName] = useState('');
  const [newAudienceDesc, setNewAudienceDesc] = useState('');

  // Add Contact state
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactCountry, setNewContactCountry] = useState('Mauritius');

  // Preview & Test state in Composer
  const [composerPreviewMode, setComposerPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [testEmailAddress, setTestEmailAddress] = useState(import.meta.env.VITE_ADMIN_EMAIL || 'kevinadlib@gmail.com');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Dispatch modal state
  const [dispatchingModal, setDispatchingModal] = useState<{ campaign: Campaign; total: number; sent: number; isDone: boolean; errors: string[] } | null>(null);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Filtered & Paginated Campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      const matchesSearch = !campaignSearch.trim() ||
        c.title.toLowerCase().includes(campaignSearch.toLowerCase()) ||
        c.subject.toLowerCase().includes(campaignSearch.toLowerCase()) ||
        c.audienceName.toLowerCase().includes(campaignSearch.toLowerCase());
      
      const matchesStatus = campaignStatusFilter === 'all' || c.status === campaignStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, campaignSearch, campaignStatusFilter]);

  const paginatedCampaigns = useMemo(() => {
    const start = (campaignPage - 1) * campaignsPerPage;
    return filteredCampaigns.slice(start, start + campaignsPerPage);
  }, [filteredCampaigns, campaignPage, campaignsPerPage]);

  // Campaign Selection & Export Helpers
  const toggleSelectCampaign = (id: string) => {
    setSelectedCampaignIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllCampaigns = () => {
    setSelectedCampaignIds(new Set(filteredCampaigns.map(c => c.id)));
  };

  const handleClearCampaignsSelection = () => {
    setSelectedCampaignIds(new Set());
  };

  const campaignExportColumns: ExportColumn[] = [
    { header: 'Campaign Title', key: 'title' },
    { header: 'Email Subject', key: 'subject' },
    { header: 'Audience List', key: 'audienceName' },
    { header: 'Recipients Count', key: 'recipientCount', format: (v) => String(v || 0) },
    { header: 'Status', key: 'status', format: (v) => String(v).toUpperCase() },
    { header: 'Delivered', key: 'sentCount', format: (v) => String(v || 0) },
    { header: 'Created', key: 'createdAt', format: (v) => new Date(v).toLocaleDateString() },
    { header: 'Sent Date', key: 'sentAt', format: (v) => v ? new Date(v).toLocaleDateString() : 'N/A' },
  ];

  const handleDeleteSelectedCampaigns = () => {
    if (selectedCampaignIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedCampaignIds.size} selected campaigns?`)) {
      let current = campaigns;
      for (const id of selectedCampaignIds) {
        current = deleteCampaign(id);
      }
      setCampaigns(current);
      handleClearCampaignsSelection();
      showToast('Selected campaigns deleted.');
    }
  };

  const handlePrintPdfCampaigns = () => {
    const targetData = selectedCampaignIds.size > 0
      ? campaigns.filter(c => selectedCampaignIds.has(c.id))
      : filteredCampaigns;
    printOrExportPdf('Email Broadcast Campaigns Report', campaignExportColumns, targetData, 'Nexus Email Marketing & Patient Outreach Hub');
  };

  const handleExportCsvCampaigns = () => {
    const targetData = selectedCampaignIds.size > 0
      ? campaigns.filter(c => selectedCampaignIds.has(c.id))
      : filteredCampaigns;
    exportToCsv('medical360_campaigns', campaignExportColumns, targetData);
  };

  // Active Audience object
  const activeAudience = useMemo(() => {
    return audiences.find(a => a.id === selectedAudienceId) || audiences[0] || null;
  }, [audiences, selectedAudienceId]);

  // Filtered & Paginated Contacts
  const filteredContacts = useMemo(() => {
    if (!activeAudience) return [];
    if (!contactSearch.trim()) return activeAudience.contacts;
    const q = contactSearch.toLowerCase();
    return activeAudience.contacts.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q)) ||
      (c.country && c.country.toLowerCase().includes(q))
    );
  }, [activeAudience, contactSearch]);

  const paginatedContacts = useMemo(() => {
    const start = (sendersPage - 1) * sendersPerPage;
    return filteredContacts.slice(start, start + sendersPerPage);
  }, [filteredContacts, sendersPage, sendersPerPage]);

  // Contact Selection & Export Helpers
  const toggleSelectContact = (id: string) => {
    setSelectedContactIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllContacts = () => {
    setSelectedContactIds(new Set(filteredContacts.map(c => c.id)));
  };

  const handleClearContactsSelection = () => {
    setSelectedContactIds(new Set());
  };

  const contactExportColumns: ExportColumn[] = [
    { header: 'Recipient Name', key: 'name' },
    { header: 'Email Address', key: 'email' },
    { header: 'Phone / WhatsApp', key: 'phone' },
    { header: 'Country', key: 'country' },
    { header: 'Added Date', key: 'addedAt', format: (v) => v ? new Date(v).toLocaleDateString() : 'N/A' },
  ];

  const handleDeleteSelectedContacts = () => {
    if (!activeAudience || selectedContactIds.size === 0) return;
    if (confirm(`Are you sure you want to remove ${selectedContactIds.size} selected contacts from "${activeAudience.name}"?`)) {
      const updatedContacts = activeAudience.contacts.filter(c => !selectedContactIds.has(c.id));
      const updated = saveAudience({ ...activeAudience, contacts: updatedContacts });
      setAudiences(updated);
      handleClearContactsSelection();
      showToast('Selected contacts removed.');
    }
  };

  const handlePrintPdfContacts = () => {
    if (!activeAudience) return;
    const targetData = selectedContactIds.size > 0
      ? activeAudience.contacts.filter(c => selectedContactIds.has(c.id))
      : filteredContacts;
    printOrExportPdf(`Audience Contacts: ${activeAudience.name}`, contactExportColumns, targetData, `${activeAudience.description} • ${targetData.length} recipients`);
  };

  const handleExportCsvContacts = () => {
    if (!activeAudience) return;
    const targetData = selectedContactIds.size > 0
      ? activeAudience.contacts.filter(c => selectedContactIds.has(c.id))
      : filteredContacts;
    exportToCsv(`medical360_audience_${activeAudience.name.toLowerCase().replace(/\s+/g, '_')}`, contactExportColumns, targetData);
  };

  // Overall Stats
  const stats = useMemo(() => {
    const totalCamp = campaigns.length;
    const sentCamp = campaigns.filter(c => c.status === 'sent').length;
    const totalDelivered = campaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0);
    const totalContacts = audiences.reduce((sum, a) => sum + a.contacts.length, 0);
    return { totalCamp, sentCamp, totalDelivered, totalContacts };
  }, [campaigns, audiences]);

  const showToast = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 4000);
  };

  // ─── Actions: Campaign Management ──────────────────────────────────────────
  const handleCreateNewCampaign = () => {
    const defaultAud = audiences[0];
    const newCamp: Campaign = {
      id: 'cmp-' + Date.now(),
      title: 'New Medical Broadcast Campaign',
      subject: '🌟 Medical360: Important Healthcare Update for {{name}}',
      preheader: 'Discover top medical treatments and free international second opinions.',
      status: 'draft',
      audienceId: defaultAud?.id || '',
      audienceName: defaultAud?.name || 'All Inquiries',
      recipientCount: defaultAud?.contacts.length || 0,
      sentCount: 0,
      openedCount: 0,
      clickedCount: 0,
      createdAt: new Date().toISOString(),
      template: {
        bannerTitle: 'Healthcare Concierge',
        bannerBg: '#090d10',
        bannerTextColor: '#ffffff',
        headline: 'Personalized Healthcare Options & Doctor Consultations',
        introText: 'Dear {{name}},\n\nWe are reaching out to help you explore world-class medical treatments with accredited international hospital partners.',
        heroImageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
        bulletPoints: [
          'Direct case review by accredited specialist doctors',
          'Fast-track medical visa and flight concierge assistance',
          '100% free guidance for patients',
        ],
        ctaText: 'Describe Your Medical Need (Free Consultation)',
        ctaUrl: 'https://med360.mu/describe-need',
        ctaBgColor: '#065f46',
        showWhatsAppButton: true,
        whatsAppText: 'Chat on WhatsApp (+230 59188275)',
        showFooter: true,
        footerNote: 'Medical360 Mauritius • Patient Care & International Referrals.',
      },
    };
    setEditingCampaign(newCamp);
    setActiveTab('composer');
  };

  const handleEditCampaign = (camp: Campaign) => {
    setEditingCampaign(JSON.parse(JSON.stringify(camp)));
    setActiveTab('composer');
  };

  const handleDuplicateCampaign = (camp: Campaign) => {
    const copy: Campaign = {
      ...JSON.parse(JSON.stringify(camp)),
      id: 'cmp-' + Date.now(),
      title: `${camp.title} (Copy)`,
      status: 'draft',
      sentCount: 0,
      openedCount: 0,
      clickedCount: 0,
      createdAt: new Date().toISOString(),
      sentAt: undefined,
    };
    const updated = saveCampaign(copy);
    setCampaigns(updated);
    showToast('Campaign duplicated as a new draft!');
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      const updated = deleteCampaign(id);
      setCampaigns(updated);
      showToast('Campaign deleted.');
    }
  };

  const handleSaveComposer = () => {
    if (!editingCampaign) return;
    const targetAud = audiences.find(a => a.id === editingCampaign.audienceId);
    const updatedCamp: Campaign = {
      ...editingCampaign,
      audienceName: targetAud?.name || editingCampaign.audienceName,
      recipientCount: targetAud?.contacts.length || editingCampaign.recipientCount,
    };
    const updated = saveCampaign(updatedCamp);
    setCampaigns(updated);
    setEditingCampaign(updatedCamp);
    showToast('Campaign saved successfully!');
  };

  const handleSendTestComposer = async () => {
    if (!editingCampaign) return;
    if (!testEmailAddress || !testEmailAddress.includes('@')) {
      setTestResult({ success: false, message: 'Please enter a valid recipient email.' });
      return;
    }
    setSendingTest(true);
    setTestResult(null);
    const res = await sendTestCampaignEmail(editingCampaign, testEmailAddress);
    setSendingTest(false);
    if (res.success) {
      setTestResult({ success: true, message: `Test campaign sent to ${testEmailAddress}!` });
    } else {
      setTestResult({ success: false, message: res.error || 'Failed to send test email.' });
    }
    setTimeout(() => setTestResult(null), 5000);
  };

  const handleLaunchCampaign = (camp: Campaign) => {
    const targetAud = audiences.find(a => a.id === camp.audienceId);
    const contacts = targetAud?.contacts || [];

    if (contacts.length === 0) {
      alert('Selected audience list has 0 contacts. Please add or upload recipients first.');
      return;
    }

    if (!confirm(`Are you ready to dispatch "${camp.title}" to ${contacts.length} recipients in "${targetAud?.name}"?`)) {
      return;
    }

    setDispatchingModal({
      campaign: camp,
      total: contacts.length,
      sent: 0,
      isDone: false,
      errors: [],
    });

    dispatchCampaign(camp, contacts, (sent, total) => {
      setDispatchingModal(prev => prev ? { ...prev, sent, total } : null);
    }).then(res => {
      setDispatchingModal(prev => prev ? { ...prev, isDone: true, errors: res.errors } : null);
      setCampaigns(getCampaigns());
    });
  };

  // ─── Actions: Audience & CSV Upload ─────────────────────────────────────────
  const handleCreateAudience = () => {
    if (!newAudienceName.trim()) return;
    const newAud: AudienceList = {
      id: 'aud-' + Date.now(),
      name: newAudienceName.trim(),
      description: newAudienceDesc.trim() || 'Custom audience list',
      contacts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = saveAudience(newAud);
    setAudiences(updated);
    setSelectedAudienceId(newAud.id);
    setNewAudienceName('');
    setNewAudienceDesc('');
    setShowNewAudienceModal(false);
    showToast(`Audience list "${newAud.name}" created!`);
  };

  const handleDeleteAudience = (id: string) => {
    if (confirm('Delete this audience list? Contacts inside will be removed.')) {
      const updated = deleteAudience(id);
      setAudiences(updated);
      if (selectedAudienceId === id) {
        setSelectedAudienceId(updated[0]?.id || '');
      }
      showToast('Audience list removed.');
    }
  };

  const handleAddSingleContact = () => {
    if (!newContactEmail || !newContactEmail.includes('@')) {
      alert('Please enter a valid email.');
      return;
    }
    const aud = audiences.find(a => a.id === selectedAudienceId);
    if (!aud) return;

    const newContact: Contact = {
      id: 'cnt-' + Date.now(),
      name: newContactName.trim() || newContactEmail.split('@')[0],
      email: newContactEmail.trim().toLowerCase(),
      phone: newContactPhone.trim(),
      country: newContactCountry.trim(),
      addedAt: new Date().toISOString(),
    };

    const updatedAudience: AudienceList = {
      ...aud,
      contacts: [newContact, ...aud.contacts.filter(c => c.email.toLowerCase() !== newContact.email.toLowerCase())],
      updatedAt: new Date().toISOString(),
    };

    const updated = saveAudience(updatedAudience);
    setAudiences(updated);
    setNewContactName('');
    setNewContactEmail('');
    setNewContactPhone('');
    setShowAddContactModal(false);
    showToast(`Added contact ${newContact.email} to ${aud.name}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvRawText(text);
      const parsed = parseCSVContacts(text);
      setParsedPreviewContacts(parsed);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (parsedPreviewContacts.length === 0) {
      alert('No valid contacts detected to import.');
      return;
    }
    const targetAudId = uploadTargetAudienceId || selectedAudienceId;
    const aud = audiences.find(a => a.id === targetAudId);
    if (!aud) return;

    // Merge contacts avoiding duplicates by email
    const existingEmails = new Set(aud.contacts.map(c => c.email.toLowerCase()));
    const newAdditions = parsedPreviewContacts.filter(c => !existingEmails.has(c.email.toLowerCase()));
    
    const updatedAudience: AudienceList = {
      ...aud,
      contacts: [...newAdditions, ...aud.contacts],
      updatedAt: new Date().toISOString(),
    };

    const updated = saveAudience(updatedAudience);
    setAudiences(updated);
    setSelectedAudienceId(targetAudId);
    setShowUploadModal(false);
    setCsvRawText('');
    setParsedPreviewContacts([]);
    showToast(`Successfully imported ${newAdditions.length} new senders/contacts to "${aud.name}"!`);
  };

  const handleExportCSV = () => {
    if (!activeAudience || activeAudience.contacts.length === 0) {
      alert('No contacts to export.');
      return;
    }
    const header = 'Name,Email,Phone,Country,AddedAt\n';
    const rows = activeAudience.contacts.map(c => `"${c.name}","${c.email}","${c.phone || ''}","${c.country || ''}","${c.addedAt}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeAudience.name.toLowerCase().replace(/\s+/g, '_')}_contacts.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1440, margin: '0 auto' }}>
      
      {/* ─── TOP HEADER ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <span style={{ background: 'linear-gradient(135deg, #065f46, #059669)', color: '#ffffff', padding: '3px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              NEXUS SUITE
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Resend API Connected</span>
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>
            Email Campaigns & Senders Hub
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '0.9rem' }}>
            Create broadcast campaigns, attach & upload sender lists, customize visual templates, and dispatch via Resend.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setShowUploadModal(true); setUploadTargetAudienceId(selectedAudienceId); }}
            className="btn btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
          >
            <Upload size={16} /> Upload Senders (CSV)
          </button>

          <button
            onClick={handleCreateNewCampaign}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
          >
            <Plus size={17} /> Create Campaign
          </button>
        </div>
      </div>

      {/* ─── METRIC STATS BAR ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            <span>TOTAL CAMPAIGNS</span>
            <Mail size={16} color="var(--color-primary)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.totalCamp}</div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: 4 }}>
            {stats.sentCamp} Broadcasts Launched
          </div>
        </div>

        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            <span>TOTAL AUDIENCE CONTACTS</span>
            <Users size={16} color="#065f46" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.totalContacts}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
            Across {audiences.length} Segments
          </div>
        </div>

        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            <span>TOTAL EMAILS DELIVERED</span>
            <Send size={16} color="#16a34a" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.totalDelivered}</div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: 4 }}>
            100% Delivery Success Rate
          </div>
        </div>

        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            <span>EST. OPEN RATE</span>
            <Sparkles size={16} color="#eab308" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>74.2%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
            High Patient Engagement
          </div>
        </div>
      </div>

      {/* ─── TOAST NOTIFICATION ─── */}
      {statusNotification && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.75rem 1.25rem', borderRadius: 8, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
          <CheckCircle2 size={18} color="#059669" /> {statusNotification}
        </div>
      )}

      {/* ─── MAIN TABS NAVIGATION ─── */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--color-border)', marginBottom: '1.75rem', gap: '2rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('campaigns')}
          style={{
            padding: '0.75rem 0.25rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'campaigns' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'campaigns' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: -2,
          }}
        >
          <Mail size={18} /> Campaigns Hub ({campaigns.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audiences')}
          style={{
            padding: '0.75rem 0.25rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'audiences' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'audiences' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: -2,
          }}
        >
          <Users size={18} /> Senders & Audiences ({audiences.length} Lists)
        </button>

        {editingCampaign && (
          <button
            type="button"
            onClick={() => setActiveTab('composer')}
            style={{
              padding: '0.75rem 0.25rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'composer' ? '3px solid var(--color-primary)' : '3px solid transparent',
              color: activeTab === 'composer' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: -2,
            }}
          >
            <Edit3 size={18} /> Campaign Visual Composer
          </button>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 1: CAMPAIGNS HUB (LIST & GRID VIEW + ACTIONS + PAGINATION)
      ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'campaigns' && (
        <div>
          {/* Campaigns Toolbar: Search, Status Filter & View Mode Switcher */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
            
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: 240, maxWidth: 360 }}>
              <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: 10, top: 11 }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search campaigns by title, subject..."
                value={campaignSearch}
                onChange={e => { setCampaignSearch(e.target.value); setCampaignPage(1); }}
                style={{ paddingLeft: 34, height: 38, fontSize: '0.85rem' }}
              />
            </div>

            {/* Filter Status, Print/Export + View Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {(['all', 'sent', 'draft'] as const).map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => { setCampaignStatusFilter(st); setCampaignPage(1); }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      cursor: 'pointer',
                      border: campaignStatusFilter === st ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                      background: campaignStatusFilter === st ? 'var(--color-primary)' : 'var(--color-surface)',
                      color: campaignStatusFilter === st ? '#ffffff' : 'var(--color-text-secondary)',
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Print & CSV Export Buttons */}
              <button
                type="button"
                onClick={handlePrintPdfCampaigns}
                className="btn btn-outline btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', padding: '5px 8px' }}
                title="Print or Save Campaigns as PDF"
              >
                <Printer size={13} /> Print / PDF
              </button>
              <button
                type="button"
                onClick={handleExportCsvCampaigns}
                className="btn btn-outline btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', padding: '5px 8px' }}
                title="Download CSV spreadsheet"
              >
                <Download size={13} /> CSV
              </button>

              {/* Grid vs List View Switcher */}
              <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 6, overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setCampaignViewMode('list')}
                  style={{ padding: '6px 10px', background: campaignViewMode === 'list' ? 'var(--color-primary)' : 'var(--color-surface)', color: campaignViewMode === 'list' ? 'white' : 'var(--color-text-secondary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700 }}
                  title="List View"
                >
                  <List size={14} /> List
                </button>
                <button
                  type="button"
                  onClick={() => setCampaignViewMode('grid')}
                  style={{ padding: '6px 10px', background: campaignViewMode === 'grid' ? 'var(--color-primary)' : 'var(--color-surface)', color: campaignViewMode === 'grid' ? 'white' : 'var(--color-text-secondary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700 }}
                  title="Grid View"
                >
                  <LayoutGrid size={14} /> Grid
                </button>
              </div>
            </div>
          </div>

          {/* ─── BULK ACTION BAR ─── */}
          <AdminBulkActionBar
            selectedCount={selectedCampaignIds.size}
            totalCount={filteredCampaigns.length}
            onSelectAll={handleSelectAllCampaigns}
            onClearSelection={handleClearCampaignsSelection}
            onDeleteSelected={handleDeleteSelectedCampaigns}
            onPrintPdfSelected={handlePrintPdfCampaigns}
            onExportCsvSelected={handleExportCsvCampaigns}
            unitName="campaigns"
          />

          {filteredCampaigns.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--color-surface)', borderRadius: 12, border: '1.5px dashed var(--color-border)' }}>
              <Mail size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No Campaigns Found</h3>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: 450, margin: '0.5rem auto 1.5rem' }}>
                Create your first email newsletter or patient broadcast campaign.
              </p>
              <button onClick={handleCreateNewCampaign} className="btn btn-primary">
                <Plus size={16} /> Create Campaign
              </button>
            </div>
          ) : campaignViewMode === 'list' ? (
            /* ─── LIST VIEW ─── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {paginatedCampaigns.map((camp) => {
                const isSent = camp.status === 'sent';
                const isSelected = selectedCampaignIds.has(camp.id);
                return (
                  <div
                    key={camp.id}
                    style={{
                      background: isSelected ? 'rgba(6, 95, 70, 0.05)' : 'var(--color-surface)',
                      border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                      borderRadius: 12,
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    {/* Left: Checkbox + Info */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1, minWidth: 280 }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectCampaign(camp.id)}
                        style={{ marginTop: 4, width: 17, height: 17, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                        title="Select campaign"
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              padding: '2px 8px',
                              borderRadius: 4,
                              background: isSent ? '#ecfdf5' : '#fef3c7',
                              color: isSent ? '#065f46' : '#92400e',
                              border: '1px solid ' + (isSent ? '#a7f3d0' : '#fde68a'),
                            }}
                          >
                            {camp.status}
                          </span>
                          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                            Audience: <strong>{camp.audienceName}</strong> ({camp.recipientCount} senders)
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>
                          {camp.title}
                        </h3>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <span>Subject: <em>"{camp.subject}"</em></span>
                          <span>•</span>
                          <span>Created: {new Date(camp.createdAt).toLocaleDateString()}</span>
                          {camp.sentAt && (
                            <>
                              <span>•</span>
                              <span style={{ color: '#16a34a', fontWeight: 600 }}>Sent: {new Date(camp.sentAt).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Delivery Stats (if sent) */}
                    {isSent && (
                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', background: 'var(--color-surface-2)', padding: '0.5rem 1rem', borderRadius: 8 }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#16a34a' }}>{camp.sentCount}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Delivered</div>
                        </div>
                        <div style={{ width: 1, height: 28, background: 'var(--color-border)' }} />
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)' }}>{camp.openedCount || Math.round(camp.sentCount * 0.75)}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Opened</div>
                        </div>
                      </div>
                    )}

                    {/* Right: Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setPreviewCampaign(camp)}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                        title="Preview Email"
                      >
                        <Eye size={14} /> Preview
                      </button>

                      <button
                        onClick={() => handleEditCampaign(camp)}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                        title="Edit in Visual Composer"
                      >
                        <Edit3 size={14} /> Edit
                      </button>

                      <button
                        onClick={() => handleDuplicateCampaign(camp)}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                        title="Duplicate Campaign"
                      >
                        <Copy size={14} />
                      </button>

                      <button
                        onClick={() => handleLaunchCampaign(camp)}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
                      >
                        <Send size={13} /> {isSent ? 'Resend' : 'Dispatch'}
                      </button>

                      <button
                        onClick={() => handleDeleteCampaign(camp.id)}
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                        title="Delete Campaign"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ─── GRID VIEW ─── */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
              {paginatedCampaigns.map((camp) => {
                const isSent = camp.status === 'sent';
                const isSelected = selectedCampaignIds.has(camp.id);
                return (
                  <div
                    key={camp.id}
                    style={{
                      background: isSelected ? 'rgba(6, 95, 70, 0.04)' : 'var(--color-surface)',
                      border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                      borderRadius: 12,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Header bar with Checkbox */}
                    <div style={{ background: camp.template.bannerBg || '#090d10', color: 'white', padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectCampaign(camp.id)}
                          style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                        />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 4, background: isSent ? '#16a34a' : '#d97706' }}>
                          {camp.status}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>
                        {camp.recipientCount} senders
                      </span>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                        {camp.title}
                      </h3>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '0 0 1rem 0', lineClamp: 2 }}>
                        Subject: <em>"{camp.subject}"</em>
                      </p>

                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1rem', marginTop: 'auto' }}>
                        Audience: <strong>{camp.audienceName}</strong>
                      </div>

                      {/* Action buttons grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border-light)' }}>
                        <button
                          onClick={() => setPreviewCampaign(camp)}
                          className="btn btn-outline btn-sm"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                        >
                          <Eye size={13} /> Preview
                        </button>
                        <button
                          onClick={() => handleEditCampaign(camp)}
                          className="btn btn-outline btn-sm"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleLaunchCampaign(camp)}
                          className="btn btn-primary btn-sm"
                          style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontWeight: 700 }}
                        >
                          <Send size={13} /> {isSent ? 'Resend Campaign' : 'Dispatch Campaign'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ─── CAMPAIGNS PAGINATION BAR ─── */}
          {filteredCampaigns.length > 0 && (
            <AdminPagination
              currentPage={campaignPage}
              totalItems={filteredCampaigns.length}
              itemsPerPage={campaignsPerPage}
              onPageChange={setCampaignPage}
              onItemsPerPageChange={setCampaignsPerPage}
              pageSizeOptions={[6, 12, 24, 48]}
              unitName="campaigns"
            />
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 2: SENDERS & AUDIENCES (LIST & GRID VIEW + ACTIONS + PAGINATION)
      ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'audiences' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* Audience Lists Sidebar */}
          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Audience Lists</h3>
              <button
                onClick={() => setShowNewAudienceModal(true)}
                className="btn btn-outline btn-sm"
                style={{ padding: '2px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 2 }}
              >
                <Plus size={13} /> New List
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {audiences.map(aud => {
                const isSelected = aud.id === selectedAudienceId;
                return (
                  <div
                    key={aud.id}
                    onClick={() => { setSelectedAudienceId(aud.id); setSendersPage(1); }}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 8,
                      border: '1.5px solid ' + (isSelected ? 'var(--color-primary)' : 'var(--color-border)'),
                      background: isSelected ? 'rgba(6, 95, 70, 0.08)' : 'var(--color-surface-2)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: isSelected ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>
                        {aud.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                        {aud.contacts.length} senders
                      </div>
                    </div>
                    {audiences.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteAudience(aud.id); }}
                        style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 4 }}
                        title="Delete List"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Senders / Contacts Data Table & Grid */}
          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '1.5rem' }}>
            {activeAudience && (
              <>
                {/* List Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>
                      {activeAudience.name}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                      {activeAudience.description} • {activeAudience.contacts.length} total recipients
                    </p>
                  </div>

                  {/* List Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => { setShowUploadModal(true); setUploadTargetAudienceId(activeAudience.id); }}
                      className="btn btn-outline btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Upload size={14} /> Upload CSV
                    </button>
                    <button
                      onClick={() => setShowAddContactModal(true)}
                      className="btn btn-outline btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Plus size={14} /> Add Contact
                    </button>
                    <button
                      onClick={handlePrintPdfContacts}
                      className="btn btn-outline btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      title="Print or Save contacts as PDF"
                    >
                      <Printer size={14} /> Print / PDF
                    </button>
                    <button
                      onClick={handleExportCsvContacts}
                      className="btn btn-outline btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      title="Export Contacts CSV"
                    >
                      <Download size={14} /> CSV
                    </button>
                  </div>
                </div>

                {/* Search Bar & View Switcher */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                    <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: 12, top: 11 }} />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Search senders by name, email, phone, or country…"
                      value={contactSearch}
                      onChange={e => { setContactSearch(e.target.value); setSendersPage(1); }}
                      style={{ paddingLeft: 36, width: '100%', fontSize: '0.875rem' }}
                    />
                  </div>

                  {/* Senders Grid vs List toggle */}
                  <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 6, overflow: 'hidden' }}>
                    <button
                      type="button"
                      onClick={() => setSendersViewMode('list')}
                      style={{ padding: '6px 10px', background: sendersViewMode === 'list' ? 'var(--color-primary)' : 'var(--color-surface)', color: sendersViewMode === 'list' ? 'white' : 'var(--color-text-secondary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700 }}
                      title="List View"
                    >
                      <List size={14} /> List
                    </button>
                    <button
                      type="button"
                      onClick={() => setSendersViewMode('grid')}
                      style={{ padding: '6px 10px', background: sendersViewMode === 'grid' ? 'var(--color-primary)' : 'var(--color-surface)', color: sendersViewMode === 'grid' ? 'white' : 'var(--color-text-secondary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700 }}
                      title="Grid View"
                    >
                      <LayoutGrid size={14} /> Grid
                    </button>
                  </div>
                </div>

                {/* ─── BULK ACTION BAR ─── */}
                <AdminBulkActionBar
                  selectedCount={selectedContactIds.size}
                  totalCount={filteredContacts.length}
                  onSelectAll={handleSelectAllContacts}
                  onClearSelection={handleClearContactsSelection}
                  onDeleteSelected={handleDeleteSelectedContacts}
                  onPrintPdfSelected={handlePrintPdfContacts}
                  onExportCsvSelected={handleExportCsvContacts}
                  unitName="contacts"
                />

                {/* Senders Content (List vs Grid) */}
                {filteredContacts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-secondary)' }}>
                    <p>No senders found. Click "Upload CSV" to import contacts.</p>
                  </div>
                ) : sendersViewMode === 'list' ? (
                  /* Senders Table */
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
                          <th style={{ width: 38, padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={filteredContacts.length > 0 && selectedContactIds.size === filteredContacts.length}
                              onChange={selectedContactIds.size === filteredContacts.length ? handleClearContactsSelection : handleSelectAllContacts}
                              style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                              title="Select all contacts"
                            />
                          </th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Recipient Name</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Email Address</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Phone / WhatsApp</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Country</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700, textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedContacts.map(contact => {
                          const isSelected = selectedContactIds.has(contact.id);
                          return (
                            <tr
                              key={contact.id}
                              style={{
                                borderBottom: '1px solid var(--color-border-light)',
                                background: isSelected ? 'rgba(6, 95, 70, 0.05)' : 'transparent',
                              }}
                            >
                              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelectContact(contact.id)}
                                  style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                                />
                              </td>
                              <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{contact.name}</td>
                              <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-primary)' }}>{contact.email}</td>
                              <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-text-secondary)' }}>{contact.phone || '—'}</td>
                              <td style={{ padding: '0.75rem 0.5rem' }}>{contact.country || 'Mauritius'}</td>
                              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                                <button
                                  onClick={() => {
                                    const updatedContacts = activeAudience.contacts.filter(c => c.id !== contact.id);
                                    const updated = saveAudience({ ...activeAudience, contacts: updatedContacts });
                                    setAudiences(updated);
                                  }}
                                  style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: 4 }}
                                  title="Remove sender"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Senders Grid Cards */
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                    {paginatedContacts.map(contact => {
                      const isSelected = selectedContactIds.has(contact.id);
                      return (
                        <div
                          key={contact.id}
                          style={{
                            background: isSelected ? 'rgba(6, 95, 70, 0.04)' : 'var(--color-surface-2)',
                            border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                            borderRadius: 8,
                            padding: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.35rem',
                            position: 'relative',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectContact(contact.id)}
                                style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                              />
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #065f46, #059669)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                                {contact.name.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const updatedContacts = activeAudience.contacts.filter(c => c.id !== contact.id);
                                const updated = saveAudience({ ...activeAudience, contacts: updatedContacts });
                                setAudiences(updated);
                              }}
                              style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: 2 }}
                              title="Remove sender"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: 4 }}>{contact.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', wordBreak: 'break-all' }}>{contact.email}</div>
                          {contact.phone && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{contact.phone}</div>}
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 'auto', paddingTop: 6 }}>{contact.country}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ─── SENDERS PAGINATION BAR ─── */}
                {filteredContacts.length > 0 && (
                  <AdminPagination
                    currentPage={sendersPage}
                    totalItems={filteredContacts.length}
                    itemsPerPage={sendersPerPage}
                    onPageChange={setSendersPage}
                    onItemsPerPageChange={setSendersPerPage}
                    pageSizeOptions={[10, 25, 50, 100]}
                    unitName="senders"
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 3: CAMPAIGN VISUAL COMPOSER
      ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'composer' && editingCampaign && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(420px, 1fr) minmax(460px, 1fr)', gap: '1.75rem', alignItems: 'start' }}>
          
          {/* LEFT: Composer Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Top Composer Bar */}
            <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Campaign Setup</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={handleSaveComposer} className="btn btn-outline btn-sm">
                    Save Draft
                  </button>
                  <button onClick={() => handleLaunchCampaign(editingCampaign)} className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
                    <Send size={14} /> Dispatch
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 2 }}>
                    Campaign Title (Internal Reference)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingCampaign.title}
                    onChange={e => setEditingCampaign({ ...editingCampaign, title: e.target.value })}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 2 }}>
                    Email Subject Line (Supports <code>{`{{name}}`}</code>)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingCampaign.subject}
                    onChange={e => setEditingCampaign({ ...editingCampaign, subject: e.target.value })}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 2 }}>
                    Target Audience / Sender List
                  </label>
                  <select
                    className="form-select"
                    value={editingCampaign.audienceId}
                    onChange={e => setEditingCampaign({ ...editingCampaign, audienceId: e.target.value })}
                    style={{ fontSize: '0.85rem' }}
                  >
                    {audiences.map(aud => (
                      <option key={aud.id} value={aud.id}>{aud.name} ({aud.contacts.length} recipients)</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Template Visual Blocks */}
            <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 1rem 0' }}>Content & Components</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Banner */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Header Banner Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingCampaign.template.bannerTitle}
                      onChange={e => setEditingCampaign({ ...editingCampaign, template: { ...editingCampaign.template, bannerTitle: e.target.value } })}
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Banner Color</label>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <input
                        type="color"
                        value={editingCampaign.template.bannerBg}
                        onChange={e => setEditingCampaign({ ...editingCampaign, template: { ...editingCampaign.template, bannerBg: e.target.value } })}
                        style={{ width: 34, height: 32, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        className="form-input"
                        value={editingCampaign.template.bannerBg}
                        onChange={e => setEditingCampaign({ ...editingCampaign, template: { ...editingCampaign.template, bannerBg: e.target.value } })}
                        style={{ fontSize: '0.75rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Hero Image */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Hero Banner Image URL (optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingCampaign.template.heroImageUrl || ''}
                    onChange={e => setEditingCampaign({ ...editingCampaign, template: { ...editingCampaign.template, heroImageUrl: e.target.value } })}
                    placeholder="https://..."
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>

                {/* Headline */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Main Headline</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingCampaign.template.headline}
                    onChange={e => setEditingCampaign({ ...editingCampaign, template: { ...editingCampaign.template, headline: e.target.value } })}
                    style={{ fontSize: '0.85rem', fontWeight: 700 }}
                  />
                </div>

                {/* Intro Body Text */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                    Email Body Content (Use <code>{`{{name}}`}</code>, <code>{`{{country}}`}</code>)
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    value={editingCampaign.template.introText}
                    onChange={e => setEditingCampaign({ ...editingCampaign, template: { ...editingCampaign.template, introText: e.target.value } })}
                    style={{ fontSize: '0.85rem', lineHeight: 1.5 }}
                  />
                </div>

                {/* Key Benefits Bullets */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Key Highlights / Bullet Points</label>
                    <button
                      type="button"
                      onClick={() => setEditingCampaign({
                        ...editingCampaign,
                        template: {
                          ...editingCampaign.template,
                          bulletPoints: [...editingCampaign.template.bulletPoints, 'New highlighted benefit'],
                        },
                      })}
                      style={{ fontSize: '0.75rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                    >
                      + Add Item
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {editingCampaign.template.bulletPoints.map((bp, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '0.4rem' }}>
                        <input
                          type="text"
                          className="form-input"
                          value={bp}
                          onChange={e => {
                            const newBullets = [...editingCampaign.template.bulletPoints];
                            newBullets[idx] = e.target.value;
                            setEditingCampaign({ ...editingCampaign, template: { ...editingCampaign.template, bulletPoints: newBullets } });
                          }}
                          style={{ fontSize: '0.8125rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newBullets = editingCampaign.template.bulletPoints.filter((_, i) => i !== idx);
                            setEditingCampaign({ ...editingCampaign, template: { ...editingCampaign.template, bulletPoints: newBullets } });
                          }}
                          style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '0 4px' }}
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary CTA */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Button Text</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingCampaign.template.ctaText}
                      onChange={e => setEditingCampaign({ ...editingCampaign, template: { ...editingCampaign.template, ctaText: e.target.value } })}
                      style={{ fontSize: '0.8125rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Target URL</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingCampaign.template.ctaUrl}
                      onChange={e => setEditingCampaign({ ...editingCampaign, template: { ...editingCampaign.template, ctaUrl: e.target.value } })}
                      style={{ fontSize: '0.8125rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Color</label>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <input
                        type="color"
                        value={editingCampaign.template.ctaBgColor}
                        onChange={e => setEditingCampaign({ ...editingCampaign, template: { ...editingCampaign.template, ctaBgColor: e.target.value } })}
                        style={{ width: 32, height: 32, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </div>

                {/* WhatsApp & Footer Toggles */}
                <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-light)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={editingCampaign.template.showWhatsAppButton}
                      onChange={e => setEditingCampaign({ ...editingCampaign, template: { ...editingCampaign.template, showWhatsAppButton: e.target.checked } })}
                    />
                    Include WhatsApp Button
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={editingCampaign.template.showFooter}
                      onChange={e => setEditingCampaign({ ...editingCampaign, template: { ...editingCampaign.template, showFooter: e.target.checked } })}
                    />
                    Include Footer & Disclaimer
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Live Real-Time Campaign Preview & Test Dispatch */}
          <div style={{ position: 'sticky', top: 'calc(var(--navbar-height, 70px) + 1.5rem)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Preview Toolbar */}
            <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '0.75rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={16} color="var(--color-primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Live Campaign Preview</span>
              </div>

              {/* Viewport switch */}
              <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 6, overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setComposerPreviewMode('desktop')}
                  style={{ padding: '4px 8px', background: composerPreviewMode === 'desktop' ? 'var(--color-primary)' : 'var(--color-surface)', color: composerPreviewMode === 'desktop' ? 'white' : 'var(--color-text-secondary)', border: 'none', cursor: 'pointer' }}
                  title="Desktop Preview"
                >
                  <Monitor size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setComposerPreviewMode('mobile')}
                  style={{ padding: '4px 8px', background: composerPreviewMode === 'mobile' ? 'var(--color-primary)' : 'var(--color-surface)', color: composerPreviewMode === 'mobile' ? 'white' : 'var(--color-text-secondary)', border: 'none', cursor: 'pointer' }}
                  title="Mobile Preview"
                >
                  <Smartphone size={15} />
                </button>
              </div>
            </div>

            {/* Subject display */}
            <div style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '0.6rem 1rem', fontSize: '0.8125rem' }}>
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 600, marginRight: 6 }}>Subject:</span>
              <strong style={{ color: 'var(--color-text-primary)' }}>
                {editingCampaign.subject.replace(/\{\{name\}\}/g, 'Jean-Luc')}
              </strong>
            </div>

            {/* Email Container Frame */}
            <div
              style={{
                background: '#cbd5e1',
                padding: '1.5rem 1rem',
                borderRadius: 12,
                border: '1.5px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'center',
                maxHeight: 520,
                overflowY: 'auto',
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: composerPreviewMode === 'desktop' ? 580 : 380,
                  transition: 'max-width 0.25s ease',
                }}
                dangerouslySetInnerHTML={{
                  __html: renderCampaignHtml(editingCampaign, { name: 'Jean-Luc', country: 'Mauritius' }),
                }}
              />
            </div>

            {/* Quick Test Email Section */}
            <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                ⚡ Dispatch Test Preview to Your Inbox
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  className="form-input"
                  value={testEmailAddress}
                  onChange={e => setTestEmailAddress(e.target.value)}
                  placeholder="your-email@example.com"
                  style={{ flex: 1, fontSize: '0.85rem' }}
                />
                <button
                  type="button"
                  onClick={handleSendTestComposer}
                  disabled={sendingTest}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, whiteSpace: 'nowrap' }}
                >
                  <Send size={14} /> {sendingTest ? 'Sending…' : 'Send Test'}
                </button>
              </div>

              {testResult && (
                <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.85rem', borderRadius: 6, fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', background: testResult.success ? '#ecfdf5' : '#fef2f2', border: '1px solid ' + (testResult.success ? '#a7f3d0' : '#fecaca'), color: testResult.success ? '#065f46' : '#991b1b' }}>
                  {testResult.success ? <CheckCircle2 size={16} color="#059669" /> : <AlertCircle size={16} color="#dc2626" />}
                  {testResult.message}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 1: UPLOAD SENDERS (CSV / DRAG & DROP)
      ══════════════════════════════════════════════════════════════════════════ */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--color-surface)', width: '100%', maxWidth: 640, borderRadius: 16, border: '1.5px solid var(--color-border)', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={20} color="var(--color-primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Upload Senders & Contacts</h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                Target Audience List
              </label>
              <select
                className="form-select"
                value={uploadTargetAudienceId}
                onChange={e => setUploadTargetAudienceId(e.target.value)}
                style={{ width: '100%' }}
              >
                {audiences.map(aud => (
                  <option key={aud.id} value={aud.id}>{aud.name} ({aud.contacts.length} existing senders)</option>
                ))}
              </select>
            </div>

            {/* Dropzone File Upload */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--color-primary)',
                borderRadius: 12,
                padding: '2rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(6, 95, 70, 0.04)',
                marginBottom: '1.25rem',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv,text/plain"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <FileText size={36} color="var(--color-primary)" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontWeight: 700, margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>
                Click to browse CSV file or drag and drop here
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Supports standard CSV with columns: <code>Name, Email, Phone, Country</code>
              </p>
            </div>

            {/* Or Paste Raw Text */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
                Or paste CSV / emails directly:
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Jean Dupont, jean@example.com, +230 51234567, Mauritius&#10;Ananya Patel, ananya@example.mu"
                value={csvRawText}
                onChange={e => {
                  setCsvRawText(e.target.value);
                  setParsedPreviewContacts(parseCSVContacts(e.target.value));
                }}
                style={{ fontSize: '0.8125rem', fontFamily: 'monospace' }}
              />
            </div>

            {/* Parsed Preview Counter */}
            {parsedPreviewContacts.length > 0 && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.25rem', fontSize: '0.8125rem', color: '#065f46' }}>
                <strong>✓ {parsedPreviewContacts.length} valid contacts ready to import</strong>
                <div style={{ marginTop: 4, maxHeight: 90, overflowY: 'auto' }}>
                  {parsedPreviewContacts.slice(0, 5).map((c, i) => (
                    <div key={i}>{c.name} ({c.email}) - {c.country}</div>
                  ))}
                  {parsedPreviewContacts.length > 5 && <div>…and {parsedPreviewContacts.length - 5} more.</div>}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setShowUploadModal(false)} className="btn btn-outline">
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={parsedPreviewContacts.length === 0}
                className="btn btn-primary"
                style={{ fontWeight: 700 }}
              >
                Import {parsedPreviewContacts.length} Senders
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 2: CREATE NEW AUDIENCE LIST
      ══════════════════════════════════════════════════════════════════════════ */}
      {showNewAudienceModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--color-surface)', width: '100%', maxWidth: 500, borderRadius: 16, border: '1.5px solid var(--color-border)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Create Audience List</h3>
              <button onClick={() => setShowNewAudienceModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: 4 }}>List Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. VIP Oncology Leads 2026"
                  value={newAudienceName}
                  onChange={e => setNewAudienceName(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: 4 }}>Description</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Patients seeking specialized chemotherapy or surgical oncology"
                  value={newAudienceDesc}
                  onChange={e => setNewAudienceDesc(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setShowNewAudienceModal(false)} className="btn btn-outline">Cancel</button>
              <button onClick={handleCreateAudience} disabled={!newAudienceName.trim()} className="btn btn-primary" style={{ fontWeight: 700 }}>
                Create List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 3: ADD SINGLE CONTACT
      ══════════════════════════════════════════════════════════════════════════ */}
      {showAddContactModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--color-surface)', width: '100%', maxWidth: 480, borderRadius: 16, border: '1.5px solid var(--color-border)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Add Contact to {activeAudience?.name}</h3>
              <button onClick={() => setShowAddContactModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: 4 }}>Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Jean Dupont"
                  value={newContactName}
                  onChange={e => setNewContactName(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: 4 }}>Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. jean@example.com"
                  value={newContactEmail}
                  onChange={e => setNewContactEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: 4 }}>Phone / WhatsApp</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. +230 59188275"
                  value={newContactPhone}
                  onChange={e => setNewContactPhone(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: 4 }}>Country</label>
                <input
                  type="text"
                  className="form-input"
                  value={newContactCountry}
                  onChange={e => setNewContactCountry(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setShowAddContactModal(false)} className="btn btn-outline">Cancel</button>
              <button onClick={handleAddSingleContact} disabled={!newContactEmail} className="btn btn-primary" style={{ fontWeight: 700 }}>
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 4: STANDALONE CAMPAIGN PREVIEW
      ══════════════════════════════════════════════════════════════════════════ */}
      {previewCampaign && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
          <div style={{ background: 'var(--color-surface)', width: '100%', maxWidth: 650, borderRadius: 16, border: '1.5px solid var(--color-border)', padding: '1.5rem', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 2px 0' }}>{previewCampaign.title}</h3>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Subject: {previewCampaign.subject}</span>
              </div>
              <button onClick={() => setPreviewCampaign(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', background: '#cbd5e1', padding: '1rem', borderRadius: 8 }}>
              <div dangerouslySetInnerHTML={{ __html: renderCampaignHtml(previewCampaign, { name: 'Jean-Luc Marie', country: 'Mauritius' }) }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button onClick={() => setPreviewCampaign(null)} className="btn btn-outline">Close</button>
              <button
                onClick={() => {
                  const c = previewCampaign;
                  setPreviewCampaign(null);
                  handleLaunchCampaign(c);
                }}
                className="btn btn-primary"
                style={{ fontWeight: 700 }}
              >
                <Send size={14} /> Dispatch Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 5: DISPATCH PROGRESS MODAL
      ══════════════════════════════════════════════════════════════════════════ */}
      {dispatchingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
          <div style={{ background: 'var(--color-surface)', width: '100%', maxWidth: 520, borderRadius: 16, border: '1.5px solid var(--color-border)', padding: '2rem', textAlign: 'center' }}>
            
            {!dispatchingModal.isDone ? (
              <>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(6, 95, 70, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <Send size={28} className="animate-pulse" />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                  Dispatching Broadcast…
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Sending campaign to <strong>{dispatchingModal.total}</strong> recipients via Resend API.
                </p>

                {/* Progress bar */}
                <div style={{ background: 'var(--color-surface-2)', height: 12, borderRadius: 999, overflow: 'hidden', marginBottom: '0.75rem', border: '1px solid var(--color-border)' }}>
                  <div
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #065f46, #10b981)',
                      width: `${Math.round((dispatchingModal.sent / (dispatchingModal.total || 1)) * 100)}%`,
                      transition: 'width 0.2s ease',
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {dispatchingModal.sent} of {dispatchingModal.total} sent ({Math.round((dispatchingModal.sent / (dispatchingModal.total || 1)) * 100)}%)
                </div>
              </>
            ) : (
              <>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                  Campaign Broadcast Complete!
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Successfully delivered to <strong>{dispatchingModal.sent}</strong> recipients in the audience list.
                </p>

                {dispatchingModal.errors.length > 0 && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: 8, fontSize: '0.75rem', color: '#991b1b', textAlign: 'left', marginBottom: '1.25rem', maxHeight: 100, overflowY: 'auto' }}>
                    <strong>Note:</strong> Some addresses had issues:
                    {dispatchingModal.errors.map((err, i) => <div key={i}>{err}</div>)}
                  </div>
                )}

                <button
                  onClick={() => {
                    setDispatchingModal(null);
                    setActiveTab('campaigns');
                  }}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', fontWeight: 700 }}
                >
                  View Campaigns
                </button>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
