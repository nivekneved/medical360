import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCaseStudies } from '../../hooks/useCaseStudies';
import { useSpecialties } from '../../hooks/useSpecialties';
import { truncateText } from '../../core/services/format.service';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { SEO } from '../../components/SEO/SEO';
import { useCMS } from '../../hooks/useCMS';
import { ListToolbar, type SortOption } from '../../components/ListToolbar/ListToolbar';
import { Pagination } from '../../components/Pagination/Pagination';
import { SPECIALTY_SYMPTOMS_MAP, QUICK_SYMPTOM_FILTERS } from '../specialties/specialtySymptoms';
import './CaseStudies.css';

export function CaseStudiesPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { caseStudies, loading } = useCaseStudies();
  const { specialties } = useSpecialties();
  const { data: cms } = useCMS('case-studies');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('savings');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';
  const langKey = (isFr || isKr) ? (i18n.language as 'fr' | 'kr') : 'en';
  const l10n = (fr: string, kr: string, en: string) => isFr ? fr : isKr ? kr : en;
  const l = (obj: any, field: string) => obj[`${field}_${i18n.language}`] || obj[field];

  const tCms = (key: string, fallback: string) => {
    if (!cms?.content?.[key]) return fallback;
    return cms.content[key][i18n.language] || cms.content[key]['en'] || fallback;
  };

  function getSpecialtyName(id: string) {
    const s = specialties.find(s => s.id === id);
    return s ? l(s, 'name') : id;
  }

  const countries = Array.from(new Set(caseStudies.map(cs => l(cs, 'patientCountry') || cs.patientCountry))).filter(Boolean);

  const sortOptions: SortOption[] = [
    { value: 'savings', label: isFr ? 'Économies Réalisées' : isKr ? 'Lekonomi Gagne' : 'Cost Saved (%)', icon: '💰' },
    { value: 'recent', label: isFr ? 'Plus Récents' : isKr ? 'Plis Resan' : 'Most Recent', icon: '⚡' },
    { value: 'duration', label: isFr ? 'Durée de Séjour' : isKr ? 'Dire Sezour' : 'Stay Duration', icon: '⏱️' },
  ];

  const filteredCaseStudies = caseStudies.filter((cs) => {
    const matchSpecialty = selectedSpecialty === 'all' || cs.specialtyId === selectedSpecialty;
    const matchCountry = selectedCountry === 'all' || (l(cs, 'patientCountry') || cs.patientCountry) === selectedCountry;
    if (!matchSpecialty || !matchCountry) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const condMatch = l(cs, 'condition')?.toLowerCase().includes(q) || cs.condition?.toLowerCase().includes(q);
    const treatMatch = l(cs, 'treatment')?.toLowerCase().includes(q) || cs.treatment?.toLowerCase().includes(q);
    const nameMatch = cs.patientFirstName?.toLowerCase().includes(q);
    const testMatch = (l(cs, 'testimonial') || '')?.toLowerCase().includes(q);

    // Multilingual symptom & keyword match
    let symptomMatch = false;
    if (cs.specialtyId) {
      const sEntry = SPECIALTY_SYMPTOMS_MAP[cs.specialtyId];
      if (sEntry) {
        const allKws = [
          ...sEntry.en.keywords, ...sEntry.en.symptoms, sEntry.en.plainName, sEntry.en.badge,
          ...sEntry.fr.keywords, ...sEntry.fr.symptoms, sEntry.fr.plainName, sEntry.fr.badge,
          ...sEntry.kr.keywords, ...sEntry.kr.symptoms, sEntry.kr.plainName, sEntry.kr.badge,
        ].map(k => k.toLowerCase());
        symptomMatch = allKws.some(k => k.includes(q) || q.includes(k));
      }
    }

    return condMatch || treatMatch || nameMatch || testMatch || symptomMatch;
  });

  const sortedCaseStudies = [...filteredCaseStudies].sort((a, b) => {
    if (sortBy === 'savings') return (b.costSavedPercent || 0) - (a.costSavedPercent || 0);
    if (sortBy === 'recent') return (b.year || 0) - (a.year || 0);
    if (sortBy === 'duration') return (a.durationDays || 0) - (b.durationDays || 0);
    return 0;
  });

  const paginatedCaseStudies = sortedCaseStudies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="case-studies-page" style={{ paddingTop: 'var(--navbar-height)' }}>
      <SEO 
        title={l10n('Histoires de Guérison & Espoir', 'Zistwar Gerizon & Lespwar', 'Stories of Healing & Hope')}
        description={l10n(
          'Découvrez les témoignages émouvants de patients et de familles que nous avons eu le privilège d\'accompagner vers la guérison.',
          'Dekouver bann vre temwagnaz bann fami ki finn gagn gerizon ar nou led.',
          'Discover moving stories of patients and families guided with care and compassion to complete recovery.'
        )}
        canonical="/case-studies"
      />
      {/* Header Banner */}
      <section className="page-hero--banner" style={{ backgroundImage: 'url(/assets/banners/casestudies_banner.jpg)' }}>
        <div className="container page-hero__inner">
          <span className="section-label">
            {tCms('heroLabel', l10n('Témoignages & Récits de Vie', 'Zistwar Bann Pasian', 'Real Patient Stories'))}
          </span>
          <h1 className="text-h1">
            {tCms('heroTitle', l10n('Parcours de Guérison & d\'Espoir', 'Vre Zistwar Gerizon & Lespwar', 'Stories of Healing & Hope'))}
          </h1>
          <p className="text-lead">
            {tCms('heroDesc', l10n(
              'Découvrez des récits sincères et touchants. Depuis 10 ans, l\'ONG Enn Rev Enn Sourir et Med360 ont accompagné plus de 1 200 patients vers des soins de qualité, redonnant espoir et sérénité à tant de familles.',
              'Dekouver bann vre zistwar gerizon. Depi 10 banlane, l\'ONG Enn Rev Enn Sourir ek Med360 finn akonpagn plis ki 1 200 pasian ver bon swen pou redonn sourir ek lafwa dan lasante.',
              'Read genuine stories of hope, strength, and recovery. Over 10 years, our team has walked beside more than 1,200 patients and their families, guiding them to safe medical care and renewed well-being.'
            ))}
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: '2rem var(--space-6) 4rem' }}>
        {/* Patient Reassurance Helper Card */}
        <div className="spec-helper-card" style={{ marginBottom: '1.75rem' }}>
          <div className="spec-helper-card__left">
            <div className="spec-helper-card__icon" aria-hidden="true">
              <HelpCircle size={28} />
            </div>
            <div>
              <h3 className="spec-helper-card__title">
                {l10n(
                  'Vous ou un proche vivez une situation similaire ?',
                  'Ou ouswa enn pros pe fer fas ar mem kalite problem lasante ?',
                  'Going through a similar medical challenge?'
                )}
              </h3>
              <p className="spec-helper-card__desc">
                {l10n(
                  'Chaque parcours de guérison est unique. Notre équipe médicale et nos coordinateurs dévoués sont à vos côtés pour vous rassurer, vous orienter et vous apporter les meilleurs soins au juste coût.',
                  'Sak parskour li inik. Nou lekip medikal ek nou bann koordinater la pou ekout ou, gid ou ek donn ou meyer swen posib avek leker.',
                  'Every journey is unique. Our caring medical board and patient coordinators are here to guide, reassure, and find the safest treatment options for you.'
                )}
              </p>
            </div>
          </div>
          <div className="spec-helper-card__actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/describe-need?from=Case+Studies+Top+Banner&serviceName=Patient+Case+Review')}
            >
              ✍ {l10n('Partager mon cas', 'Partaz mo ka', 'Share My Case')}
            </button>
            <a
              href={buildMed360WhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>

        {/* Quick Condition / Symptom Filters */}
        <div className="spec-symptom-chips-container" style={{ marginBottom: '1.75rem' }}>
          <div className="spec-symptom-chips-label">
            <Sparkles size={14} />
            <span>{l10n('Filtrer par type de traitement ou besoin :', 'Filtre par tretman ouswa douler :', 'Quick filter by treatment or condition:')}</span>
          </div>
          <div className="spec-symptom-chips" role="tablist" aria-label="Specialty filter chips">
            {QUICK_SYMPTOM_FILTERS.map((chip) => {
              const label = chip[`label_${langKey}`] || chip.label_en;
              const isActive = selectedSpecialty === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`spec-symptom-chip ${isActive ? 'spec-symptom-chip--active' : ''}`}
                  onClick={() => {
                    setSelectedSpecialty(chip.id);
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
            searchPlaceholder={l10n('Rechercher par maladie ou traitement (ex: genou, pontage, cancer)...', 'Rod par maladi ouswa tretman (ex: zounou, leker, kanser)...', 'Search patient stories or condition (e.g. knee, bypass, cancer)...')}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOptions={sortOptions}
            totalCount={sortedCaseStudies.length}
            countUnit={isFr ? 'dossier' : isKr ? 'dosie' : 'case'}
            countUnitPlural={isFr ? 'dossiers' : isKr ? 'dosie' : 'cases'}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            extraControls={
              <>
                {/* Specialty Filter Pill */}
                <div className="list-toolbar__filter-pill">
                  <select
                    className="list-toolbar__filter-select"
                    value={selectedSpecialty}
                    onChange={e => { setSelectedSpecialty(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="all">{l10n('🩺 Toutes les Spécialités', '🩺 Tou Spesialite', '🩺 All Specialties')}</option>
                    {specialties.map(s => (
                      <option key={s.id} value={s.id}>{l(s, 'name')}</option>
                    ))}
                  </select>
                </div>

                {/* Country Filter Pill */}
                <div className="list-toolbar__filter-pill">
                  <select
                    className="list-toolbar__filter-select"
                    value={selectedCountry}
                    onChange={e => { setSelectedCountry(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="all">{l10n('🌐 Tous les pays', '🌐 Tou pei', '🌐 All Countries')}</option>
                    {countries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Clear Active Filters */}
                {(searchQuery || selectedSpecialty !== 'all' || selectedCountry !== 'all') && (
                  <button
                    type="button"
                    className="list-toolbar__clear-btn"
                    onClick={() => { setSearchQuery(''); setSelectedSpecialty('all'); setSelectedCountry('all'); setCurrentPage(1); }}
                  >
                    ↺ {l10n('Effacer', 'Efase', 'Clear')}
                  </button>
                )}
              </>
            }
          />
        )}

        <div className={`cs-grid ${viewMode === 'list' ? 'cs-grid--list-view' : ''}`}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 400, borderRadius: 16 }} />
              ))
            : paginatedCaseStudies.map(cs => {
                const symptomEntry = cs.specialtyId ? SPECIALTY_SYMPTOMS_MAP[cs.specialtyId]?.[langKey] : null;
                return (
                  <div key={cs.id} className="cs-card" id={`cs-card-${cs.id}`}>
                    <div className="cs-card__image">
                      <img
                        src={cs.imageUrl}
                        alt={l(cs, 'condition')}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = '/assets/banners/casestudies_banner.jpg'; }}
                      />
                      <div className="cs-card__overlay" />
                      <div className="cs-card__savings">{l10n('Économisé', 'Sov', 'Saved')} {cs.costSavedPercent}%</div>
                      <div className="cs-card__specialty">
                        {symptomEntry ? symptomEntry.badge : getSpecialtyName(cs.specialtyId)}
                      </div>
                    </div>
                    <div className="cs-card__body">
                      <h3 className="cs-card__condition">{l(cs, 'condition')}</h3>
                      <p className="cs-card__treatment"><strong>{l10n('Traitement :', 'Tretman :', 'Treatment:')}</strong> {l(cs, 'treatment')}</p>
                      <div className="cs-card__testimonial">
                        <div className="cs-card__stars">
                          {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#ffb400" color="#ffb400" />)}
                        </div>
                        <p>&ldquo;{truncateText(l(cs, 'testimonial'), 180)}&rdquo;</p>
                      </div>
                      <div className="cs-card__outcome">
                        <strong>{l10n('Résultat :', 'Rezilta :', 'Outcome:')}</strong> {truncateText(l(cs, 'outcome'), 120)}
                      </div>
                      <div className="cs-card__footer">
                        <div>
                          <strong>{cs.patientFirstName}</strong>, {cs.patientAge} — {l(cs, 'patientCountry')}
                        </div>
                        <div className="cs-card__duration">{cs.durationDays} {l10n('jours', 'zour', 'days')} · {cs.year}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={sortedCaseStudies.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(p) => {
            setCurrentPage(p);
            window.scrollTo({ top: 380, behavior: 'smooth' });
          }}
          onItemsPerPageChange={setItemsPerPage}
          pageSizeOptions={[6, 9, 12]}
          unitName={isFr ? 'témoignages' : isKr ? 'temwagnaz' : 'case studies'}
        />

        <div style={{ textAlign: 'center', marginTop: '3rem', background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '3rem' }}>
          <h2 className="text-h2" style={{ marginBottom: '1rem' }}>
            {tCms('ctaTitle', l10n('Pourriez-vous être notre prochaine success story ?', 'Ou kapav vinn nou prosenn zistwar a-sikse?', 'Could You Be Our Next Success Story?'))}
          </h2>
          <p className="text-lead" style={{ marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
            {tCms('ctaDesc', l10n(
              'Rejoignez des milliers de patients qui ont fait confiance à Med360 pour trouver les meilleurs soins au bon prix.',
              'Rezwenn milye pasian ki finn fer Med360 konfians pou gagn pli bon swen ek pli bon pri.',
              'Join thousands of patients who trusted Med360 to find them the best care at the right price.'
            ))}
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/describe-need?from=Case+Studies+Bottom+CTA&serviceName=Treatment+Plan+Inquiry')} id="cs-cta-btn">
            {t('home.process.startBtn')} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </main>
  );
}
