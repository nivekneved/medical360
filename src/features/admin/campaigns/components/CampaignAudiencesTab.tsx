import React, { useState } from 'react';
import {
  Users,
  Plus,
  Upload,
  Trash2,
  CheckCircle2,
  Search,
  Download,
  FileText,
} from 'lucide-react';
import {
  AudienceList,
  Contact,
  parseCSVContacts,
} from '../../../../core/services/campaign.service';

interface CampaignAudiencesTabProps {
  audiences: AudienceList[];
  selectedAudienceId: string;
  setSelectedAudienceId: (id: string) => void;
  onSaveAudience: (aud: AudienceList) => void;
  onDeleteAudience: (id: string) => void;
  onNotify: (text: string) => void;
}

export const CampaignAudiencesTab: React.FC<CampaignAudiencesTabProps> = ({
  audiences,
  selectedAudienceId,
  setSelectedAudienceId,
  onSaveAudience,
  onDeleteAudience,
  onNotify,
}) => {
  const [showNewAudienceForm, setShowNewAudienceForm] = useState(false);
  const [newAudienceName, setNewAudienceName] = useState('');
  const [newAudienceDesc, setNewAudienceDesc] = useState('');

  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactCountry, setNewContactCountry] = useState('Mauritius');

  const [showCsvImportCard, setShowCsvImportCard] = useState(false);
  const [csvRawText, setCsvRawText] = useState('');
  const [contactSearch, setContactSearch] = useState('');

  const activeAudience = audiences.find(a => a.id === selectedAudienceId) || audiences[0];

  const handleCreateAudience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAudienceName.trim()) return;
    const newAud: AudienceList = {
      id: `aud-${Date.now()}`,
      name: newAudienceName.trim(),
      description: newAudienceDesc.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contacts: [],
    };
    onSaveAudience(newAud);
    setSelectedAudienceId(newAud.id);
    setNewAudienceName('');
    setNewAudienceDesc('');
    setShowNewAudienceForm(false);
    onNotify(`Audience list "${newAud.name}" created.`);
  };

  const handleAddSingleContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAudience || !newContactEmail.trim()) return;

    const contact: Contact = {
      id: `cnt-${Date.now()}`,
      name: newContactName.trim() || 'Patient',
      email: newContactEmail.trim(),
      phone: newContactPhone.trim() || undefined,
      country: newContactCountry.trim() || 'Mauritius',
      addedAt: new Date().toISOString(),
    };

    const updatedAudience: AudienceList = {
      ...activeAudience,
      contacts: [...activeAudience.contacts, contact],
    };
    onSaveAudience(updatedAudience);
    setNewContactName('');
    setNewContactEmail('');
    setNewContactPhone('');
    setShowAddContactForm(false);
    onNotify(`Added contact "${contact.name}" to ${activeAudience.name}.`);
  };

  const handleImportCsv = () => {
    if (!activeAudience || !csvRawText.trim()) return;
    const parsed = parseCSVContacts(csvRawText);
    if (parsed.length === 0) {
      alert('No valid contacts found in CSV input.');
      return;
    }

    const updatedAudience: AudienceList = {
      ...activeAudience,
      contacts: [...activeAudience.contacts, ...parsed],
    };
    onSaveAudience(updatedAudience);
    setCsvRawText('');
    setShowCsvImportCard(false);
    onNotify(`Successfully imported ${parsed.length} contacts into ${activeAudience.name}.`);
  };

  const handleDeleteContact = (contactId: string) => {
    if (!activeAudience) return;
    const updatedAudience: AudienceList = {
      ...activeAudience,
      contacts: activeAudience.contacts.filter(c => c.id !== contactId),
    };
    onSaveAudience(updatedAudience);
    onNotify('Contact removed from list.');
  };

  const filteredContacts = (activeAudience?.contacts || []).filter(c => {
    if (!contactSearch.trim()) return true;
    const q = contactSearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.phone && c.phone.includes(q));
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1fr) minmax(360px, 2.5fr)', gap: '1.5rem', alignItems: 'start' }}>
      {/* Left Column: Audiences Sidebar */}
      <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: 0 }}>
            Audience Segments ({audiences.length})
          </h3>
          <button
            type="button"
            onClick={() => setShowNewAudienceForm(!showNewAudienceForm)}
            className="btn btn-outline btn-sm"
            style={{ padding: '2px 8px', fontSize: '0.75rem' }}
          >
            <Plus size={13} /> New List
          </button>
        </div>

        {showNewAudienceForm && (
          <form onSubmit={handleCreateAudience} style={{ background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="List name (e.g. VIP Triage)"
              value={newAudienceName}
              onChange={e => setNewAudienceName(e.target.value)}
              style={{ fontSize: '0.85rem' }}
              required
            />
            <input
              type="text"
              className="form-input"
              placeholder="Optional description"
              value={newAudienceDesc}
              onChange={e => setNewAudienceDesc(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            />
            <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end', marginTop: 4 }}>
              <button type="button" onClick={() => setShowNewAudienceForm(false)} className="btn btn-outline btn-sm" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>Create</button>
            </div>
          </form>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {audiences.map(aud => {
            const isActive = aud.id === selectedAudienceId;
            return (
              <button
                key={aud.id}
                type="button"
                onClick={() => setSelectedAudienceId(aud.id)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1.5px solid',
                  borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
                  background: isActive ? 'color-mix(in srgb, var(--color-primary) 8%, transparent)' : 'var(--color-surface-2)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>{aud.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{aud.contacts.length} recipients</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Contacts in Active Audience */}
      <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
        {activeAudience ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  {activeAudience.name}
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  {activeAudience.description || 'Audience subscriber list'} · {activeAudience.contacts.length} total subscribers
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setShowCsvImportCard(!showCsvImportCard)}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Upload size={14} /> Import CSV
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddContactForm(!showAddContactForm)}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Plus size={14} /> Add Contact
                </button>
              </div>
            </div>

            {/* Inline Add Contact Form */}
            {showAddContactForm && (
              <form onSubmit={handleAddSingleContact} style={{ background: 'var(--color-surface-2)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.25rem', border: '1.5px solid var(--color-primary)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 0.75rem 0' }}>Add Subscriber</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <input type="text" className="form-input" placeholder="Patient Full Name" value={newContactName} onChange={e => setNewContactName(e.target.value)} required />
                  <input type="email" className="form-input" placeholder="Email Address *" value={newContactEmail} onChange={e => setNewContactEmail(e.target.value)} required />
                  <input type="text" className="form-input" placeholder="Phone / WhatsApp" value={newContactPhone} onChange={e => setNewContactPhone(e.target.value)} />
                  <input type="text" className="form-input" placeholder="Country" value={newContactCountry} onChange={e => setNewContactCountry(e.target.value)} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button type="button" onClick={() => setShowAddContactForm(false)} className="btn btn-outline btn-sm">Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">Add Subscriber</button>
                </div>
              </form>
            )}

            {/* Inline CSV Import Card */}
            {showCsvImportCard && (
              <div style={{ background: 'var(--color-surface-2)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.25rem', border: '1.5px solid var(--color-primary)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Paste or Upload CSV Data</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0 0 0.75rem 0' }}>
                  Format: <code>Name, Email, Phone, Country</code> (one contact per line)
                </p>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder={`Jean-Luc Marie, jeanluc@example.mu, +230 59188275, Mauritius\nAmina Begum, amina@example.mu, +230 57123456, Mauritius`}
                  value={csvRawText}
                  onChange={e => setCsvRawText(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '0.8rem', marginBottom: '0.75rem' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button type="button" onClick={() => setShowCsvImportCard(false)} className="btn btn-outline btn-sm">Cancel</button>
                  <button type="button" onClick={handleImportCsv} className="btn btn-primary btn-sm">Process & Import CSV</button>
                </div>
              </div>
            )}

            {/* Search Box */}
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                placeholder="Search subscribers in this list..."
                value={contactSearch}
                onChange={e => setContactSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.2rem', height: 36, fontSize: '0.85rem' }}
              />
            </div>

            {/* Contacts Table */}
            <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                <thead>
                  <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.725rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Subscriber</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Email</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Phone</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Country</th>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        No subscribers found in this audience list.
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map(cnt => (
                      <tr key={cnt.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>{cnt.name}</td>
                        <td style={{ padding: '0.65rem 0.75rem' }}>{cnt.email}</td>
                        <td style={{ padding: '0.65rem 0.75rem', color: 'var(--color-text-muted)' }}>{cnt.phone || '—'}</td>
                        <td style={{ padding: '0.65rem 0.75rem' }}>{cnt.country || 'Mauritius'}</td>
                        <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteContact(cnt.id)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: 2 }}
                            title="Remove subscriber"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>Select an audience list on the left.</p>
        )}
      </div>
    </div>
  );
};
