import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Shield, ArrowRight, Scale, CheckSquare, Square, X } from 'lucide-react';
import { useHospitals } from '../../hooks/useHospitals';
import { useTranslation } from 'react-i18next';
import { getUniqueCountries, getUniqueAccreditations } from '../../core/services/hospital.service';
import { formatNumber, truncateText } from '../../core/services/format.service';
import type { HospitalFilters } from '../../core/services/hospital.service';
import type { Hospital } from '../../core/types';
import { SEO } from '../../components/SEO/SEO';
import { useCMS } from '../../hooks/useCMS';
import { HospitalCompareModal } from './HospitalCompareModal';
import { ListToolbar, type SortOption } from '../../components/ListToolbar/ListToolbar';
import './Hospitals.css';

export function HospitalsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<HospitalFilters>({});
  const [searchInput, setSearchInput] = useState('');
  const { t, i18n } = useTranslation();
  const { hospitals, loading } = useHospitals(filters);
  const { hospitals: allHospitals } = useHospitals({});
  const { data: cms } = useCMS('hospitals');

  const countries = getUniqueCountries(allHospitals);
  const accreditations = getUniqueAccreditations(allHospitals);

  function handleSearch() {
    setFilters(f => ({ ...f, searchQuery: searchInput || undefined }));
  }

  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';
  const l10n = (fr: string, kr: string, en: string) => i18n.language === 'fr' ? fr : i18n.language === 'kr' ? kr : en;
  const l = (obj: any, field: string) => obj[`${field}_${i18n.language}`] || obj[field];

  const tCms = (key: string, fallback: string) => {
    if (!cms?.content?.[key]) return fallback;
    return cms.content[key][i18n.language] || cms.content[key]['en'] || fallback;
  };

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
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

  // Sort hospitals
  const sortedHospitals = [...hospitals].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'beds') return (b.bedsCount || 0) - (a.bedsCount || 0);
    if (sortBy === 'patients') return (b.internationalPatientsPerYear || 0) - (a.internationalPatientsPerYear || 0);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const sortOptions: SortOption[] = [
    { value: 'rating', label: isFr ? 'Meilleure Note' : isKr ? 'Mayer Not' : 'Highest Rated', icon: '★' },
    { value: 'beds', label: isFr ? 'Capacité Lits' : isKr ? 'Lili Lopital' : 'Bed Capacity', icon: '🛏️' },
    { value: 'patients', label: isFr ? 'Patients Intl' : isKr ? 'Pasian Intl' : 'Intl Patients', icon: '👥' },
    { value: 'name', label: isFr ? 'Nom (A-Z)' : isKr ? 'Nom (A-Z)' : 'Name (A-Z)', icon: '🔤' },
  ];

  return (
    <main className="hospitals-page" style={{ paddingTop: 'var(--navbar-height)' }}>
      <SEO 
        title={l10n('Hôpitaux Associés', 'Lopital Partner', 'Associated Hospitals')}
        description={l10n('Découvrez nos hôpitaux partenaires.', 'Dekouver nou bann lopital partner.', 'Discover our partner hospitals.')}
        canonical="/hospitals"
      />
      {/* Header Banner */}
      <section className="page-hero--banner" style={{ backgroundImage: 'url(/assets/banners/hospitals_banner.jpg)' }}>
        <div className="container page-hero__inner">
          <span className="section-label">
            {tCms('heroLabel', l10n('Notre Réseau', 'Nou Rezo', 'Our Network'))}
          </span>
          <h1 className="text-h1">
            {tCms('heroTitle', l10n('Hôpitaux Associés', 'Lopital Partner', 'Associated Hospitals'))}
          </h1>
          <p className="text-lead">
            {tCms('heroDesc', l10n(
              'Chaque hôpital de notre réseau est accrédité au niveau international. Parcourez nos hôpitaux partenaires et explorez leurs spécialités, leurs installations et leurs services aux patients.',
              'Sak lopital dan nou rezo ena akreditasion internasional. Get nou bann lopital partner ek explor zot spesialite, fasilite, ek servis pou bann pasian.',
              'Every hospital in our network is internationally accredited. Browse our partner hospitals and explore their specialties, facilities, and patient services.'
            ))}
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: '2rem var(--space-6) 6rem' }}>
        {/* Results Count, Search, Filters, Sort & View Mode Toolbar */}
        {!loading && (
          <ListToolbar
            searchQuery={searchInput}
            onSearchChange={(val) => {
              setSearchInput(val);
              setFilters(f => ({ ...f, searchQuery: val || undefined }));
            }}
            searchPlaceholder={tCms('searchPlaceholder', l10n('Rechercher un hôpital...', 'Rod enn lopital...', 'Search hospitals...'))}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOptions={sortOptions}
            totalCount={sortedHospitals.length}
            countUnit={isFr ? 'hôpital' : isKr ? 'lopital' : 'hospital'}
            countUnitPlural={isFr ? 'hôpitaux' : isKr ? 'lopital' : 'hospitals'}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            extraControls={
              <>
                {/* Country Filter Pill */}
                <div className="list-toolbar__filter-pill">
                  <select
                    className="list-toolbar__filter-select"
                    value={filters.country || ''}
                    onChange={e => setFilters(f => ({ ...f, country: e.target.value || undefined }))}
                    id="hospital-country-filter"
                  >
                    <option value="">{l10n('🌐 Tous les pays', '🌐 Tou pei', '🌐 All Countries')}</option>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Accreditation Filter Pill */}
                <div className="list-toolbar__filter-pill">
                  <select
                    className="list-toolbar__filter-select"
                    value={filters.accreditation || ''}
                    onChange={e => setFilters(f => ({ ...f, accreditation: e.target.value || undefined }))}
                    id="hospital-accreditation-filter"
                  >
                    <option value="">{l10n('🏅 Accréditations', '🏅 Akreditasion', '🏅 All Accreditations')}</option>
                    {accreditations.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                {/* Clear Active Filters */}
                {(searchInput || filters.country || filters.accreditation) && (
                  <button
                    type="button"
                    className="list-toolbar__clear-btn"
                    onClick={() => { setFilters({}); setSearchInput(''); }}
                    id="hospital-clear-filters-btn"
                  >
                    ↺ {l10n('Effacer', 'Efase', 'Clear')}
                  </button>
                )}

                {/* Compare Float Trigger */}
                {compareIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowCompareModal(true)}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, borderRadius: '999px', height: 40, padding: '0 1rem' }}
                  >
                    <Scale size={15} />
                    <span>{isFr ? `Comparer (${compareIds.length})` : `Compare (${compareIds.length})`}</span>
                  </button>
                )}
              </>
            }
          />
        )}

        {/* Hospital Grid / List */}
        <div className={`hospitals-list ${viewMode === 'list' ? 'hospitals-list--list-view' : ''}`}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 280, borderRadius: 16 }} />
              ))
            : sortedHospitals.map(hospital => {
                const isSelected = compareIds.includes(hospital.id);
                return (
                  <div key={hospital.id} className="hospital-list-card" id={`hospital-${hospital.id}`}>
                    <div className="hospital-list-card__image">
                      <img
                        src={hospital.imageUrl}
                        alt={hospital.name}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = '/assets/banners/hospitals_banner.jpg'; }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompare(hospital.id);
                        }}
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          background: isSelected ? 'var(--color-primary)' : 'rgba(0,0,0,0.65)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '999px',
                          padding: '0.3rem 0.65rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          cursor: 'pointer',
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        {isSelected ? <CheckSquare size={13} /> : <Square size={13} />}
                        <span>{isSelected ? (isFr ? 'Sélectionné' : 'Selected') : (isFr ? 'Comparer' : 'Compare')}</span>
                      </button>
                    </div>
                    <div className="hospital-list-card__body">
                      <div className="hospital-list-card__badges">
                        {hospital.accreditations.map(acc => (
                          <span key={acc} className="badge badge-accent">
                            <Shield size={10} /> {acc}
                          </span>
                        ))}
                      </div>
                      <h2 className="hospital-list-card__name">{l(hospital, 'name')}</h2>
                      <p className="hospital-list-card__location">
                        <MapPin size={14} /> {l(hospital, 'city')}, {l(hospital, 'country')}
                      </p>
                      <div className="hospital-list-card__rating">
                        <Star size={14} fill="#ffb400" color="#ffb400" />
                        <strong>{hospital.rating}</strong>
                        <span className="text-muted">({formatNumber(hospital.reviewCount)} {l10n('avis', 'reviou', 'reviews')})</span>
                        <span className="hospital-list-card__separator">·</span>
                        <span>{formatNumber(hospital.bedsCount)} {l10n('lits', 'lili', 'beds')}</span>
                        <span className="hospital-list-card__separator">·</span>
                        <span>{formatNumber(hospital.internationalPatientsPerYear)}+ {l10n('patients intl/an', 'pasian intl/an', 'intl. patients/yr')}</span>
                      </div>
                      <p className="hospital-list-card__desc">{truncateText(l(hospital, 'description'), 160)}</p>
                    </div>
                    <div className="hospital-list-card__actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/hospitals/${hospital.id}`)}
                        id={`view-hospital-${hospital.id}-btn`}
                      >
                        {l10n('Voir les détails', 'Get Detay', 'View Details')} <ArrowRight size={14} />
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => navigate(`/describe-need?hospital=${hospital.id}`)}
                        id={`inquire-hospital-${hospital.id}-btn`}
                      >
                        {l10n('Obtenir un avis', 'Gagn Lavi Medikal', 'Get Opinion')}
                      </button>
                    </div>
                  </div>
                );
              })
          }
        </div>
      </div>

      {/* Floating Bottom Compare Bar */}
      {compareIds.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(9, 13, 16, 0.94)',
          border: '1.5px solid rgba(16,185,129,0.4)',
          borderRadius: '999px',
          padding: '0.6rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontSize: '0.875rem', fontWeight: 700 }}>
            <Scale size={18} color="#34d399" />
            <span>{compareIds.length} {isFr ? 'hôpital(s) sélectionné(s)' : 'hospital(s) selected'}</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => setShowCompareModal(true)}
              className="btn btn-primary btn-sm"
              style={{ fontWeight: 800, padding: '0.4rem 1.1rem', borderRadius: '999px' }}
            >
              {isFr ? 'Comparer Côte à Côte' : 'Compare Side-by-Side'}
            </button>
            <button
              onClick={() => setCompareIds([])}
              style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Clear selection"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Compare Modal */}
      {showCompareModal && (
        <HospitalCompareModal
          hospitals={comparedHospitals}
          onClose={() => setShowCompareModal(false)}
          onRemove={(id) => {
            setCompareIds(prev => prev.filter(x => x !== id));
            if (compareIds.length <= 1) {
              setShowCompareModal(false);
            }
          }}
        />
      )}
    </main>
  );
}
