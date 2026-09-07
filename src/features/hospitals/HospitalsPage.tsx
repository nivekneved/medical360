import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Shield, ArrowRight, Scale, CheckSquare, Square, X, HelpCircle, Sparkles, Building2 } from 'lucide-react';
import { useHospitals } from '../../hooks/useHospitals';
import { useTranslation } from 'react-i18next';
import { formatNumber, truncateText } from '../../core/services/format.service';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import type { HospitalFilters } from '../../core/services/hospital.service';
import { SEO } from '../../components/SEO/SEO';
import { useCMS } from '../../hooks/useCMS';
import { HospitalCompareModal } from './HospitalCompareModal';
import { ListToolbar, type SortOption } from '../../components/ListToolbar/ListToolbar';
import { Pagination } from '../../components/Pagination/Pagination';
import './Hospitals.css';

const INDIAN_HUBS = [
  { id: 'all', label: 'All Cities & Hubs', label_fr: 'Toutes les Villes', label_kr: 'Tou Lavil' },
  { id: 'Chennai', label: 'Chennai', label_fr: 'Chennai', label_kr: 'Chennai' },
  { id: 'Bengaluru', label: 'Bengaluru', label_fr: 'Bengaluru', label_kr: 'Bengaluru' },
  { id: 'Hyderabad', label: 'Hyderabad & Secunderabad', label_fr: 'Hyderabad & Secunderabad', label_kr: 'Hyderabad' },
  { id: 'Mumbai', label: 'Mumbai', label_fr: 'Mumbai', label_kr: 'Mumbai' },
  { id: 'Delhi', label: 'New Delhi & Gurugram (NCR)', label_fr: 'New Delhi & Gurugram (NCR)', label_kr: 'New Delhi & Gurugram' },
];

