import { Users, Award } from 'lucide-react';
import { useL10n } from '../../hooks/useL10n';

export function LeadershipBriefSection() {
  const { l10n } = useL10n();

  return (
    <section aria-labelledby="leadership-brief-heading" style={{ marginBottom: '5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 2.5rem' }}>
        <span className="section-label">
          {l10n('✦ Direction & Gouvernance', '✦ Direksion & Gouvernans', '✦ Leadership & Vision')}
        </span>
        <h2 id="leadership-brief-heading" className="text-h2" style={{ marginBottom: '0.6rem' }}>
          {l10n(
            'Transparence, Éthique & Un Nouveau Chapitre',
            'Transparans, Etik & Enn Nouvo Sapit',
            'Leadership Built on Transparency & Solidarity'
          )}
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Card 1: Karan Juglall */}
        <article
          style={{
            background: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            borderTop: '4px solid var(--color-primary)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'clamp(1.75rem, 3vw, 2.5rem)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img
              src="/assets/team/karan-juglall.jpg"
              alt="Karan Juglall — Founder & Executive Director of Enn Rev Enn Sourir"
              width={74}
              height={74}
              loading="lazy"
              style={{
                width: 74,
                height: 74,
                borderRadius: '16px',
                objectFit: 'cover',
                objectPosition: 'center top',
                border: '2.5px solid var(--color-primary)',
                boxShadow: '0 6px 18px rgba(13, 148, 136, 0.25)',
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Karan Juglall · Founder &amp; Executive Director
              </div>
              <h3 style={{ margin: '0.15rem 0 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
                Transparency, Ethics and Putting Patients First
              </h3>
            </div>
          </div>

          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.72, fontSize: '0.94rem', margin: 0 }}>
            For <strong>Karan Juglall</strong>, founder and Executive Director of Enn Rev Enn Sourir, MED 360 is the culmination of a project that has been in the making for many years. He explains that its development was accelerated by concerns over certain practices in the medical travel sector, particularly regarding pricing and commercial communication.
          </p>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.72, fontSize: '0.94rem', margin: 0 }}>
            He advocates for an approach based on clear information, appropriate services and the primacy of the patient’s best interests. He therefore encourages anyone considering treatment abroad to compare offers, costs and the services actually included.
          </p>
          <div
            style={{
              marginTop: 'auto',
              padding: '0.95rem 1.15rem',
              background: 'rgba(13, 148, 136, 0.08)',
              borderLeft: '3.5px solid var(--color-primary)',
              borderRadius: '0 var(--radius-md) var(--radius-md) 0',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--color-text)',
              lineHeight: 1.6,
            }}
          >
            The stated ambition is to provide high-quality support at a fair and controlled cost, without setting care abroad in opposition to the healthcare services available in Mauritius.
          </div>
        </article>

        {/* Card 2: A New Chapter — Luciano Azor & Delphine Dhollah */}
        <article
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(11,90,138,0.06) 100%)',
            border: '1.5px solid rgba(16, 185, 129, 0.28)',
            borderTop: '4px solid #0b5a8a',
            borderRadius: 'var(--radius-2xl)',
            padding: 'clamp(1.75rem, 3vw, 2.5rem)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Users size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0b5a8a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Inclusive Leadership · Luciano Azor &amp; Delphine Dhollah
              </div>
              <h3 style={{ margin: '0.15rem 0 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
                A New Chapter for Enn Rev Enn Sourir
              </h3>
            </div>
          </div>

          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.72, fontSize: '0.94rem', margin: 0 }}>
            The launch also provided an opportunity to present <strong>Luciano Azor</strong>, a former goodwill ambassador for the NGO, who is now joining MED 360 as a director. For <strong>Delphine Dhollah</strong>, this commitment reflects the organisation’s determination to embody its values of inclusion and equal opportunity within its leadership structures.
          </p>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.72, fontSize: '0.94rem', margin: 0 }}>
            With MED 360, Enn Rev Enn Sourir is opening a new chapter in its work: turning the support provided to some into a resource to help others, and embedding solidarity within a sustainable model.
          </p>

          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              paddingTop: '0.5rem',
            }}
          >
            {[
              'Karan Juglall · Founder & Executive Director',
              'Luciano Azor · Director, MED 360',
              'Delphine Dhollah · Leadership & Inclusion',
            ].map((tag) => (
              <span
                key={tag}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                }}
              >
                <Award size={13} color="var(--color-primary)" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
