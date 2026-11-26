import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowUp, CalendarCheck, Stethoscope, PlayCircle } from 'lucide-react';
import { useWhatsAppAction } from '../../hooks/useWhatsAppAction';
import { usePlatformSettings } from '../../core/services/settings.service';
import './FloatingWhatsApp.css';

export function FloatingWhatsApp() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  const { openWhatsApp } = useWhatsAppAction();
  const { settings } = usePlatformSettings();

  useEffect(() => {
    let ticking = false;
    let lastState = window.scrollY > 250;
    setShowScrollTop(lastState);

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const current = window.scrollY > 250;
          if (current !== lastState) {
            lastState = current;
            setShowScrollTop(current);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="floating-actions-group" aria-label="Quick actions">
      {/* Request an Appointment */}
      <button
        type="button"
        onClick={() => navigate('/describe-need?from=Floating+Menu&serviceName=Request+an+Appointment')}
        className="floating-icon-btn floating-icon-btn--appointment"
        aria-label="Request an Appointment"
        id="floating-appointment-btn"
      >
        <span className="floating-icon-btn__icon">
          <CalendarCheck size={21} aria-hidden="true" />
        </span>
        <span className="floating-icon-btn__label">Request an Appointment</span>
      </button>

      {/* Our Services */}
      <button
        type="button"
        onClick={() => navigate('/how-it-works')}
        className="floating-icon-btn floating-icon-btn--services"
        aria-label="Our Services"
        id="floating-services-btn"
      >
        <span className="floating-icon-btn__icon">
          <Stethoscope size={21} aria-hidden="true" />
        </span>
        <span className="floating-icon-btn__label">Our Services</span>
      </button>

      {/* YouTube Podcast */}
      <button
        type="button"
        onClick={() => navigate('/podcast')}
        className="floating-icon-btn floating-icon-btn--youtube"
        aria-label="Watch Med360 YouTube Podcast"
        id="floating-youtube-btn"
      >
        <span className="floating-icon-btn__icon">
          <PlayCircle size={22} aria-hidden="true" />
        </span>
        <span className="floating-icon-btn__label">YouTube Podcast</span>
      </button>

      {/* WhatsApp Button (Addon Module Controlled) */}
      {settings.addonFloatingWhatsApp !== false && (
        <button
          type="button"
          onClick={() => openWhatsApp({ source: 'Floating Widget' })}
          className="floating-icon-btn floating-whatsapp"
          aria-label="Chat with Med360 on WhatsApp"
          id="floating-whatsapp-btn"
        >
          <span className="floating-icon-btn__icon">
            <MessageCircle size={22} aria-hidden="true" />
          </span>
          <span className="floating-icon-btn__label">Chat on WhatsApp</span>
        </button>
      )}

      {/* Scroll to Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`floating-icon-btn floating-scroll-top ${showScrollTop ? 'floating-scroll-top--visible' : ''}`}
        aria-label="Scroll to top of page"
        id="scroll-to-top-btn"
      >
        <span className="floating-icon-btn__icon">
          <ArrowUp size={20} aria-hidden="true" />
        </span>
        <span className="floating-icon-btn__label">Back to top</span>
      </button>
    </nav>
  );
}
