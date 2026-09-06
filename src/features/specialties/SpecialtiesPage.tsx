import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSpecialties } from '../../hooks/useSpecialties';
import { formatCostRange } from '../../core/services/format.service';
import { SEO } from '../../components/SEO/SEO';
import { useCMS } from '../../hooks/useCMS';
import { ListToolbar, type SortOption } from '../../components/ListToolbar/ListToolbar';
import { Pagination } from '../../components/Pagination/Pagination';
import './Specialties.css';

export function SpecialtiesPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { specialties, loading } = useSpecialties();
  const { data: cms } = useCMS('specialties');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';
  const l10n = (fr: string, kr: string, en: string) => i18n.language === 'fr' ? fr : i18n.language === 'kr' ? kr : en;
  const l = (obj: any, field: string) => obj[`${field}_${i18n.language}`] || obj[field];

  const tCms = (key: string, fallback: string) => {
    if (!cms?.content?.[key]) return fallback;
    return cms.content[key][i18n.language] || cms.content[key]['en'] || fallback;
  };

  const sortOptions: SortOption[] = [
    { value: 'popular', label: isFr ? 'Plus Populaires' : isKr ? 'Plis Popiler' : 'Most Popular', icon: '⚡' },
    { value: 'procedures', label: isFr ? 'Nombre d\'Actes' : isKr ? 'Kantite Loperasion' : 'Procedures Count', icon: '🩺' },
    { value: 'name', label: isFr ? 'Nom (A-Z)' : isKr ? 'Nom (A-Z)' : 'Name (A-Z)', icon: '🔤' },
  ];

  const filteredSpecialties = specialties.filter((sp) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = l(sp, 'name').toLowerCase().includes(q) || sp.name.toLowerCase().includes(q);
    const descMatch = l(sp, 'shortDescription').toLowerCase().includes(q) || sp.shortDescription.toLowerCase().includes(q);
    const procMatch = sp.procedures.some(p => l(p, 'name').toLowerCase().includes(q) || p.name.toLowerCase().includes(q));
    return nameMatch || descMatch || procMatch;
  });

  const sortedSpecialties = [...filteredSpecialties].sort((a, b) => {
    if (sortBy === 'procedures') return (b.procedures?.length || 0) - (a.procedures?.length || 0);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const paginatedSpecialties = sortedSpecialties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="specialties-page" style={{ paddingTop: 'var(--navbar-height)' }}>
      <SEO 
        title={l10n('Spécialités & Soins Médicaux', 'Spesialite & Swen Medikal', 'Medical Specialties & Treatments')}
        description={l10n(
          'Découvrez nos spécialités médicales et nos traitements adaptés pour vous et vos proches.',
          'Dekouver nou bann spesialite medikal ek tretman adapte pou ou ek ou fami.',
          'Explore our medical specialties and trusted treatments with clear guidance from caring doctors.'
        )}
        canonical="/specialties"
      />
      {/* Header Banner */}
      <section className="page-hero--banner" style={{ backgroundImage: 'url(/assets/banners/specialties_banner.jpg)' }}>
        <div className="container page-hero__inner">
          <span className="section-label">
            {tCms('heroLabel', l10n('Des Soins Adaptés à Votre Santé', 'Bann Swen pou Ou Lasante', 'Caring Medical Specialties'))}
          </span>
          <h1 className="text-h1">
            {tCms('heroTitle', l10n('Spécialités Médicales & Traitements', 'Spesialite Medikal & Tretman', 'Medical Specialties & Treatments'))}
          </h1>
          <p className="text-lead">
            {tCms('heroDesc', l10n(
              'Que vous ayez besoin d\'une chirurgie du cœur, d\'un traitement orthopédique, d\'un suivi oncologique ou d\'un avis spécialisé — nos médecins sont là pour vous écouter et vous guider avec bienveillance.',
              'Ki ou bizin enn loperasion leker, tretman lezo, swen kanser ouswa zis enn bon lavi dokter — nou la pou ekout ou ek gid ou avek leker.',
              'Whether you need cardiac care, orthopedic surgery, cancer treatment, or a second opinion — our dedicated doctors are here to listen and guide you with compassion.'
            ))}
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: '2rem var(--space-6) 4rem' }}>
        {/* Results Toolbar */}
        {!loading && (
          <ListToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder={l10n('Rechercher une spécialité ou traitement...', 'Rod spesialite ouswa tretman...', 'Search specialties or treatments...')}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOptions={sortOptions}
            totalCount={sortedSpecialties.length}
            countUnit={isFr ? 'spécialité' : isKr ? 'spesialite' : 'specialty'}
            countUnitPlural={isFr ? 'spécialités' : isKr ? 'spesialite' : 'specialties'}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            extraControls={
              searchQuery ? (
                <button
                  type="button"
                  className="list-toolbar__clear-btn"
                  onClick={() => setSearchQuery('')}
                >
                  ↺ {l10n('Effacer', 'Efase', 'Clear')}
                </button>
              ) : null
            }
          />
        )}

        <div className={`spec-grid ${viewMode === 'list' ? 'spec-grid--list-view' : ''}`}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 320, borderRadius: 16 }} />
              ))
            : paginatedSpecialties.map((sp) => (
                <div key={sp.id} className="spec-card" id={`spec-card-${sp.id}`} style={{ cursor: 'pointer' }}>
                  <div className="spec-card__image" onClick={() => navigate(`/specialties/${sp.id}`)}>
                    <img
                      src={sp.imageUrl}
                      alt={l(sp, 'name')}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = '/assets/banners/specialties_banner.jpg'; }}
                    />
                    <div className="spec-card__overlay" />
                    <h2 className="spec-card__name">{l(sp, 'name')}</h2>
                  </div>
                  <div className="spec-card__body">
                    <p className="spec-card__desc" onClick={() => navigate(`/specialties/${sp.id}`)}>{l(sp, 'shortDescription')}</p>
                    <div className="spec-card__procedures" onClick={() => navigate(`/specialties/${sp.id}`)}>
                      {sp.procedures.slice(0, 3).map((proc) => (
                        <div key={proc.id} className="spec-procedure">
                          <span>{l(proc, 'name')}</span>
                          <span className="spec-procedure__cost">
                            {formatCostRange(proc.estimatedCostUSD.min, proc.estimatedCostUSD.max)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => navigate(`/specialties/${sp.id}`)}
                        style={{ flex: 1 }}
                      >
                        {l10n('Voir détails', 'Get Detay', 'View Details')}
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/describe-need?specialty=${sp.id}`)}
                        id={`spec-inquire-${sp.id}-btn`}
                        style={{ flex: 1 }}
                      >
                        {l10n('Avis Gratuit', 'Lavi Gratis', 'Free Opinion')} <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={sortedSpecialties.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(p) => {
            setCurrentPage(p);
            window.scrollTo({ top: 380, behavior: 'smooth' });
          }}
          onItemsPerPageChange={setItemsPerPage}
          pageSizeOptions={[6, 9, 15]}
          unitName={isFr ? 'spécialités' : isKr ? 'spesialite' : 'specialties'}
        />
      </div>
    </main>
  );
}
