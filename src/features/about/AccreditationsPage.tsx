import { useState } from 'react';
import {
  ArrowRight,
  MessageCircle,
  Award,
  ExternalLink,
  Download,
  ShieldCheck,
  Maximize2,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useL10n } from '../../hooks/useL10n';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { SEO } from '../../components/SEO/SEO';
import { OFFICIAL_CERTIFICATES } from './aboutContent';
import './About.css';

export function AccreditationsPage() {
  const navigate = useNavigate();
  const { l10n, l } = useL10n();
  const [activeCertId, setActiveCertId] = useState<string>(OFFICIAL_CERTIFICATES[0].id);
  const activeCert = OFFICIAL_CERTIFICATES.find((c) => c.id === activeCertId) || OFFICIAL_CERTIFICATES[0];

  return (
    <main className="about-page">
      <SEO
        pageKey="accreditations"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About Us', path: '/about' },
          { name: 'Accreditations', path: '/accreditations' },
        ]}
      />

      <section className="about-section" style={{ paddingTop: 'clamp(2rem, 4vw, 3.25rem)' }}>
        <div className="container">
          {/* Interactive Official Credentials Spotlight (UICC, SIOP, CCI) */}
          <section className="about-creds-stage" style={{ borderTop: 'none', paddingTop: 0 }} aria-labelledby="accreditations-heading">
            <div className="about-creds-top">
              <div>
                <span className="about-awards-eyebrow">
                  <Award size={14} />
                  {l10n(
                    'Accréditations & Certificats Officiels Vérifiés',
                    'Sertifika & Rekonesans Ofisiel Verifie',
                    'Verified International Credentials'
                  )}
                </span>
                <h1 id="accreditations-heading" className="about-creds-title">
                  {l10n(
                    'Reconnus par les Plus Hautes Instances Mondiales',
                    'Rekonet par Bann Pli Gran Instans Mondial',
                    'Recognised by Global Oncology Institutions'
                  )}
                </h1>
              </div>
              <p className="about-creds-lead">
                {l10n(
                  'Chaque certificat ci-dessous est un document officiel signé détenu par Enn Rev Enn Sourir (UICC Genève, SIOP Genève, CCI Amsterdam). Sélectionnez une institution pour inspecter l\'original.',
                  'Sak sertifika anba la se enn dokiman ofisiel sinye ki Enn Rev Enn Sourir posede (UICC Zenev, SIOP Zenev, CCI Amsterdam). Swazir enn linstitision pou get lorizinal.',
                  'Every credential below is a signed official document held by Enn Rev Enn Sourir (UICC Geneva, SIOP Geneva, CCI Amsterdam). Select an institution to inspect the original certificate.'
                )}
              </p>
            </div>

            <div className="about-creds-split">
              {/* Left: Editorial Selector Rail */}
              <div className="about-creds-rail" role="tablist" aria-label="Official international certificates">
                {OFFICIAL_CERTIFICATES.map((cert, idx) => {
                  const isActive = cert.id === activeCert.id;
                  return (
                    <button
                      key={cert.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveCertId(cert.id)}
                      className={`about-creds-tab ${isActive ? 'about-creds-tab--active' : ''}`}
                    >
                      <div className="about-creds-tab__head">
                        <span className="about-creds-tab__index">0{idx + 1}</span>
                        <span className="about-creds-tab__acronym">{cert.acronym}</span>
                        <span className="about-creds-tab__year">{cert.yearBadge}</span>
                      </div>
                      <div className="about-creds-tab__org">{cert.org}</div>
                      <div className="about-creds-tab__meta">
                        <span>{cert.location}</span>
                        <span>·</span>
                        <span>{l(cert, 'status')}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right: Live High-Res Certificate Stage */}
              <div className="about-creds-viewer" role="tabpanel">
                <a
                  href={activeCert.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-creds-viewer__frame"
                  aria-label={`${activeCert.org} — ${l(activeCert, 'certificateTitle')} (PDF)`}
                >
                  <img
                    key={activeCert.id}
                    src={activeCert.previewImage}
                    alt={`${activeCert.org} — ${l(activeCert, 'certificateTitle')}`}
                    className="about-creds-viewer__img"
                    decoding="async"
                  />
                  <span className="about-creds-viewer__zoom-pill">
                    <Maximize2 size={13} />
                    <span>{l10n('Cliquer pour ouvrir le PDF signé', 'Klike pou ouver PDF sinye', 'Click to open signed PDF')}</span>
                  </span>
                </a>

                <div className="about-creds-viewer__bar">
                  <div className="about-creds-viewer__info">
                    <div className="about-creds-viewer__verified">
                      <ShieldCheck size={15} />
                      <span>{l(activeCert, 'certificateTitle')} · {activeCert.recipient}</span>
                    </div>
                    <p className="about-creds-viewer__desc">{l(activeCert, 'desc')}</p>
                    <div className="about-creds-viewer__sig">
                      {l10n('Signé par :', 'Sinye par :', 'Signed by:')} {activeCert.signatory}
                    </div>
                  </div>

                  <div className="about-creds-viewer__actions">
                    <a
                      href={activeCert.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      <Maximize2 size={14} />
                      <span>{l10n('Ouvrir en Plein Écran', 'Ouver an Gran', 'Open Full PDF')}</span>
                    </a>
                    <a href={activeCert.pdfUrl} download className="btn btn-outline btn-sm">
                      <Download size={14} />
                      <span>{l10n('Télécharger', 'Telesarz', 'Download')}</span>
                    </a>
                    <a
                      href={activeCert.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="about-creds-viewer__ext"
                    >
                      <span>{activeCert.acronym}</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Conversion Finale */}
          <div className="about-cta-finale">
            <h2>
              {l10n(
                'Des Soins Fondés sur l\'Éthique et la Confiance.',
                'Bann Swen Baze lor Etik ek Konfians.',
                'Healthcare Guided by Ethics & Verified Trust.'
              )}
            </h2>
            <p>
              {l10n(
                'Échangez dès aujourd\'hui avec un Patient Navigator Med360 pour une orientation médicale transparente et sans engagement.',
                'Koz zordi mem ar enn Patient Navigator Med360 pou enn loriansion medikal kler san okenn langazman.',
                'Speak with a Med360 Patient Navigator today for transparent, obligation-free medical coordination.'
              )}
            </p>
            <div className="about-cta-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/describe-need?from=Accreditations+Page&serviceName=Medical+Consultation')}
              >
                <span>{l10n('Demander un Rendez-vous', 'Demann enn Randevou', 'Request an Appointment')}</span>
                <ArrowRight size={18} />
              </button>
              <a
                href={buildMed360WhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
              >
                <MessageCircle size={18} />
                <span>{l10n('Discuter sur WhatsApp', 'Koz lor WhatsApp', 'Chat on WhatsApp')}</span>
              </a>
              <Link
                to="/about"
                className="btn btn-outline btn-lg"
                style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.35)' }}
              >
                <span>{l10n('Lire Notre Histoire', 'Lir Nou Zistwar', 'Read Our Story')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
export default AccreditationsPage;
