import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSpecialties } from '../../hooks/useSpecialties';
import { SEO } from '../../components/SEO/SEO';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { useCMS } from '../../hooks/useCMS';
import { ListToolbar, type SortOption } from '../../components/ListToolbar/ListToolbar';
import { Pagination } from '../../components/Pagination/Pagination';
import { SPECIALTY_SYMPTOMS_MAP, QUICK_SYMPTOM_FILTERS } from './specialtySymptoms';
import './Specialties.css';

export function SpecialtiesPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { specialties, loading } = useSpecialties();
  const { data: cms } = useCMS('specialties');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSymptom, setActiveSymptom] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';
  const langKey = (isFr || isKr) ? (i18n.language as 'fr' | 'kr') : 'en';
  const l10n = (fr: string, kr: string, en: string) => isFr ? fr : isKr ? kr : en;
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
    // 1. Quick symptom chip filter
    if (activeSymptom !== 'all' && sp.id !== activeSymptom) {
      return false;
    }

    // 2. Search query matching
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameMatch = l(sp, 'name')?.toLowerCase().includes(q) || sp.name?.toLowerCase().includes(q);
    const descMatch = l(sp, 'shortDescription')?.toLowerCase().includes(q) || sp.shortDescription?.toLowerCase().includes(q);
    const procMatch = sp.procedures?.some(p => l(p, 'name')?.toLowerCase().includes(q) || p.name?.toLowerCase().includes(q));

    // Multilingual symptom & keyword match
    const symptomEntry = SPECIALTY_SYMPTOMS_MAP[sp.id];
    let symptomMatch = false;
    if (symptomEntry) {
      const allKws = [
        ...symptomEntry.en.keywords, ...symptomEntry.en.symptoms, symptomEntry.en.plainName, symptomEntry.en.badge,
        ...symptomEntry.fr.keywords, ...symptomEntry.fr.symptoms, symptomEntry.fr.plainName, symptomEntry.fr.badge,
        ...symptomEntry.kr.keywords, ...symptomEntry.kr.symptoms, symptomEntry.kr.plainName, symptomEntry.kr.badge,
      ].map(k => k.toLowerCase());
      symptomMatch = allKws.some(k => k.includes(q) || q.includes(k));
    }

    return nameMatch || descMatch || procMatch || symptomMatch;
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
            {tCms('heroLabel', l10n('Spécialités Médicales', 'Spesialite Medikal', 'Medical Specialties'))}
          </span>
          <h1 className="text-h1">
            {tCms('heroTitle', l10n('Spécialités Médicales & Soins de Pointe', 'Spesialite Medikal & Swen Avanse', 'Specialised Care Across Medical Disciplines'))}
          </h1>
          <p className="text-lead">
            {tCms('heroDesc', l10n(
              'Accédez à des soins de santé complets, des diagnostics avancés et deuxièmes avis à la chimiothérapie, la radiothérapie, la chirurgie complexe et la réadaptation.',
              'Gagn akse ar bann swen konple, depi test avanse ziska deziem lavi, simioterapi, sirirzi konplex ek re-abilitasion.',
              'Access comprehensive medical care, from advanced diagnostics and second opinions to chemotherapy, radiotherapy, complex surgery, and multidisciplinary rehabilitation.'
            ))}
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: '2rem var(--space-6) 4rem' }}>
        {/* Patient Reassurance Helper Card */}
        <div className="spec-helper-card">
          <div className="spec-helper-card__left">
            <div className="spec-helper-card__icon" aria-hidden="true">
              <HelpCircle size={28} />
            </div>
            <div>
              <h3 className="spec-helper-card__title">
                {l10n(
                  'Pas certain(e) de la spécialité dont vous avez besoin ?',
                  'Pa sir ki spesialite ou bizin pou ou ka ?',
                  'Not sure which medical specialty you need?'
                )}
              </h3>
              <p className="spec-helper-card__desc">
                {l10n(
                  'Ne vous inquiétez pas — décrivez-nous simplement vos douleurs ou symptômes. Notre équipe médicale examinera votre dossier et vous orientera vers le bon spécialiste sans frais.',
                  'Pa traka ditou — zis dir nou ki douler ou gagne ouswa avoy ou bann rapor. Nou lekip medikal pou gid ou ver bon dokter san okenn fre.',
                  'Don\'t worry — simply describe what hurts or what you\'re experiencing. Our medical team will review your case and connect you to the right specialist for free.'
                )}
              </p>
            </div>
          </div>
          <div className="spec-helper-card__actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/describe-need?from=Specialties+Directory+Banner&serviceName=Specialty+Assessment')}
            >
              ✍️ {l10n('Décrire mes symptômes', 'Dekrir mo bann sintom', 'Describe My Condition')}
            </button>
            <a
              href={buildMed360WhatsAppUrl("Bonjour, j'aimerais de l'aide pour savoir quel spécialiste consulter.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>

        {/* Quick Symptom / Body Part Filters */}
        <div className="spec-symptom-chips-container">
          <div className="spec-symptom-chips-label">
            <Sparkles size={14} />
            <span>{l10n('Recherche rapide par problème ou partie du corps :', 'Rod vit par parti lekor ouswa douler :', 'Quick search by body part or condition:')}</span>
          </div>
          <div className="spec-symptom-chips" role="tablist" aria-label="Symptom filter chips">
            {QUICK_SYMPTOM_FILTERS.map((chip) => {
              const label = chip[`label_${langKey}`] || chip.label_en;
              const isActive = activeSymptom === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`spec-symptom-chip ${isActive ? 'spec-symptom-chip--active' : ''}`}
                  onClick={() => {
                    setActiveSymptom(chip.id);
                    setCurrentPage(1);
                  }}
                >
                  <span>{chip.icon}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Toolbar */}
        {!loading && (
          <ListToolbar
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
            searchPlaceholder={l10n(
              'Ex: douleur genou, coeur, essoufflement, cataracte, bébé...',
              'Ex: douler zounou, leker, souf, katarak, baba, kanser...',
              'Search by symptom: knee pain, chest, bypass, cataract, baby...'
            )}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOptions={sortOptions}
            totalCount={sortedSpecialties.length}
            countUnit={isFr ? 'spécialité' : isKr ? 'spesialite' : 'specialty'}
            countUnitPlural={isFr ? 'spécialités' : isKr ? 'spesialite' : 'specialties'}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            extraControls={
              (searchQuery || activeSymptom !== 'all') ? (
                <button
                  type="button"
                  className="list-toolbar__clear-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveSymptom('all');
                    setCurrentPage(1);
                  }}
                >
                  ↺ {l10n('Effacer les filtres', 'Efase filt', 'Reset filters')}
                </button>
              ) : null
            }
          />
        )}

        <div className={`spec-grid ${viewMode === 'list' ? 'spec-grid--list-view' : ''}`}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 380, borderRadius: 16 }} />
              ))
            : paginatedSpecialties.map((sp) => {
                const symptomData = SPECIALTY_SYMPTOMS_MAP[sp.id]?.[langKey];
                return (
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
                      {symptomData?.badge && (
                        <span className="spec-card__symptom-badge">
                          {symptomData.badge}
                        </span>
                      )}

                      <p className="spec-card__desc" onClick={() => navigate(`/specialties/${sp.id}`)}>
                        {l(sp, 'shortDescription')}
                      </p>

                      {symptomData && symptomData.symptoms?.length > 0 && (
                        <div className="spec-card__symptom-tags">
                          <span className="spec-card__symptom-tags-label">
                            {l10n('Cas fréquents :', 'Ka souvan trete :', 'Common reasons to consult:')}
                          </span>
                          <div className="spec-card__symptom-tags-list">
                            {symptomData.symptoms.slice(0, 3).map((sym, idx) => (
                              <span key={idx} className="spec-card__symptom-tag">
                                {sym}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="spec-card__procedures" onClick={() => navigate(`/specialties/${sp.id}`)}>
                        {sp.procedures.slice(0, 3).map((proc) => (
                          <div key={proc.id} className="spec-procedure" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.65rem' }}>
                            <span style={{ color: 'var(--color-primary)', fontSize: '0.85rem' }}>✦</span>
                            <span style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.8125rem' }}>{l(proc, 'name')}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => navigate(`/specialties/${sp.id}`)}
                          style={{ flex: 1 }}
                        >
                          {l10n('En savoir plus', 'Get Detay', 'Learn More')}
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => navigate(`/describe-need?specialty=${sp.id}&specialtyName=${encodeURIComponent(sp.name)}&from=Specialties+Directory+Card+(${encodeURIComponent(sp.name)})`)}
                          id={`spec-inquire-${sp.id}-btn`}
                          style={{ flex: 1 }}
                        >
                          {l10n('Demander un avis', 'Demann lavi', 'Get Advice')} <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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

