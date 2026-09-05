import { HeartPulse, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCMS } from '../../../hooks/useCMS';
import './MissionMarquee.css';

export function MissionMarquee() {
  const { t, i18n } = useTranslation();
  const { data: cmsData } = useCMS('marquee');

  const lang = i18n.language as 'en' | 'fr' | 'kr';
  const isFr = lang === 'fr';
  const isKr = lang === 'kr';

  // Check if marquee is disabled by admin
  const isEnabled = cmsData?.content?.enabled !== 'false' && cmsData?.content?.enabled !== false;
  if (!isEnabled) {
    return null;
  }

  // Dynamic values with fallback to translations / seeds
  const speedSeconds = cmsData?.content?.speedSeconds || '45';
  
  const customBadge = cmsData?.content?.badgeText?.[lang] || cmsData?.content?.badgeText?.en;
  const badgeText = customBadge || (isFr ? 'ONG Enn Rêv Enn Sourir' : isKr ? 'ONG Enn Rev Enn Sourir' : 'NGO Enn Rêv Enn Sourir');

  const customLinkUrl = cmsData?.content?.linkUrl?.[lang] || cmsData?.content?.linkUrl?.en || '/about';
  const customLinkLabel = cmsData?.content?.linkLabel?.[lang] || cmsData?.content?.linkLabel?.en;
  const learnMoreText = customLinkLabel || (isFr ? 'En savoir plus' : isKr ? 'Dekouver Plis' : 'Learn More');

  const customMessage = cmsData?.content?.messageText?.[lang] || cmsData?.content?.messageText?.en;

  // We render 4 repeated ticker items inside the track so that with 50% translateX animation it loops seamlessly and smoothly
  const items = [1, 2, 3, 4];

  return (
    <div 
      className="mission-marquee" 
      role="region" 
      aria-label="NGO Enn Rêv Enn Sourir Social Mission Statement"
    >
      <div className="mission-marquee__inner">
        {/* Left static badge with pulsing indicator */}
        <div className="mission-marquee__badge">
          <span className="mission-marquee__pulse" aria-hidden="true">
            <span className="mission-marquee__dot" />
          </span>
          <HeartPulse size={16} />
          <span className="mission-marquee__badge-text">{badgeText}</span>
        </div>

        {/* Continuous Smooth Scrolling Marquee Container */}
        <div className="mission-marquee__container">
          <div 
            className="mission-marquee__track"
            style={{ animationDuration: `${speedSeconds}s` }}
          >
            {items.map(idx => (
              <div key={idx} className="mission-marquee__item">
                <span className="mission-marquee__text">
                  <strong className="mission-marquee__highlight">Med360</strong>{' '}
                  {customMessage ? (
                    <span>{customMessage}</span>
                  ) : isFr ? (
                    <>
                      est une entreprise détenue par l'<strong>ONG Enn Rêv Enn Sourir</strong>. Après{' '}
                      <strong>10 ans</strong> à aider les personnes dans le besoin à avoir accès à des soins spécialisés en clinique privée ou à l'étranger, nous avons désormais décidé d'étendre nos services à ceux qui peuvent se le permettre.{' '}
                      <span className="mission-marquee__profit-tag">
                        100 % des bénéfices sont reversés à l'ONG pour continuer d'aider les autres.
                      </span>
                    </>
                  ) : isKr ? (
                    <>
                      li enn lakonpanyi ki apartenir a l'<strong>ONG Enn Rev Enn Sourir</strong>. Apre{' '}
                      <strong>10 banlane</strong> pe ed bann dimounn dan bezwin gagn akse a bann tretman spesialize dan klinik prive ouswa a letranze, nou finn deside elarzi nou servis pou bann ki kapav peye.{' '}
                      <span className="mission-marquee__profit-tag">
                        Tou profi retourn dan l'ONG pou kontinie ed lezot.
                      </span>
                    </>
                  ) : (
                    <>
                      is a company owned by the <strong>NGO Enn Rêv Enn Sourir</strong>. After{' '}
                      <strong>10 years</strong> in helping the needy's have access to specialised treatment in private clinic or abroad, we have now decided to extend our service to those who can afford.{' '}
                      <span className="mission-marquee__profit-tag">
                        The profit will go back to the NGO to continue helping others.
                      </span>
                    </>
                  )}
                </span>

                <Link to={customLinkUrl} className="mission-marquee__link" title="Discover Our 10-Year NGO Mission">
                  <span>{learnMoreText}</span>
                  <ArrowRight size={12} />
                </Link>

                <span className="mission-marquee__separator" aria-hidden="true">
                  <Sparkles size={14} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

