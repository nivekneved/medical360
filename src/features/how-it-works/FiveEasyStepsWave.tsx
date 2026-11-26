import { MessageCircle, FileText, Stethoscope, CalendarCheck, UserCheck } from 'lucide-react';
import { useL10n } from '../../hooks/useL10n';

const FIVE_STEPS = [
  {
    num: '1',
    pos: 'top',
    icon: MessageCircle,
    en: 'Chat with our\nMedical Advisor',
    fr: 'Échangez avec notre\nConseiller Médical',
    kr: 'Koz ar nou\nKonseye Medikal',
  },
  {
    num: '2',
    pos: 'bottom',
    icon: FileText,
    en: 'Share Medical\nHistory',
    fr: 'Partagez Votre\nDossier Médical',
    kr: 'Partaz Ou\nDosie Medikal',
  },
  {
    num: '3',
    pos: 'top',
    icon: Stethoscope,
    en: 'Get Expert\nOpinion',
    fr: 'Obtenez un\nAvis d\'Expert',
    kr: 'Gagn Lavi\nDokter Eksper',
  },
  {
    num: '4',
    pos: 'bottom',
    icon: CalendarCheck,
    en: 'Schedule\nAppointment',
    fr: 'Planifiez Votre\nRendez-vous',
    kr: 'Fix Ou\nRandevou',
  },
  {
    num: '5',
    pos: 'top',
    icon: UserCheck,
    en: 'Consult\nDoctor',
    fr: 'Consultez le\nSpécialiste',
    kr: 'Konsilte\nDokter',
  },
] as const;

export function FiveEasyStepsWave() {
  const { isFr, isKr } = useL10n();

  return (
    <section className="hiw-five-steps" aria-labelledby="five-steps-heading">
      <div className="container">
        <h2 id="five-steps-heading" className="hiw-five-steps__heading">
          {isFr
            ? 'Accessible en 5 Étapes Simples'
            : isKr
            ? 'Disfonib pou Ou dan 5 Letap Fasil'
            : 'Available to you in 5 Easy Steps'}
        </h2>

        <div className="hiw-wave-wrap">
          {/* Connecting dashed S-curve wave (desktop) */}
          <svg
            className="hiw-wave-svg"
            viewBox="0 0 1000 220"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 100 68 C 190 68, 210 165, 300 165 C 390 165, 410 68, 500 68 C 590 68, 610 165, 700 165 C 790 165, 810 68, 900 68"
              fill="none"
              stroke="#7dd3fc"
              strokeWidth="2.5"
              strokeDasharray="5 7"
            />
          </svg>

          <ol className="hiw-wave-grid">
            {FIVE_STEPS.map((step) => {
              const Icon = step.icon;
              const label = isFr ? step.fr : isKr ? step.kr : step.en;
              return (
                <li
                  key={step.num}
                  className={`hiw-wave-node hiw-wave-node--${step.pos}`}
                >
                  <div className="hiw-wave-badge-wrap">
                    <span className="hiw-wave-num" aria-hidden="true">
                      {step.num}
                    </span>
                    <div className="hiw-wave-circle">
                      <div className="hiw-wave-icon-bg">
                        <Icon size={30} strokeWidth={1.8} />
                      </div>
                    </div>
                  </div>
                  <p className="hiw-wave-label">{label}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
