import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSpecialties } from '../../hooks/useSpecialties';
import { formatCostRange } from '../../core/services/format.service';
import { SEO } from '../../components/SEO/SEO';
import { useCMS } from '../../hooks/useCMS';
import './Specialties.css';

export function SpecialtiesPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { specialties, loading } = useSpecialties();
  const { data: cms } = useCMS('specialties');

  const l10n = (fr: string, kr: string, en: string) => i18n.language === 'fr' ? fr : i18n.language === 'kr' ? kr : en;
  const l = (obj: any, field: string) => obj[`${field}_${i18n.language}`] || obj[field];

  const tCms = (key: string, fallback: string) => {
    if (!cms?.content?.[key]) return fallback;
    return cms.content[key][i18n.language] || cms.content[key]['en'] || fallback;
  };

  return (
    <main className="specialties-page" style={{ paddingTop: 'var(--navbar-height)' }}>
      <SEO 
        title={l10n('Centres d\'Excellence', 'Sant Ekselans', 'Centers of Excellence')}
        description={l10n('Découvrez nos spécialités médicales.', 'Dekouver nou bann spesialite medikal.', 'Discover our medical specialties.')}
        canonical="/specialties"
      />
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="container page-hero__inner">
          <span className="section-label" style={{ color: 'var(--color-accent)' }}>
            {tCms('heroLabel', l10n('Expertise Médicale', 'Exspertiz Medikal', 'Medical Expertise'))}
          </span>
          <h1 className="text-h1" style={{ color: 'white' }}>
            {tCms('heroTitle', l10n('Sélectionnez Votre Spécialité', 'Swazir Ou Spesialite', 'Select Your Specialty'))}
          </h1>
          <p className="text-lead" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 540 }}>
            {tCms('heroDesc', l10n(
              'Parcourez notre gamme complète de spécialités médicales. Cliquez sur une spécialité pour voir les procédures, les coûts estimés et obtenir un avis sur mesure.',
              'Get tou bann spesialite medikal ki nou ofer. Klik lor enn spesialite pou trouv bann tretman, pri estime, ek gagn enn lavi medikal personnaliser.',
              'Browse our full range of medical specialties. Click any specialty to view procedures, estimated costs, and get a tailored opinion.'
            ))}
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: '3rem var(--space-6)' }}>
        <div className="spec-grid">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 320, borderRadius: 16 }} />
              ))
            : specialties.map((sp) => (
                <div key={sp.id} className="spec-card" id={`spec-card-${sp.id}`} style={{ cursor: 'pointer' }}>
                  <div className="spec-card__image" onClick={() => navigate(`/specialties/${sp.id}`)}>
                    <img src={sp.imageUrl} alt={l(sp, 'name')} loading="lazy" />
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
      </div>
    </main>
  );
}
