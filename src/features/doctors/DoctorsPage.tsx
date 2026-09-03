import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Award, Building2, Stethoscope, Star, Globe, MessageCircle, ArrowRight, CheckCircle2, Shield, HeartPulse } from 'lucide-react';
import { useDoctors } from '../../hooks/useDoctors';
import { useSpecialties } from '../../hooks/useSpecialties';
import { useHospitals } from '../../hooks/useHospitals';
import { useCMS } from '../../hooks/useCMS';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { SEO } from '../../components/SEO/SEO';
import { DoctorSecondOpinionModal } from './DoctorSecondOpinionModal';
import { ListToolbar, type SortOption } from '../../components/ListToolbar/ListToolbar';
import { Pagination } from '../../components/Pagination/Pagination';
import type { Doctor } from '../../core/types';

export function DoctorsPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedHospital, setSelectedHospital] = useState<string>('all');
  const [secondOpinionDoctor, setSecondOpinionDoctor] = useState<Doctor | null>(null);
  const { doctors, loading } = useDoctors(selectedSpecialty === 'all' ? undefined : selectedSpecialty);
  const { specialties } = useSpecialties();
  const { hospitals } = useHospitals({});
  const { data: cms } = useCMS('doctors');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';
  const l10n = (fr: string, kr: string, en: string) => i18n.language === 'fr' ? fr : i18n.language === 'kr' ? kr : en;
  const l = (obj: any, field: string) => obj?.[`${field}_${i18n.language}`] || obj?.[field] || '';

  const tCms = (key: string, fallback: string) => {
    if (!cms?.content?.[key]) return fallback;
    return cms.content[key][i18n.language] || cms.content[key]['en'] || fallback;
  };

  const [sortBy, setSortBy] = useState<string>('surgeries');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const sortOptions: SortOption[] = [
    { value: 'surgeries', label: isFr ? 'Interventions Réussies' : isKr ? 'Loperasion A-sikse' : 'Surgeries Done', icon: '🏆' },
    { value: 'experience', label: isFr ? 'Années d\'Expérience' : isKr ? 'Lannen Eksperyans' : 'Years Experience', icon: '⚡' },
    { value: 'name', label: isFr ? 'Nom (A-Z)' : isKr ? 'Nom (A-Z)' : 'Name (A-Z)', icon: '🔤' },
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const matchHospital = selectedHospital === 'all' || doc.hospitalId === selectedHospital;
    if (!searchQuery.trim()) return matchHospital;
    const q = searchQuery.toLowerCase();
    const nameMatch = doc.name.toLowerCase().includes(q);
    const titleMatch = l(doc, 'title').toLowerCase().includes(q) || doc.title.toLowerCase().includes(q);
    const bioMatch = l(doc, 'bio').toLowerCase().includes(q) || doc.bio.toLowerCase().includes(q);
    return matchHospital && (nameMatch || titleMatch || bioMatch);
  });

  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (sortBy === 'surgeries') return (b.surgeries || 0) - (a.surgeries || 0);
    if (sortBy === 'experience') return (b.experience || 0) - (a.experience || 0);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const paginatedDoctors = sortedDoctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getHospital = (hId: string) => hospitals.find(h => h.id === hId);
  const getSpecialtyName = (sId: string) => {
    const s = specialties.find(item => item.id === sId);
    return s ? l(s, 'name') : sId;
  };

  return (
    <main className="doctors-page" style={{ paddingTop: 'var(--navbar-height)' }}>
      <SEO
        title={l10n('Nos 7 Spécialistes Médicaux d\'Élite', 'Nou 7 Sef Dokter Spesialist', 'Our 7 Elite Medical Specialists')}
        description={l10n(
          'Découvrez nos 7 chirurgiens et spécialistes de réputation mondiale au service des patients mauriciens.',
          'Dekouver nou 7 sef sirizien ek dokter klas mondial pou bann pasian Morisien.',
          'Discover our 7 world-leading medical surgeons and specialists assisting Mauritian patients.'
        )}
        canonical="/doctors"
      />

      {/* Hero Banner */}
      <section className="page-hero--banner" style={{ backgroundImage: 'url(/assets/banners/doctors_banner.jpg)' }}>
        <div className="container page-hero__inner">
          <span className="section-label">
            {tCms('heroLabel', l10n('Spécialistes de Renom Mondial', 'Dokter Klas Mondial', 'World-Renowned Specialists'))}
          </span>
          <h1 className="text-h1">
            {tCms('heroTitle', l10n('Nos 7 Chirurgiens et Médecins d\'Élite', 'Nou 7 Dokter ek Sirizien Spesialist', 'Our 7 Elite Medical Specialists'))}
          </h1>
          <p className="text-lead">
            {tCms('heroDesc', l10n(
              'Découvrez notre réseau exclusif de 7 chirurgiens et consultants de premier plan ayant réalisé plus de 100 000 interventions réussies.',
              'Dekouver nou rezo seleksione de 7 dokter ek sirizien klas mondial ki finn fer plis ki 100 000 loperasion a-sikse.',
              'Meet our handpicked network of 7 world-leading medical surgeons and consultants who have performed over 100,000 successful surgeries combined.'
            ))}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section" style={{ paddingBottom: '5rem' }}>
        <div className="container">
          {/* Trust Banner */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem 1.75rem',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.12)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Award size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '0.95rem', display: 'block' }}>
                  {tCms('trustBadgeText', l10n('Avis Médical Direct & Deuxième Avis Sous 48h', 'Konsiltasion Direk ek Deziem Lavi Disponib', 'Direct Consultation & Second Opinion Available'))}
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {l10n('Comptes-rendus examinés directement par les chefs de département', 'Dosie medikal get direk par sef dokter', 'Reports reviewed directly by surgical department heads')}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('/cost-calculator')}
              className="btn btn-outline btn-sm"
              style={{ fontWeight: 700 }}
            >
              {l10n('Calculer les Coûts', 'Kalkil Pri', 'Compare Treatment Costs')} →
            </button>
          </div>

          {/* List Toolbar with Search, Specialty Pill, Hospital Pill, Sort By, Count & View Switcher */}
          {!loading && (
            <ListToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder={l10n('Rechercher un médecin...', 'Rod enn dokter...', 'Search specialists...')}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortOptions={sortOptions}
              totalCount={sortedDoctors.length}
              countUnit={isFr ? 'spécialiste' : isKr ? 'spesialist' : 'specialist'}
              countUnitPlural={isFr ? 'spécialistes' : isKr ? 'spesialist' : 'specialists'}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              extraControls={
                <>
                  {/* Specialty Filter Pill */}
                  <div className="list-toolbar__filter-pill">
                    <select
                      className="list-toolbar__filter-select"
                      value={selectedSpecialty}
                      onChange={e => setSelectedSpecialty(e.target.value)}
                    >
                      <option value="all">{l10n('🩺 Toutes les Spécialités', '🩺 Tou Spesialite', '🩺 All Specialties')}</option>
                      {specialties.map(s => (
                        <option key={s.id} value={s.id}>{l(s, 'name')}</option>
                      ))}
                    </select>
                  </div>

                  {/* Hospital Filter Pill */}
                  <div className="list-toolbar__filter-pill">
                    <select
                      className="list-toolbar__filter-select"
                      value={selectedHospital}
                      onChange={e => setSelectedHospital(e.target.value)}
                    >
                      <option value="all">{l10n('🏥 Tous les Hôpitaux', '🏥 Tou Lopital', '🏥 All Hospitals')}</option>
                      {hospitals.map(h => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Clear Active Filters */}
                  {(searchQuery || selectedSpecialty !== 'all' || selectedHospital !== 'all') && (
                    <button
                      type="button"
                      className="list-toolbar__clear-btn"
                      onClick={() => { setSearchQuery(''); setSelectedSpecialty('all'); setSelectedHospital('all'); }}
                    >
                      ↺ {l10n('Effacer', 'Efase', 'Clear')}
                    </button>
                  )}
                </>
              }
            />
          )}

          {/* Doctors Grid / List */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 420, borderRadius: 16 }} />
              ))}
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'list' ? '1fr' : 'repeat(auto-fill, minmax(330px, 1fr))',
                gap: '1.75rem',
              }}>
                {paginatedDoctors.map(doc => {
                  const hosp = getHospital(doc.hospitalId);
                  return (
                    <div
                      key={doc.id}
                      style={{
                        background: 'var(--color-surface)',
                        border: '1.5px solid var(--color-border)',
                        borderRadius: 'var(--radius-xl)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                      }}
                    >
                      {/* Doctor Photo Banner */}
                      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                        <img
                          src={doc.imageUrl}
                          alt={doc.name}
                          onError={(e) => { e.currentTarget.src = '/assets/banners/doctors_banner.jpg'; }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                        }} />
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                          <span className="badge badge-accent" style={{ fontSize: '0.75rem' }}>
                            <Shield size={12} /> {doc.experience}+ Years Exp.
                          </span>
                        </div>
                        <div style={{ position: 'absolute', bottom: '1rem', left: '1.25rem', right: '1.25rem', color: 'white' }}>
                          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{doc.name}</h2>
                          <p style={{ fontSize: '0.8125rem', opacity: 0.9, color: 'var(--color-accent)' }}>
                            {doc.title}
                          </p>
                        </div>
                      </div>

                      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Hospital Link */}
                        {hosp && (
                          <Link
                            to={`/hospitals/${hosp.id}`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              color: 'var(--color-primary)',
                              textDecoration: 'none',
                            }}
                          >
                            <Building2 size={14} />
                            <span>{hosp.name} · {hosp.city}, {hosp.country}</span>
                          </Link>
                        )}

                        {/* Specialties tags */}
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {doc.specialties.map(sId => (
                            <span key={sId} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                              {getSpecialtyName(sId)}
                            </span>
                          ))}
                        </div>

                        {/* Bio */}
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                          {doc.bio}
                        </p>

                        {/* Credentials */}
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                          <strong>Credentials:</strong> {doc.qualifications.join(' · ')}
                        </div>

                        {/* CTAs */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ flex: 1, fontWeight: 700 }}
                            onClick={() => setSecondOpinionDoctor(doc)}
                          >
                            <Stethoscope size={14} />
                            <span>{l10n('2ème Avis Gratuit', '2em Lavi Medikal', '2nd Opinion')}</span>
                          </button>
                          <a
                            href={buildMed360WhatsAppUrl(`Bonjour Medical 360, je souhaite consulter ${doc.name}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-whatsapp btn-sm btn-icon"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle size={16} />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalItems={sortedDoctors.length}
                itemsPerPage={itemsPerPage}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                onItemsPerPageChange={setItemsPerPage}
                pageSizeOptions={[6, 9, 15]}
                unitName={isFr ? 'spécialistes' : isKr ? 'spesialist' : 'specialists'}
              />
            </>
          )}
        </div>
      </section>

      {/* Direct Second Opinion Modal */}
      {secondOpinionDoctor && (
        <DoctorSecondOpinionModal
          doctor={secondOpinionDoctor}
          hospital={getHospital(secondOpinionDoctor.hospitalId)}
          onClose={() => setSecondOpinionDoctor(null)}
        />
      )}
    </main>
  );
}
