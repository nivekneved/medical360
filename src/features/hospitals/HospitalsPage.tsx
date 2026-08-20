import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Shield, ArrowRight } from 'lucide-react';
import { useHospitals } from '../../hooks/useHospitals';
import { useTranslation } from 'react-i18next';
import { getUniqueCountries, getUniqueAccreditations } from '../../core/services/hospital.service';
import { formatNumber, truncateText } from '../../core/services/format.service';
import type { HospitalFilters } from '../../core/services/hospital.service';
import { SEO } from '../../components/SEO/SEO';
import { useCMS } from '../../hooks/useCMS';
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

  const l10n = (fr: string, kr: string, en: string) => i18n.language === 'fr' ? fr : i18n.language === 'kr' ? kr : en;
  const l = (obj: any, field: string) => obj[`${field}_${i18n.language}`] || obj[field];

  const tCms = (key: string, fallback: string) => {
    if (!cms?.content?.[key]) return fallback;
    return cms.content[key][i18n.language] || cms.content[key]['en'] || fallback;
  };

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

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        {/* Search & Filters */}
        <div className="hospitals-filters">
          <div className="search-bar">
            <Search size={18} className="search-bar__icon" />
            <input
              id="hospital-search-input"
              className="form-input"
              placeholder={l10n("Rechercher des hôpitaux par nom, ville ou pays...", "Rod lopital par nom, lavil ouswa pei...", "Search hospitals by name, city, or country…")}
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn btn-primary btn-sm" onClick={handleSearch} id="hospital-search-btn">
              {l10n('Rechercher', 'Rode', 'Search')}
            </button>
          </div>
          <div className="filter-row">
            <select
              id="hospital-filter-country"
              className="form-select"
              style={{ maxWidth: 200 }}
              value={filters.country ?? ''}
              onChange={e => setFilters(f => ({ ...f, country: e.target.value || undefined }))}
            >
              <option value="">{l10n('Tous les Pays', 'Tou Pei', 'All Countries')}</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              id="hospital-filter-accreditation"
              className="form-select"
              style={{ maxWidth: 200 }}
              value={filters.accreditation ?? ''}
              onChange={e => setFilters(f => ({ ...f, accreditation: e.target.value || undefined }))}
            >
              <option value="">{l10n('Toutes les Accréditations', 'Tou Akreditasion', 'All Accreditations')}</option>
              {accreditations.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <button className="btn btn-outline btn-sm" onClick={() => { setFilters({}); setSearchInput(''); }} id="hospital-clear-filters-btn">
              {l10n('Effacer les filtres', 'Efase', 'Clear Filters')}
            </button>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {l10n(
              `Affichage de ${hospitals.length} hôpital${hospitals.length !== 1 ? 's' : ''}`,
              `Pe montre ${hospitals.length} lopital`,
              `Showing ${hospitals.length} hospital${hospitals.length !== 1 ? 's' : ''}`
            )}
          </p>
        )}

        {/* Hospital Grid */}
        <div className="hospitals-list">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 280, borderRadius: 16 }} />
              ))
            : hospitals.map(hospital => (
                <div key={hospital.id} className="hospital-list-card" id={`hospital-${hospital.id}`}>
                  <div className="hospital-list-card__image">
                    <img src={hospital.imageUrl} alt={hospital.name} loading="lazy" />
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
              ))
          }
        </div>
      </div>
    </main>
  );
}
