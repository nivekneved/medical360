import { useState, useEffect } from 'react';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { useWhatsAppAction } from '../../hooks/useWhatsAppAction';
import './FloatingWhatsApp.css';

export function FloatingWhatsApp() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { openWhatsApp } = useWhatsAppAction();

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
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="floating-actions-group" aria-label="Floating actions">
      {/* WhatsApp Button */}
      <button
        type="button"
        onClick={() => openWhatsApp({ source: 'Floating Widget' })}
        className="floating-whatsapp"
        aria-label="Chat with Med360 on WhatsApp"
        id="floating-whatsapp-btn"
      >
        <MessageCircle size={26} />
        <span className="floating-action__tooltip">Chat on WhatsApp</span>
      </button>


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
