import React, { useState } from 'react';
import { MessageCircle, Mail, ShieldAlert, Sparkles, HeartHandshake } from 'lucide-react';
import { SEO } from '../../components/SEO/SEO';
import { WHATSAPP_DISPLAY, CONTACT_EMAIL, SITE_NAME, PARENT_NGO_NAME, WHATSAPP_NUMBER } from '../../core/config/site';
import { buildWhatsAppUrl } from '../../core/services/whatsapp.service';
import './Maintenance.css';

export function MaintenancePage() {
  const [lang, setLang] = useState<'en' | 'fr' | 'kr'>('en');

  const content = {
    en: {
      badge: 'Platform Upgrade in Progress',
      title: 'We’ll Be Back Shortly',
      subtitle: 'Med360 is currently undergoing scheduled infrastructure enhancements and medical catalog synchronization to serve you better.',
      emergencyTitle: 'Urgent Medical Assistance & Evacuations',
      emergencyText: 'Our clinical coordination team, patient hotline, and hospital evacuation hotlines remain 100% operational 24/7.',
      whatsappBtn: 'Chat on WhatsApp Helpline',
      emailBtn: 'Email Clinical Team',
      footer: `© ${new Date().getFullYear()} ${SITE_NAME} Ltd · Social Enterprise Initiative of NGO ${PARENT_NGO_NAME}`,
    },
    fr: {
      badge: 'Mise à niveau de la plateforme en cours',
      title: 'Nous Revenons Très Bientôt',
      subtitle: 'Med360 procède actuellement à des améliorations d’infrastructure et à la synchronisation de son catalogue médical pour mieux vous accompagner.',
      emergencyTitle: 'Assistance Médicale Urgente & Évacuations',
      emergencyText: 'Notre équipe de coordination clinique et notre permanence téléphonique restent 100 % opérationnelles 7j/7 et 24h/24.',
      whatsappBtn: 'Contacter notre Permanence WhatsApp',
      emailBtn: 'Écrire à l’Équipe Médicale',
      footer: `© ${new Date().getFullYear()} ${SITE_NAME} Ltd · Entreprise Sociale de l'ONG ${PARENT_NGO_NAME}`,
    },
    kr: {
      badge: 'Amelyorasion Platform an Kour',
      title: 'Nou Retourn Tré Biento',
      subtitle: 'Med360 pe fer bann amelyorasion teknik ek miz a zour katalog lopital pou rann nou servis pli efikas pou ou.',
      emergencyTitle: 'Lasistans Medikal Irzan & Evakuasion',
      emergencyText: 'Nou lekip kordonasion medikal ek nou nimero WhatsApp res 100% disponib 24/7 pou tou bezwen irzan.',
      whatsappBtn: 'Koze lor WhatsApp',
      emailBtn: 'Avoy enn Email',
      footer: `© ${new Date().getFullYear()} ${SITE_NAME} Ltd · Linisiativ Sosial l'ONG ${PARENT_NGO_NAME}`,
    },
  }[lang];

  const waMessage = lang === 'fr'
    ? 'Bonjour Med360, je souhaite être recontacté rapidement pendant la maintenance.'
    : lang === 'kr'
    ? 'Bonzour Med360, mo bizin lasistans medikal pandan mintenans.'
    : 'Hello Med360, I require medical coordination assistance.';

  const waUrl = buildWhatsAppUrl(WHATSAPP_NUMBER, waMessage);

  return (
    <div className="maintenance-wrapper">
      <SEO pageKey="maintenance" title={content.title} description={content.subtitle} />

      <div className="maintenance-bg-glow" />

      <div className="maintenance-card">
        {/* Language Switcher */}
        <div className="maintenance-lang-toggle">
          <button
            type="button"
            className={`maintenance-lang-btn ${lang === 'en' ? 'maintenance-lang-btn--active' : ''}`}
            onClick={() => setLang('en')}
          >
            English
          </button>
          <button
            type="button"
            className={`maintenance-lang-btn ${lang === 'fr' ? 'maintenance-lang-btn--active' : ''}`}
            onClick={() => setLang('fr')}
          >
            Français
          </button>
          <button
            type="button"
            className={`maintenance-lang-btn ${lang === 'kr' ? 'maintenance-lang-btn--active' : ''}`}
            onClick={() => setLang('kr')}
          >
            Kreol
          </button>
        </div>

        {/* Live Status Badge */}
        <div className="maintenance-badge">
          <span className="maintenance-badge__dot" />
          <span>{content.badge}</span>
        </div>

        {/* Logo */}
        <img
          src="/Web Med360 ogo-05.png"
          alt={SITE_NAME}
          className="maintenance-logo"
          onClick={() => {
            const clicks = Number(sessionStorage.getItem('maint_logo_clicks') || '0') + 1;
            sessionStorage.setItem('maint_logo_clicks', String(clicks));
            if (clicks >= 5) {
              sessionStorage.removeItem('maint_logo_clicks');
              try {
                localStorage.setItem('med360_client_preview', 'true');
              } catch {}
              window.location.reload();
            }
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />

        {/* Title & Description */}
        <h1 className="maintenance-title">{content.title}</h1>
        <p className="maintenance-subtitle">{content.subtitle}</p>

        {/* Urgent Medical Support Notice */}
        <div className="maintenance-emergency-box">
          <ShieldAlert className="maintenance-emergency-icon" size={24} />
          <div>
            <div className="maintenance-emergency-title">{content.emergencyTitle}</div>
            <p className="maintenance-emergency-text">{content.emergencyText}</p>
          </div>
        </div>

        {/* Contact Actions */}
        <div className="maintenance-actions">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="maintenance-btn-whatsapp"
          >
            <MessageCircle size={20} />
            <span>{content.whatsappBtn}</span>
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Med360%20Inquiry%20(Maintenance)`}
            className="maintenance-btn-email"
          >
            <Mail size={19} />
            <span>{content.emailBtn}</span>
          </a>
        </div>

        <div className="maintenance-footer">
          {content.footer}
        </div>
      </div>
    </div>
  );
}
