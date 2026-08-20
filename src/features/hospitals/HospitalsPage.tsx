import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Shield, ArrowRight } from 'lucide-react';
import { useHospitals } from '../../hooks/useHospitals';
import { getUniqueCountries, getUniqueAccreditations } from '../../core/services/hospital.service';
import { formatNumber, truncateText } from '../../core/services/format.service';
import type { HospitalFilters } from '../../core/services/hospital.service';
import './Hospitals.css';

export function HospitalsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<HospitalFilters>({});
  const [searchInput, setSearchInput] = useState('');
  const { hospitals, loading } = useHospitals(filters);
  const { hospitals: allHospitals } = useHospitals({});

  const countries = getUniqueCountries(allHospitals);
  const accreditations = getUniqueAccreditations(allHospitals);

  function handleSearch() {
    setFilters(f => ({ ...f, searchQuery: searchInput || undefined }));
  }

  return (
    <main className="hospitals-page" style={{ paddingTop: 'var(--navbar-height)' }}>
      {/* Header */}
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="container page-hero__inner">
          <span className="section-label" style={{ color: 'var(--color-accent)' }}>Our Network</span>
          <h1 className="text-h1" style={{ color: 'white' }}>Associated Hospitals</h1>
          <p className="text-lead" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 560 }}>
            Every hospital in our network is internationally accredited. Browse our partner hospitals and explore their specialties, facilities, and patient services.
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
              placeholder="Search hospitals by name, city, or country…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn btn-primary btn-sm" onClick={handleSearch} id="hospital-search-btn">
              Search
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
              <option value="">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              id="hospital-filter-accreditation"
              className="form-select"
              style={{ maxWidth: 200 }}
              value={filters.accreditation ?? ''}
              onChange={e => setFilters(f => ({ ...f, accreditation: e.target.value || undefined }))}
            >
              <option value="">All Accreditations</option>
              {accreditations.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <button className="btn btn-outline btn-sm" onClick={() => { setFilters({}); setSearchInput(''); }} id="hospital-clear-filters-btn">
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Showing {hospitals.length} hospital{hospitals.length !== 1 ? 's' : ''}
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
                    <h2 className="hospital-list-card__name">{hospital.name}</h2>
                    <p className="hospital-list-card__location">
                      <MapPin size={14} /> {hospital.city}, {hospital.country}
                    </p>
                    <div className="hospital-list-card__rating">
                      <Star size={14} fill="#ffb400" color="#ffb400" />
                      <strong>{hospital.rating}</strong>
                      <span className="text-muted">({formatNumber(hospital.reviewCount)} reviews)</span>
                      <span className="hospital-list-card__separator">·</span>
                      <span>{formatNumber(hospital.bedsCount)} beds</span>
                      <span className="hospital-list-card__separator">·</span>
                      <span>{formatNumber(hospital.internationalPatientsPerYear)}+ intl. patients/yr</span>
                    </div>
                    <p className="hospital-list-card__desc">{truncateText(hospital.description, 160)}</p>
                  </div>
                  <div className="hospital-list-card__actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/hospitals/${hospital.id}`)}
                      id={`view-hospital-${hospital.id}-btn`}
                    >
                      View Details <ArrowRight size={14} />
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => navigate(`/describe-need?hospital=${hospital.id}`)}
                      id={`inquire-hospital-${hospital.id}-btn`}
                    >
                      Get Opinion
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
