import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../../components/SEO/SEO';
import { useCMS } from '../../hooks/useCMS';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { ListToolbar, type SortOption } from '../../components/ListToolbar/ListToolbar';
import './Services.css';

const SERVICES = [
  {
    id: 'srv-opinion',
    title: 'Free Medical Opinion',
    title_fr: 'Avis Médical Gratuit',
    desc: 'Share your reports and our partner specialists will provide a professional second opinion and treatment plan at zero cost.',
    desc_fr: 'Partagez vos rapports et nos spécialistes partenaires vous fourniront un deuxième avis professionnel et un plan de traitement sans frais.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    tag: 'Free Service',
    tag_fr: 'Service Gratuit',
  },
  {
    id: 'srv-manager',
    title: 'Dedicated Case Manager',
    title_fr: 'Coordinateur Dédié',
    desc: 'A personal case manager is assigned to your case and remains your single, continuous point of contact throughout the entire journey.',
    desc_fr: 'Un coordinateur personnel est assigné à votre dossier et reste votre point de contact unique et continu tout au long de votre parcours.',
    imageUrl: '/assets/consultation-support.jpg',
    tag: '1-on-1 Care',
    tag_fr: 'Suivi Personnalisé',
  },
  {
    id: 'srv-travel',
    title: 'Travel & Visa Assistance',
    title_fr: 'Assistance Voyage & Visa',
    desc: 'We guide you through the medical visa process with hospital invitation letters, flight itineraries, and companion paperwork.',
    desc_fr: 'Nous vous guidons dans les démarches de visa médical avec des lettres d\'invitation de l\'hôpital, des itinéraires de vol et les documents pour vos accompagnateurs.',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    tag: 'Full Logistics',
    tag_fr: 'Logistique Complète',
  },
  {
    id: 'srv-hotel',
    title: 'Accommodation Booking',
    title_fr: 'Réservation d\'Hébergement',
    desc: 'We arrange comfortable, verified hotels or serviced apartments near the hospital for you and accompanying family members.',
    desc_fr: 'Nous organisons des hôtels ou des appartements de service vérifiés et confortables près de l\'hôpital pour vous et votre famille qui vous accompagne.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    tag: 'Partner Rates',
    tag_fr: 'Tarifs Partenaires',
  },
  {
    id: 'srv-transfer',
    title: 'Airport Transfers',
    title_fr: 'Transferts Aéroport',
    desc: 'Dedicated airport pickup and drop-off coordinated seamlessly with your flight schedule and initial hospital appointments.',
    desc_fr: 'Prise en charge et retour à l\'aéroport coordonnés de manière transparente avec vos horaires de vol et vos premiers rendez-vous à l\'hôpital.',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80',
    tag: 'Seamless Transit',
    tag_fr: 'Transit Fluide',
  },
  {
    id: 'srv-interpreter',
    title: 'Interpreter Services',
    title_fr: 'Services d\'Interprète',
    desc: 'French, Creole, Hindi, and multilingual interpreters available to accompany you during medical consultations and hospital rounds.',
    desc_fr: 'Des interprètes français, créoles, hindis et multilingues sont disponibles pour vous accompagner lors des consultations médicales et des visites à l\'hôpital.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    tag: 'Language Support',
    tag_fr: 'Support Linguistique',
  },
  {
    id: 'srv-support',
    title: 'In-Hospital Support',
    title_fr: 'Soutien à l\'Hôpital',
    desc: 'Our local on-ground coordinator visits you regularly during your stay, liaising with nursing staff and updating your family.',
    desc_fr: 'Notre coordinateur local sur le terrain vous rend visite régulièrement pendant votre séjour, assurant la liaison avec le personnel infirmier et tenant votre famille informée.',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80',
    tag: 'On-Ground Care',
    tag_fr: 'Soins sur Place',
  },
  {
    id: 'srv-followup',
    title: 'Post-Treatment Follow-Up',
    title_fr: 'Suivi Post-Traitement',
    desc: 'After returning home, we coordinate virtual doctor check-ups, review post-op lab reports, and arrange prescription deliveries.',
    desc_fr: 'Après votre retour à la maison, nous coordonnons des contrôles médicaux virtuels, examinons les rapports de laboratoire post-opératoires et organisons les livraisons de vos ordonnances.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    tag: 'Recovery Care',
    tag_fr: 'Soins de Récupération',
  },
];

