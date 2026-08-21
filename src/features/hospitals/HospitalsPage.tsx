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

  return (
    <main className="hospitals-page" style={{ paddingTop: 'var(--navbar-height)' }}>
      <SEO 
        title={l10n('Hôpitaux Associés', 'Lopital Partner', 'Associated Hospitals')}
        description={l10n('Découvrez nos hôpitaux partenaires.', 'Dekouver nou bann lopital partner.', 'Discover our partner hospitals.')}
        canonical="/hospitals"
      />
      {/* Header */}
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="container page-hero__inner">
          <span className="section-label" style={{ color: 'var(--color-accent)' }}>
            {tCms('heroLabel', l10n('Notre Réseau', 'Nou Rezo', 'Our Network'))}
          </span>
          <h1 className="text-h1" style={{ color: 'white' }}>
            {tCms('heroTitle', l10n('Hôpitaux Associés', 'Lopital Partner', 'Associated Hospitals'))}
          </h1>
          <p className="text-lead" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 560 }}>
            {tCms('heroDesc', l10n(
              'Chaque hôpital de notre réseau est accrédité au niveau international. Parcourez nos hôpitaux partenaires et explorez leurs spécialités, leurs installations et leurs services aux patients.',
              'Sak lopital dan nou rezo ena akreditasion internasional. Get nou bann lopital partner ek explor zot spesialite, fasilite, ek servis pou bann pasian.',
              'Every hospital in our network is internationally accredited. Browse our partner hospitals and explore their specialties, facilities, and patient services.'
            ))}
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        {/* Filters */}
        <div className="hospitals-filters">
          <div className="search-box">
            <Search size={18} className="search-box__icon" />
            <input
              type="text"
              placeholder={tCms('searchPlaceholder', l10n('Rechercher par nom, ville ou pays...', 'Rod lopital par nom, lavil ouswa pei...', 'Search hospitals by name, city, or country...'))}
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              id="hospital-search-input"
            />
            {searchInput && (
              <button className="search-box__clear" onClick={() => { setSearchInput(''); setFilters(f => ({ ...f, searchQuery: undefined })); }}>
                ✕
              </button>
            )}
          </div>
          <div className="filter-group">
            <select
              value={filters.country || ''}
              onChange={e => setFilters(f => ({ ...f, country: e.target.value || undefined }))}
              id="hospital-country-filter"
            >
              <option value="">{l10n('Tous les pays', 'Tou pei', 'All Countries')}</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={filters.accreditation || ''}
              onChange={e => setFilters(f => ({ ...f, accreditation: e.target.value || undefined }))}
              id="hospital-accreditation-filter"
            >
              <option value="">{l10n('Toutes les accréditations', 'Tou akreditasion', 'All Accreditations')}</option>
              {accreditations.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <button className="btn btn-outline btn-sm" onClick={() => { setFilters({}); setSearchInput(''); }} id="hospital-clear-filters-btn">
              {l10n('Effacer les filtres', 'Efase', 'Clear Filters')}
            </button>
          </div>
        </div>

        {/* Results Count & Compare Button */}
        {!loading && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>
              {l10n(
                `Affichage de ${hospitals.length} hôpital${hospitals.length !== 1 ? 's' : ''}`,
                `Pe montre ${hospitals.length} lopital`,
                `Showing ${hospitals.length} hospital${hospitals.length !== 1 ? 's' : ''}`
              )}
            </p>
            {compareIds.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
              >
                <Scale size={16} />
                <span>{isFr ? `Comparer (${compareIds.length})` : `Compare (${compareIds.length})`}</span>
              </button>
            )}
          </div>
        )}

        {/* Hospital Grid */}
        <div className="hospitals-list">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 280, borderRadius: 16 }} />
              ))
            : hospitals.map(hospital => {
                const isSelected = compareIds.includes(hospital.id);
                return (
                  <div key={hospital.id} className="hospital-list-card" id={`hospital-${hospital.id}`}>
                    <div className="hospital-list-card__image">
                      <img src={hospital.imageUrl} alt={hospital.name} loading="lazy" />
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