export function HospitalsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<HospitalFilters>({});
  const [searchInput, setSearchInput] = useState('');
  const [selectedHub, setSelectedHub] = useState('all');
  const [showCompareModal, setShowCompareModal] = useState(false);
  const compareSectionRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const { hospitals: allHospitals, loading } = useHospitals({});
  const { data: cms } = useCMS('hospitals');

  useEffect(() => {
    if (showCompareModal && compareSectionRef.current) {
      compareSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showCompareModal]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';
  const l10n = (fr: string, kr: string, en: string) => i18n.language === 'fr' ? fr : i18n.language === 'kr' ? kr : en;
  const l = (obj: any, field: string) => obj[`${field}_${i18n.language}`] || obj[field];

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 3) {
        alert(isFr ? 'Vous pouvez comparer jusqu\'à 3 hôpitaux simultanément.' : 'You can compare up to 3 hospitals at a time.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const comparedHospitals = allHospitals.filter(h => compareIds.includes(h.id));

  // Filter hospitals by search and hub
  const filteredHospitals = allHospitals.filter((h) => {
    // Hub filter
    if (selectedHub !== 'all') {
      const cityLower = (h.city || '').toLowerCase();
      if (selectedHub === 'Delhi' && !cityLower.includes('delhi') && !cityLower.includes('gurugram')) return false;
      if (selectedHub === 'Chennai' && !cityLower.includes('chennai')) return false;
      if (selectedHub === 'Bengaluru' && !cityLower.includes('bengaluru')) return false;
      if (selectedHub === 'Hyderabad' && !cityLower.includes('hyderabad') && !cityLower.includes('secunderabad')) return false;
      if (selectedHub === 'Mumbai' && !cityLower.includes('mumbai')) return false;
    }

    // Search query
    if (searchInput.trim()) {
      const q = searchInput.toLowerCase().trim();
      const matchName = l(h, 'name')?.toLowerCase().includes(q) || h.name?.toLowerCase().includes(q);
      const matchCity = h.city?.toLowerCase().includes(q);
      const matchDesc = l(h, 'description')?.toLowerCase().includes(q);
      const matchAcc = h.accreditations?.some(a => a.toLowerCase().includes(q));
      if (!matchName && !matchCity && !matchDesc && !matchAcc) return false;
    }

    return true;
  });

  // Sort hospitals
  const sortedHospitals = [...filteredHospitals].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'beds') return (b.bedsCount || 0) - (a.bedsCount || 0);
    if (sortBy === 'patients') return (b.internationalPatientsPerYear || 0) - (a.internationalPatientsPerYear || 0);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const paginatedHospitals = sortedHospitals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const sortOptions: SortOption[] = [
    { value: 'rating', label: isFr ? 'Meilleure Note' : isKr ? 'Mayer Not' : 'Highest Rated', icon: '★' },
    { value: 'beds', label: isFr ? 'Capacité Lits' : isKr ? 'Lili Lopital' : 'Bed Capacity', icon: '🛏️' },
    { value: 'patients', label: isFr ? 'Patients Intl' : isKr ? 'Pasian Intl' : 'Intl Patients', icon: '👥' },
    { value: 'name', label: isFr ? 'Nom (A-Z)' : isKr ? 'Nom (A-Z)' : 'Name (A-Z)', icon: '🔤' },
  ];

  return (
    <main className="hospitals-page" style={{ paddingTop: 'var(--navbar-height)' }}>
      <SEO 
        title="Premier Partner Hospitals in India | Medical 360"
        description="Explore 15 premier JCI & NABH accredited hospitals across India (Chennai, Bengaluru, Hyderabad, Mumbai, Delhi NCR) partnered with Medical 360."
        canonical="/hospitals"
      />
      {/* Header Banner */}
      <section className="page-hero--banner" style={{ backgroundImage: 'url(/assets/banners/hospitals_banner.jpg)' }}>
        <div className="container page-hero__inner">
          <span className="section-label">
            {isFr ? 'Réseau Hospitalier d\'Excellence en Inde' : isKr ? 'Rezo Lopital L\'inde' : 'India Hospital Network of Excellence'}
          </span>
          <h1 className="text-h1">
            {isFr ? '15 Hôpitaux Partenaires & Équipes Spécialistes' : isKr ? '15 Gran Lopital Partener dan L\'inde' : '15 Premier Partner Hospitals Across India'}
          </h1>
          <p className="text-lead" style={{ maxWidth: '850px' }}>
            {isFr 
              ? 'Medical 360 facilite l\'accès aux centres hospitaliers et équipes chirurgicales établis à travers l\'Inde. Obtenez des avis médicaux de pointe, des plans de traitement et un accompagnement complet du premier contact jusqu\'à votre retour.'
              : isKr
              ? 'Medical 360 fasilit akse ar bann pli gran lopital ek sirizien dan L\'inde. Gagn deziem lavi medikal, devis kler ek kordinasion voyaz konple.'
              : 'Medical 360 facilitates access to established hospitals and specialist medical teams across India. Through our network, patients obtain specialist medical opinions, transparent treatment plans, and continuous patient navigation.'}
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: '2rem var(--space-6) 6rem' }}>
        
        {/* Slide 8 Intro Callout Box */}
        <div className="hospital-network-intro-card" style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderLeft: '4px solid var(--color-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Building2 size={24} color="var(--color-primary)" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
              {isFr ? 'À Propos de Notre Réseau Hospitalier' : isKr ? 'Lor Nou Rezo Lopital' : 'About Our Partner Hospital Network'}
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            {isFr
              ? 'Notre accompagnement va bien au-delà de la simple mise en relation. De l\'analyse de vos rapports médicaux et la prise de rendez-vous avec les chefs de service jusqu\'à l\'assistance visa, les réservations de vols, l\'admission et le suivi post-traitement, notre équipe de navigation vous accompagne avec bienveillance. Le choix de l\'établissement repose sur les exigences médicales spécifiques de chaque patient (accréditations JCI/NABH, plateau technique, renommée clinique et services internationaux).'
              : isKr
              ? 'Nou sipor al bien pli lwin ki zis enn referal. Depi analiz ou dosie medikal ek randevou sef dokter ziska viza, biye avion, lotel, ladmision lopital ek swivi apre tretman, nou lekip res ar ou tou long ou vwayaz.'
              : 'Our support goes far beyond hospital referral. From medical-record review, specialist appointments, and treatment planning to visa assistance, flights, accommodation, hospital admission, and post-treatment follow-up, our patient-navigation team accompanies patients and families throughout their healthcare journey. Hospital selection is strictly tailored to individual clinical requirements, international accreditations (JCI/NABH), and advanced surgical capabilities.'}
          </p>
        </div>

        {/* Patient Reassurance Helper Card */}
        <div className="spec-helper-card" style={{ marginBottom: '1.75rem' }}>
          <div className="spec-helper-card__left">
            <div className="spec-helper-card__icon" aria-hidden="true">
              <HelpCircle size={28} />
            </div>
            <div>
              <h3 className="spec-helper-card__title">
                {l10n(
                  'Besoin d\'aide pour choisir l\'hôpital le plus adapté à votre diagnostic ?',
                  'Bizin led pou swazir meyer lopital pou ou ka ?',
                  'Need guidance choosing the right accredited hospital for your condition?'
                )}
              </h3>
              <p className="spec-helper-card__desc">
                {l10n(
                  'Nos Patient Navigators analysent gratuitement vos comptes rendus et vous orientent vers le chef de service et l\'établissement le plus expérimenté.',
                  'Nou bann Patient Navigator get ou dosie gratis ek dir ou ki meyer lopital ek dokter pou ou tretman.',
                  'Our Patient Navigators will review your records for free and recommend the most suitable institution and department head within 48 hours.'
                )}
              </p>
            </div>
          </div>
          <div className="spec-helper-card__actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/describe-need')}
            >
              <span>{isFr ? 'RÉSERVER UNE CONSULTATION' : isKr ? 'REZERV OU KONSILTASION' : 'BOOK A CONSULTATION'}</span>
            </button>
            <a
              href={buildMed360WhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>

        {/* City / Hub Quick Filter Chips */}
        <div className="spec-symptom-chips-container" style={{ marginBottom: '1.75rem' }}>
          <div className="spec-symptom-chips-label">
            <Sparkles size={14} />
            <span>{l10n('Filtrer par pôle médical en Inde :', 'Filtre par lavil dan L\'inde :', 'Filter by Indian Healthcare Hub:')}</span>
          </div>
          <div className="spec-symptom-chips" role="tablist" aria-label="City quick filter chips">
            {INDIAN_HUBS.map((hub) => {
              const isActive = selectedHub === hub.id;
              return (
                <button
                  key={hub.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`spec-symptom-chip ${isActive ? 'spec-symptom-chip--active' : ''}`}
                  onClick={() => {
                    setSelectedHub(hub.id);
                    setCurrentPage(1);
                  }}
                >
                  <span>📍</span>
                  <span>{isFr ? hub.label_fr : isKr ? hub.label_kr : hub.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count, Search, Filters, Sort & View Mode Toolbar */}
        {!loading && (
          <ListToolbar
            searchQuery={searchInput}
            onSearchChange={(val) => {
              setSearchInput(val);
              setCurrentPage(1);
            }}
            searchPlaceholder={isFr ? 'Rechercher un hôpital, ville ou spécialité...' : isKr ? 'Rod enn lopital, lavil...' : 'Search hospital name, city, or specialty...'}
            totalCount={filteredHospitals.length}
            countUnit={l10n('hôpital', 'lopital', 'hospital')}
            countUnitPlural={l10n('hôpitaux', 'lopital', 'hospitals')}
            sortBy={sortBy}
            onSortChange={(val) => {
              setSortBy(val);
              setCurrentPage(1);
            }}
            sortOptions={sortOptions}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        )}

        {/* Comparison Floating Action Bar */}
        {compareIds.length > 0 && (
          <div className="hospital-compare-bar animate-fade-in-up">
            <div className="hospital-compare-bar__inner container">
              <div className="hospital-compare-bar__info">
                <Scale size={20} className="text-primary" />
                <span>
                  <strong>{compareIds.length}</strong> / 3 {l10n('hôpitaux sélectionnés pour comparaison', 'lopital seleksione', 'hospitals selected')}
                </span>
                <div className="hospital-compare-bar__chips">
                  {comparedHospitals.map(h => (
                    <span key={h.id} className="compare-chip">
                      {h.name}
                      <button onClick={() => toggleCompare(h.id)} aria-label="Remove">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="hospital-compare-bar__actions">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setCompareIds([])}
                  style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}
                >
                  {l10n('Réinitialiser', 'Reset', 'Clear All')}
                </button>
                <button
                  className="btn btn-accent btn-sm"
                  onClick={() => setShowCompareModal(true)}
                >
                  <Scale size={16} />
                  {l10n('Comparer Maintenant', 'Konpare Aster', 'Compare Now')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="hospitals-grid" style={{ marginTop: '2rem' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="hospital-card skeleton" style={{ height: 380 }} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredHospitals.length === 0 && (
          <div className="empty-state">
            <Shield size={48} className="empty-state__icon" />
            <h3 className="empty-state__title">
              {l10n('Aucun hôpital trouvé', 'Pena lopital trouve', 'No hospitals match your search')}
            </h3>
            <p className="empty-state__desc">
              {l10n('Essayez d\'ajuster vos critères ou contactez directement notre équipe.', 'Esey sanz ou bann filtre ouswa koz ar nou lekip.', 'Try clearing your filters or speak directly with our Patient Navigator.')}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setSearchInput('');
                setSelectedHub('all');
                setCurrentPage(1);
              }}
            >
              {l10n('Réinitialiser les filtres', 'Reset tou filtre', 'Reset Filters')}
            </button>
          </div>
        )}

        {/* Hospitals Grid / List */}
        {!loading && filteredHospitals.length > 0 && (
          <>
            <div className={`hospitals-grid ${viewMode === 'list' ? 'hospitals-grid--list' : ''}`} style={{ marginTop: '1.5rem' }}>
              {paginatedHospitals.map(hospital => {
                const isCompared = compareIds.includes(hospital.id);
                return (
                  <article
                    key={hospital.id}
                    className={`hospital-card ${isCompared ? 'hospital-card--compared' : ''}`}
                    id={`hospital-card-${hospital.id}`}
                  >
                    <div className="hospital-card__image">
                      <img
                        src={hospital.imageUrl}
                        alt={hospital.name}
                        loading="lazy"
                        decoding="async"
                        width="400"
                        height="220"
                      />
                      <div className="hospital-card__overlay" />
                      
                      {/* Compare Checkbox */}
                      <button
                        type="button"
                        className={`hospital-card__compare-btn ${isCompared ? 'hospital-card__compare-btn--active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompare(hospital.id);
                        }}
                        title={isCompared ? 'Retirer du comparateur' : 'Ajouter au comparateur'}
                      >
                        {isCompared ? <CheckSquare size={16} /> : <Square size={16} />}
                        <span>{isCompared ? 'Sélectionné' : 'Comparer'}</span>
                      </button>

                      {/* Accreditations Badges */}
                      <div className="hospital-card__badges">
                        {hospital.accreditations.map(acc => (
                          <span key={acc} className="badge badge-accent">{acc}</span>
                        ))}
                      </div>
                    </div>

                    <div className="hospital-card__body">
                      <div className="hospital-card__top">
                        <h3 className="hospital-card__name">{l(hospital, 'name')}</h3>
                        <p className="hospital-card__location">
                          <MapPin size={14} />
                          {hospital.city}, {hospital.country}
                        </p>
                      </div>

                      <div className="hospital-card__stats">
                        <div className="hospital-card__rating">
                          <Star size={14} fill="#ffb400" color="#ffb400" />
                          <span>{hospital.rating}</span>
                          <span className="text-muted">({formatNumber(hospital.reviewCount)})</span>
                        </div>
                        {hospital.bedsCount > 0 && (
                          <span className="hospital-card__beds">
                            🛏️ {formatNumber(hospital.bedsCount)} {l10n('lits', 'lili', 'beds')}
                          </span>
                        )}
                        {hospital.foundedYear && (
                          <span className="hospital-card__year" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            Est. {hospital.foundedYear}
                          </span>
                        )}
                      </div>

                      <p className="hospital-card__desc">
                        {truncateText(l(hospital, 'description'), 135)}
                      </p>

                      <div className="hospital-card__footer">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => navigate(`/hospitals/${hospital.id}`)}
                        >
                          <span>{l10n('Voir le Profil Détaillé', 'Get Profil Konple', 'View Hospital Profile')}</span>
                          <ArrowRight size={14} />
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => navigate(`/describe-need?hospitalId=${hospital.id}`)}
                        >
                          {l10n('Avis Médical', 'Lavi Medikal', 'Book Review')}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredHospitals.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {/* Inline Comparison Drawer */}
        {showCompareModal && (
          <div ref={compareSectionRef} style={{ marginTop: '3rem' }}>
            <HospitalCompareModal
              hospitals={comparedHospitals}
              onClose={() => setShowCompareModal(false)}
              onRemove={(hospitalId) => setCompareIds(prev => prev.filter(id => id !== hospitalId))}
            />
          </div>
        )}
      </div>
    </main>
  );
}
export default HospitalsPage;
