import { useState, useEffect } from 'react';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import './FloatingWhatsApp.css';

export function FloatingWhatsApp() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="floating-actions-group" aria-label="Floating actions">
      {/* WhatsApp Button */}
      <a
        href={buildMed360WhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp"
        aria-label="Chat with Medical 360 on WhatsApp"
        id="floating-whatsapp-btn"
      >
        <MessageCircle size={26} />
        <span className="floating-action__tooltip">Chat on WhatsApp</span>
      </a>

      {/* Scroll to Top Button (Below WhatsApp) */}
      <button
        onClick={scrollToTop}
        className={`floating-scroll-top ${showScrollTop ? 'floating-scroll-top--visible' : ''}`}
        aria-label="Scroll to top of page"
        id="scroll-to-top-btn"
        title="Scroll to top"
      >
        <ArrowUp size={20} />
        <span className="floating-action__tooltip">Back to top</span>
      </button>
    </div>
  );
}
