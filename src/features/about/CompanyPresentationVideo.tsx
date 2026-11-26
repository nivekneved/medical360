import { useState } from 'react';
import { Play, ShieldCheck, Users, Globe2, ExternalLink } from 'lucide-react';
import { useL10n } from '../../hooks/useL10n';

const VIDEO_ID = 'DdzM1F3grBg';
const WATCH_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;
const EMBED_URL = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`;

export function CompanyPresentationVideo() {
  const [playing, setPlaying] = useState(false);
  const [thumbSrc, setThumbSrc] = useState(`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`);
  const { l10n } = useL10n();

  return (
    <section
      id="board-members"
      aria-labelledby="company-video-heading"
      style={{
        scrollMarginTop: '96px',
        marginBottom: '5rem',
        background: 'linear-gradient(135deg, #071318 0%, #0d2624 55%, #0b1623 100%)',
        border: '1.5px solid rgba(16, 185, 129, 0.32)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'clamp(1.75rem, 4vw, 3.25rem)',
        boxShadow: '0 24px 60px -16px rgba(6, 35, 30, 0.45)',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff',
      }}
    >
      {/* Subtle Ambient Emerald Glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-120px',
          right: '-80px',
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(1.75rem, 4vw, 3rem)',
          alignItems: 'center',
        }}
      >
        {/* Left Editorial Column */}
        <div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.9rem',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.16)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#6ee7b7',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '1.1rem',
            }}
          >
            {l10n(
              '✦ Présentation Officielle & Gouvernance',
              '✦ Prezantasion Ofisiel & Direksion',
              '✦ Official Presentation & Board Members'
            )}
          </span>

          <h2
            id="company-video-heading"
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              margin: '0 0 1rem',
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            {l10n(
              'Découvrez Med360 & Notre Conseil d\'Administration',
              'Dekouver Med360 & Nou Komite Direksion',
              'Meet the Leadership & Board Behind Med360'
            )}
          </h2>

          <p
            style={{
              color: 'rgba(226, 232, 240, 0.86)',
              fontSize: '0.96rem',
              lineHeight: 1.7,
              margin: '0 0 1.5rem',
            }}
          >
            {l10n(
              'Regardez notre présentation officielle pour rencontrer les membres du conseil d\'administration et découvrir comment Med360 associe excellence médicale mondiale et impact social au service des patients.',
              'Get nou prezantasion ofisiel pou zwenn bann manb komite direksion ek dekouver kouma Med360 konekte pasian ar bann meyer lopital mondial.',
              'Watch our official company presentation to meet our board members and discover how Med360 unites ethical governance, worldwide hospital access, and 100% social impact.'
            )}
          </p>

          <div
            style={{
              display: 'grid',
              gap: '0.65rem',
              marginBottom: '1.5rem',
            }}
          >
            {[
              {
                icon: Users,
                text: l10n(
                  'Gouvernance transparente & Conseil dédié',
                  'Gouvernans kler & Komite dedie',
                  'Transparent Governance & Dedicated Board Members'
                ),
              },
              {
                icon: ShieldCheck,
                text: l10n(
                  'Entreprise sociale — Zéro dividende, 100% impact',
                  'Antrepriz sosyal — Zero dividann, 100% impak',
                  'Social Enterprise — No Dividends, 100% Patient Impact'
                ),
              },
              {
                icon: Globe2,
                text: l10n(
                  'Accès hospitalier mondial & partenaires de référence',
                  'Akse lopital mondial & partener de referans',
                  'Worldwide Hospital Access & Premier Partner Network'
                ),
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.7rem',
                    fontSize: '0.88rem',
                    color: '#e2e8f0',
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.16)',
                      color: '#34d399',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={15} />
                  </span>
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>

          <a
            href={WATCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#6ee7b7',
              fontSize: '0.86rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <span>
              {l10n(
                'Ouvrir sur YouTube',
                'Ouver lor YouTube',
                'Watch directly on YouTube'
              )}
            </span>
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Right 16:9 Cinema Video Frame */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: '1.5px solid rgba(255, 255, 255, 0.16)',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5)',
            background: '#020617',
          }}
        >
          {playing ? (
            <iframe
              src={EMBED_URL}
              title="Med360 Company Presentation & Board Members"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label="Play Med360 Company Presentation and Board Members video"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                padding: 0,
                border: 0,
                cursor: 'pointer',
                background: '#020617',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={thumbSrc}
                alt="Med360 Company Presentation & Board Members"
                onError={() => setThumbSrc(`https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.82,
                  transition: 'transform 0.35s ease',
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(2,6,23,0.12) 0%, rgba(2,6,23,0.62) 100%)',
                }}
              />
              <span
                style={{
                  position: 'relative',
                  zIndex: 2,
                  width: 76,
                  height: 76,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 0 12px rgba(16, 185, 129, 0.22), 0 12px 28px rgba(0, 0, 0, 0.45)',
                }}
              >
                <Play size={32} fill="#ffffff" style={{ marginLeft: 4 }} />
              </span>
              <span
                style={{
                  position: 'absolute',
                  bottom: 14,
                  left: 16,
                  right: 16,
                  zIndex: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                }}
              >
                <span>Med360 · Company Presentation &amp; Board Members</span>
                <span
                  style={{
                    background: 'rgba(15, 23, 42, 0.78)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                  }}
                >
                  HD Video
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
