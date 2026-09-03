import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Home, Stethoscope, Building2, Calculator, MessageCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../../components/SEO/SEO';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';

export function NotFoundPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/specialties?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <main style={{
      minHeight: '80vh',
      paddingTop: 'calc(var(--navbar-height) + 3rem)',
      paddingBottom: '5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
    }}>
      <SEO
        title={isFr ? 'Page Non Trouvée (404)' : isKr ? 'Paz Pa Trouve (404)' : 'Page Not Found (404)'}
        description="The medical page or resource you are looking for may have moved or been updated."
        noIndex={true}
      />

      <div className="container" style={{ maxWidth: 680, textAlign: 'center' }}>
        {/* Error Code Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1.5px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
          borderRadius: 999,
          padding: '0.4rem 1.25rem',
          fontWeight: 800,
          fontSize: '0.875rem',
          marginBottom: '1.5rem',
        }}>
          <span>✦ Error 404 · Page Not Found</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
          fontWeight: 900,
          fontFamily: 'var(--font-display)',
          color: 'var(--color-text)',
          lineHeight: 1.15,
          marginBottom: '1rem',
        }}>
          {isFr ? 'Page Introuvable' : isKr ? 'Nou Pa Finn Trouv Sa Paz La' : 'We Couldn\'t Find That Medical Page'}
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
          marginBottom: '2rem',
          maxWidth: 540,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          {isFr
            ? 'Le lien que vous avez suivi a peut-être changé ou n\'existe plus. Recherchez une spécialité médicale ou utilisez les liens ci-dessous :'
            : isKr
            ? 'Lien ki ou finn klike kitfwa finn sanze. Fer enn resers spesialite ouswa servi bann roursi anba la :'
            : 'The medical department or page you are looking for may have been updated. Search our directory or navigate directly to a key medical service below:'}
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ maxWidth: 480, margin: '0 auto 2.5rem', display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isFr ? 'Rechercher une spécialité (ex: Cardiologie)...' : 'Search specialty (e.g. Cardiology)...'}
              className="form-input"
              style={{ paddingLeft: '2.75rem', height: 48, fontSize: '0.95rem', borderRadius: 'var(--radius-xl)' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem', height: 48, borderRadius: 'var(--radius-xl)', fontWeight: 700 }}>
            {isFr ? 'Rechercher' : 'Search'}
          </button>
        </form>

        {/* Quick Links Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          textAlign: 'left',
          marginBottom: '2.5rem',
        }}>
          <Link to="/" style={{ textDecoration: 'none' }} className="card card--interactive">
            <div style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(6, 95, 70, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Home size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>Home Page</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Main concierge hub</div>
              </div>
            </div>
          </Link>

          <Link to="/specialties" style={{ textDecoration: 'none' }} className="card card--interactive">
            <div style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(6, 95, 70, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Stethoscope size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>Specialties</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>10+ clinical disciplines</div>
              </div>
            </div>
          </Link>

          <Link to="/hospitals" style={{ textDecoration: 'none' }} className="card card--interactive">
            <div style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(6, 95, 70, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>Hospitals</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Accredited network</div>
              </div>
            </div>
          </Link>

          <Link to="/cost-calculator" style={{ textDecoration: 'none' }} className="card card--interactive">
            <div style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(6, 95, 70, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calculator size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>Calculator</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Compare global pricing</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Direct Action */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/describe-need" className="btn btn-primary btn-lg" style={{ gap: '0.5rem', textDecoration: 'none', fontWeight: 700 }}>
            <span>{isFr ? 'Avis Médical Gratuit' : 'Free Medical Assessment'}</span>
            <ArrowRight size={16} />
          </Link>
          <a href={buildMed360WhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg" style={{ textDecoration: 'none', fontWeight: 700 }}>
            <MessageCircle size={18} />
            <span>WhatsApp Us (24/7)</span>
          </a>
        </div>
      </div>
    </main>
  );
}
