import { useNavigate } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { useCaseStudies } from '../../hooks/useCaseStudies';
import { useSpecialties } from '../../hooks/useSpecialties';
import { truncateText } from '../../core/services/format.service';
import './CaseStudies.css';

export function CaseStudiesPage() {
  const navigate = useNavigate();
  const { caseStudies, loading } = useCaseStudies();
  const { specialties } = useSpecialties();

  function getSpecialtyName(id: string) {
    return specialties.find(s => s.id === id)?.name ?? id;
  }

  return (
    <main style={{ paddingTop: 'var(--navbar-height)' }}>
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="container page-hero__inner">
          <span className="section-label" style={{ color: 'var(--color-accent)' }}>Patient Stories</span>
          <h1 className="text-h1" style={{ color: 'white' }}>Case Studies</h1>
          <p className="text-lead" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 540 }}>
            Real stories from real patients. Read how Medical 360 facilitated life-changing treatments for patients from Mauritius and across the Indian Ocean region.
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
                    <img src={cs.imageUrl} alt={cs.condition} loading="lazy" />
                    <div className="cs-card__overlay" />
                    <div className="cs-card__savings">Saved {cs.costSavedPercent}% vs. home</div>
                    <div className="cs-card__specialty">{getSpecialtyName(cs.specialtyId)}</div>
                  </div>
                  <div className="cs-card__body">
                    <h3 className="cs-card__condition">{cs.condition}</h3>
                    <p className="cs-card__treatment"><strong>Treatment:</strong> {cs.treatment}</p>
                    <div className="cs-card__testimonial">
                      <div className="cs-card__stars">
                        {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#ffb400" color="#ffb400" />)}
                      </div>
                      <p>&ldquo;{truncateText(cs.testimonial, 180)}&rdquo;</p>
                    </div>
                    <div className="cs-card__outcome">
                      <strong>Outcome:</strong> {truncateText(cs.outcome, 120)}
                    </div>
                    <div className="cs-card__footer">
                      <div>
                        <strong>{cs.patientFirstName}</strong>, {cs.patientAge} — {cs.patientCountry}
                      </div>
                      <div className="cs-card__duration">{cs.durationDays} days · {cs.year}</div>
                    </div>
                  </div>
                </div>
              ))
          }
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem', background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '3rem' }}>
          <h2 className="text-h2" style={{ marginBottom: '1rem' }}>Could You Be Our Next Success Story?</h2>
          <p className="text-lead" style={{ marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
            Join thousands of patients who trusted Medical 360 to find them the best care at the right price.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/describe-need')} id="cs-cta-btn">
            Start My Journey <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </main>
  );
}