export function ServicesPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { data: cms } = useCMS('services');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const l = (obj: any, field: string) => obj[`${field}_${i18n.language}`] || obj[field];
  const l10n = (fr: string, cre: string, en: string) => i18n.language === 'fr' ? fr : i18n.language === 'cre' || i18n.language === 'kr' ? cre : en;
  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr' || i18n.language === 'cre';

  const tCms = (key: string, fallback: string) => {
    if (!cms?.content?.[key]) return fallback;
    return cms.content[key][i18n.language] || cms.content[key]['en'] || fallback;
  };

  const sortOptions: SortOption[] = [
    { value: 'recommended', label: isFr ? 'Recommandés' : isKr ? 'Rekommande' : 'Recommended', icon: '⚡' },
    { value: 'name', label: isFr ? 'Nom (A-Z)' : isKr ? 'Nom (A-Z)' : 'Name (A-Z)', icon: '🔤' },
  ];

  const filteredServices = SERVICES.filter((srv) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = l(srv, 'title').toLowerCase().includes(q) || srv.title.toLowerCase().includes(q);
    const descMatch = l(srv, 'desc').toLowerCase().includes(q) || srv.desc.toLowerCase().includes(q);
    const tagMatch = (l(srv, 'tag') || '').toLowerCase().includes(q);
    return titleMatch || descMatch || tagMatch;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === 'name') return l(a, 'title').localeCompare(l(b, 'title'));
    return 0;
  });

  return (
    <main style={{ paddingTop: 'var(--navbar-height)' }}>
      <SEO 
        title={l10n('Nos Services', 'Nou Bann Servis', 'Our Services')}
        description={l10n('Découvrez nos services complets.', 'Dekouver nou bann servis konple.', 'Discover our comprehensive services.')}
        canonical="/services"
      />
      {/* Header Banner */}
      <section className="page-hero--banner" style={{ backgroundImage: 'url(/assets/banners/services_banner.jpg)' }}>
        <div className="container page-hero__inner">
          <span className="section-label">
            {tCms('heroLabel', l10n('Conciergerie Complète', 'Full Concierge', 'Full Concierge'))}
          </span>
          <h1 className="text-h1">
            {tCms('heroTitle', l10n('Nos Services Couvrent Tous Vos Besoins', 'Nou Bann Servis Kouver Tou Ou Bizin', 'Our Services Cover Every Need'))}
          </h1>
          <p className="text-lead">
            {tCms('heroDesc', l10n(
              'De votre première demande au suivi post-traitement, Medical 360 s\'occupe de chaque détail de votre parcours de santé à l\'étranger.',
              'Depi premie demann ziska swivi apre tretman, Medical 360 okip tou bann detay dan ou vwayaz medikal.',
              'From your first inquiry to post-treatment follow-up, Medical 360 handles every detail of your healthcare journey abroad.'
            ))}
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}>
        <div className="container">
          {/* Unified List Toolbar */}
          <div style={{ marginBottom: '2.5rem' }}>
            <ListToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder={l10n('Rechercher un service...', 'Rod enn servis...', 'Search services...')}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortOptions={sortOptions}
              totalCount={sortedServices.length}
              countUnit={isFr ? 'service' : isKr ? 'servis' : 'service'}
              countUnitPlural={isFr ? 'services' : isKr ? 'servis' : 'services'}
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
          </div>

          <div className={`services-cards-grid ${viewMode === 'list' ? 'services-cards-grid--list-view' : ''}`}>
            {sortedServices.map((srv, i) => (
              <div
                key={srv.id}
                className={`service-full-card animate-fade-in-up delay-${(i % 4) + 1}`}
                id={`service-card-${srv.id}`}
                onClick={() => navigate('/describe-need')}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate('/describe-need')}
              >
                <img src={srv.imageUrl} alt={l(srv, 'title')} className="service-full-card__img" loading="lazy" />
                <div className="service-full-card__overlay" />
                <span className="service-full-card__tag">{l(srv, 'tag')}</span>
                <div className="service-full-card__content">
                  <h3 className="service-full-card__title">{l(srv, 'title')}</h3>
                  <p className="service-full-card__desc">{l(srv, 'desc')}</p>
                  <div className="service-full-card__action">
                    <span className="service-full-card__btn">
                      {t('common.requestService')} <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '4.5rem', marginBottom: '2rem', display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/describe-need')} id="services-cta-btn" style={{ padding: '0.85rem 2rem' }}>
              {t('common.getStarted')} <ArrowRight size={18} />
            </button>
            <a href={buildMed360WhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg" style={{ padding: '0.85rem 2rem' }}>
              <MessageCircle size={18} /> {t('nav.whatsapp')}: 59188275
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
