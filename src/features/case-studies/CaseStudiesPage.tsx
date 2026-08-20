import { useNavigate } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCaseStudies } from '../../hooks/useCaseStudies';
import { useSpecialties } from '../../hooks/useSpecialties';
import { truncateText } from '../../core/services/format.service';
import { SEO } from '../../components/SEO/SEO';
import { useCMS } from '../../hooks/useCMS';
import './CaseStudies.css';

export function CaseStudiesPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { caseStudies, loading } = useCaseStudies();
  const { specialties } = useSpecialties();
  const { data: cms } = useCMS('case-studies');

  const l10n = (fr: string, kr: string, en: string) => i18n.language === 'fr' ? fr : i18n.language === 'kr' ? kr : en;
  const l = (obj: any, field: string) => obj[`${field}_${i18n.language}`] || obj[field];

  const tCms = (key: string, fallback: string) => {
    if (!cms?.content?.[key]) return fallback;
    return cms.content[key][i18n.language] || cms.content[key]['en'] || fallback;
  };

  function getSpecialtyName(id: string) {
    const s = specialties.find(s => s.id === id);
    return s ? l(s, 'name') : id;
  }

  return (
    <main className="case-studies-page" style={{ paddingTop: 'var(--navbar-height)' }}>
      <SEO 
        title={l10n('Histoires de Patients', 'Zistwar Pasian', 'Patient Stories')}
        description={l10n('Découvrez nos histoires de patients réussies.', 'Dekouver nou bann zistwar pasian ki finn reisi.', 'Discover our successful patient stories.')}
        canonical="/case-studies"
      />
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="container page-hero__inner">
          <span className="section-label" style={{ color: 'var(--color-accent)' }}>
            {tCms('heroLabel', l10n('Témoignages de Patients', 'Zistwar Bann Pasian', 'Patient Stories'))}
          </span>
          <h1 className="text-h1" style={{ color: 'white' }}>
            {tCms('heroTitle', l10n('Études de Cas', 'Temwagnaz', 'Case Studies'))}
          </h1>
          <p className="text-lead" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 540 }}>
            {tCms('heroDesc', l10n(
              'Des histoires vraies de vrais patients. Lisez comment Medical 360 a facilité des traitements vitaux pour des patients de l\'Île Maurice et de l\'océan Indien.',
              'Vre zistwar depi vre pasian. Lir kouma Medical 360 finn ed bann pasian depi Moris ek l\'osean Indien gagn tretman ki finn sov zot lavi.',
              'Real stories from real patients. Read how Medical 360 facilitated life-changing treatments for patients from Mauritius and across the Indian Ocean region.'
            ))}
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: '3rem var(--space-6)' }}>
        <div className="cs-grid">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 400, borderRadius: 16 }} />
              ))
            : caseStudies.map(cs => (
                <div key={cs.id} className="cs-card" id={`cs-card-${cs.id}`}>
                  <div className="cs-card__image">
                    <img src={cs.imageUrl} alt={l(cs, 'condition')} loading="lazy" />
                    <div className="cs-card__overlay" />
                    <div className="cs-card__savings">{l10n('Économisé', 'Sov', 'Saved')} {cs.costSavedPercent}%</div>
                    <div className="cs-card__specialty">{getSpecialtyName(cs.specialtyId)}</div>
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
              ))
          }
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem', background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '3rem' }}>
          <h2 className="text-h2" style={{ marginBottom: '1rem' }}>
            {tCms('ctaTitle', l10n('Pourriez-vous être notre prochaine success story ?', 'Ou kapav vinn nou prosenn zistwar a-sikse?', 'Could You Be Our Next Success Story?'))}
          </h2>
          <p className="text-lead" style={{ marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
            {tCms('ctaDesc', l10n(
              'Rejoignez des milliers de patients qui ont fait confiance à Medical 360 pour trouver les meilleurs soins au bon prix.',
              'Rezwenn milye pasian ki finn fer Medical 360 konfians pou gagn pli bon swen ek pli bon pri.',
              'Join thousands of patients who trusted Medical 360 to find them the best care at the right price.'
            ))}
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/describe-need')} id="cs-cta-btn">
            {t('home.process.startBtn')} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </main>
  );
}
