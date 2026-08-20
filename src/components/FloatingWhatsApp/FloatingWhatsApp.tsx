import { MessageCircle } from 'lucide-react';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import './FloatingWhatsApp.css';

export function FloatingWhatsApp() {
  return (
    <a
      href={buildMed360WhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp"
      aria-label="Chat with Medical 360 on WhatsApp"
      id="floating-whatsapp-btn"
    >
      <MessageCircle size={26} />
      <span className="floating-whatsapp__tooltip">Chat with us</span>
    </a>
  );
}
