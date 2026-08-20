import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSpecialties } from '../../hooks/useSpecialties';
import { formatCostRange } from '../../core/services/format.service';
import './Specialties.css';

export function SpecialtiesPage() {
  const navigate = useNavigate();
  const { specialties, loading } = useSpecialties();

  return (
    <main style={{ paddingTop: 'var(--navbar-height)' }}>
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="container page-hero__inner">
          <span className="section-label" style={{ color: 'var(--color-accent)' }}>Medical Expertise</span>
          <h1 className="text-h1" style={{ color: 'white' }}>Select Your Specialty</h1>
          <p className="text-lead" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 540 }}>
            Browse our full range of medical specialties. Click any specialty to view procedures, estimated costs, and get a tailored opinion.
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
                <div key={sp.id} className="spec-card" id={`spec-card-${sp.id}`}>
                  <div className="spec-card__image">
                    <img src={sp.imageUrl} alt={sp.name} loading="lazy" />
                    <div className="spec-card__overlay" />
                    <h2 className="spec-card__name">{sp.name}</h2>
                  </div>
                  <div className="spec-card__body">
                    <p className="spec-card__desc">{sp.shortDescription}</p>
                    <div className="spec-card__procedures">
                      {sp.procedures.slice(0, 3).map((proc) => (
                        <div key={proc.id} className="spec-procedure">
                          <span>{proc.name}</span>
                          <span className="spec-procedure__cost">
                            {formatCostRange(proc.estimatedCostUSD.min, proc.estimatedCostUSD.max)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/describe-need?specialty=${sp.id}`)}
                      id={`spec-inquire-${sp.id}-btn`}
                      style={{ marginTop: 'auto', width: '100%' }}
                    >
                      Get Opinion for {sp.name} <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </main>
  );
}
