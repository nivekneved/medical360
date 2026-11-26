export type PodcastCategory =
  | 'All'
  | 'Pediatrics'
  | 'Oncology'
  | 'Cardiology'
  | 'Spine & Orthopedics'
  | "Men's Health";

export interface PodcastEpisode {
  id: string;
  videoId: string;
  episodeLabel: string;
  title: string;
  subtitle: string;
  description: string;
  guest?: string;
  date: string;
  duration?: string;
  category: Exclude<PodcastCategory, 'All'>;
  isHighlight?: boolean;
}

export const PODCAST_PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLd-JH53JNuS8';
export const PODCAST_CHANNEL_URL = 'https://www.youtube.com/@ennrevennsourir5966';

export const PODCAST_CATEGORIES: PodcastCategory[] = [
  'All',
  'Pediatrics',
  'Oncology',
  'Cardiology',
  'Spine & Orthopedics',
  "Men's Health",
];

export const PODCAST_EPISODES: PodcastEpisode[] = [
  {
    id: 'ep-12',
    videoId: 'mnjBcV9JTkM',
    episodeLabel: 'Episode 12',
    title: 'Dès la naissance : comprendre les malformations congénitales',
    subtitle: 'Med360 Live — Congenital Malformations in Boys & Girls',
    description:
      'Understanding congenital malformations from birth in boys and girls: early detection, medical pathways, surgical options, and guidance for parents in Mauritius.',
    date: '26 Nov 2026',
    duration: '1h 26m',
    category: 'Pediatrics',
  },
  {
    id: 'ep-11',
    videoId: 'ujj73acpyIs',
    episodeLabel: 'Episode 11',
    title: 'Votre cœur pourrait-il vous lâcher sans prévenir ?',
    subtitle: 'Med360 Live — Cardiovascular Warning Signs & Prevention',
    description:
      'What if your heart is sending warning signs you ignore? Exploring cardiovascular diseases, silent symptoms, prevention strategies, and modern cardiac treatments.',
    date: '19 Nov 2026',
    duration: '1h 27m',
    category: 'Cardiology',
  },
  {
    id: 'ep-10',
    videoId: 'j7v5YbhuOKY',
    episodeLabel: 'Episode 10',
    title: 'Santé masculine : les dangers silencieux que les hommes ignorent !',
    subtitle: "Med360 Live — Men's Health & Preventive Screening",
    description:
      "When was the last time you prioritised your health? Addressing urinary symptoms, prostate health, and silent risks men often overlook until it's late.",
    date: '12 Nov 2026',
    duration: '1h 00m',
    category: "Men's Health",
  },
  {
    id: 'ep-9',
    videoId: 'HSwXkwfTLns',
    episodeLabel: 'Episode 9',
    title: 'Mal de dos : faut-il vraiment se faire opérer ?',
    subtitle: 'Med360 Podcast Live — Spine Surgery, Sciatica & Herniated Disc',
    description:
      'Herniated discs, sciatica, scoliosis, and spine surgery: when is an operation truly necessary, what are the real risks, and what non-surgical alternatives exist?',
    date: '05 Nov 2026',
    duration: '1h 12m',
    category: 'Spine & Orthopedics',
  },
  {
    id: 'ep-8',
    videoId: 'gSeKebNVBIo',
    episodeLabel: 'Episode 8',
    title: 'Cancer du sein : hormones, fertilité et vie après les traitements',
    subtitle: 'Med360 Podcast Live — Hormones, Fertility & Early Menopause',
    description:
      'Breast cancer care goes beyond initial treatment. A candid discussion on hormone therapy, fertility preservation, early menopause, and rebuilding quality of life.',
    date: '29 Oct 2026',
    duration: '1h 13m',
    category: 'Oncology',
  },
  {
    id: 'ep-7',
    videoId: '9lZ9Krdm3_8',
    episodeLabel: 'Episode 7',
    title: 'Prendre soin de ses seins : chirurgie esthétique & reconstruction mammaire',
    subtitle: 'Med360 Podcast Live — Breast Reconstruction: Benefits, Risks & Realities',
    description:
      'After breast cancer, how do patients navigate breast reconstruction and aesthetic surgery? Understanding medical options, benefits, risks, and realistic outcomes.',
    date: '22 Oct 2026',
    duration: '1h 02m',
    category: 'Oncology',
  },
  {
    id: 'ep-6',
    videoId: '-2jS6GaRgYs',
    episodeLabel: 'Episode 6',
    title: 'Cancer du sein : comprendre, détecter et traiter',
    subtitle: 'Pink October Special — Early Detection & Treatment Pathways',
    description:
      'For Pink October, Med360 Live dedicates this episode to breast cancer: understanding the condition, recognising the power of early screening, and modern care approaches.',
    date: '08 Oct 2026',
    duration: '1h 09m',
    category: 'Oncology',
  },
  {
    id: 'ep-5',
    videoId: 's0NqvAv8aDM',
    episodeLabel: 'Episode 5',
    title: 'Gold September : Nutrition & cancer pédiatrique',
    subtitle: 'Med360 Live — What Every Parent Should Know About Nutrition',
    description:
      "What role does nutrition play during a child's cancer treatment? Practical guidance on foods to prioritise and managing treatment-related nutritional challenges.",
    date: '24 Sep 2026',
    duration: '59m',
    category: 'Pediatrics',
  },
  {
    id: 'ep-4',
    videoId: 'lqaY249uMvI',
    episodeLabel: 'Episode 4',
    title: "Les soins palliatifs dans le cancer de l'enfant",
    subtitle: 'Med360 Podcast Live — Pediatric Palliative Care',
    description:
      'What does it truly mean to accompany a child living with cancer, and what role does palliative care play alongside curative treatment?',
    guest: 'Dr Vicky Naga',
    date: '17 Sep 2026',
    duration: '1h 05m',
    category: 'Pediatrics',
  },
  {
    id: 'ep-4-highlight',
    videoId: 'doSHzGYvcog',
    episodeLabel: 'Episode 4 Highlight',
    title: "Découvrez-en plus sur les soins palliatifs dans le cancer de l'enfant",
    subtitle: 'Key Insights with Dr Vicky Naga',
    description:
      'Focused highlight exploring compassionate pediatric palliative care and family support with palliative care specialist Dr Vicky Naga.',
    guest: 'Dr Vicky Naga',
    date: '17 Sep 2026',
    category: 'Pediatrics',
    isHighlight: true,
  },
  {
    id: 'ep-3',
    videoId: '9H0ftk0FXfA',
    episodeLabel: 'Episode 3',
    title: 'Cancer chez les adolescents et les jeunes adultes — Gold September',
    subtitle: 'Med360 Live — Adolescent & Young Adult Oncology',
    description:
      'Clear, accessible answers on cancers affecting teenagers and young adults, early warning signs, and specialised oncology pathways.',
    guest: 'Dr Khevin Kumar Bujhawon',
    date: '10 Sep 2026',
    duration: '1h 18m',
    category: 'Oncology',
  },
  {
    id: 'ep-3-highlight',
    videoId: '_1aNCMUOymo',
    episodeLabel: 'Episode 3 Highlight',
    title: 'Cancer chez les ados et jeunes adultes : mieux comprendre',
    subtitle: 'Gold September Awareness Spotlight',
    description:
      'Essential takeaways on recognising and understanding adolescent and young adult cancer during Gold September.',
    guest: 'Dr Khevin Kumar Bujhawon',
    date: '10 Sep 2026',
    category: 'Oncology',
    isHighlight: true,
  },
  {
    id: 'ep-1',
    videoId: 'CSHtex0nu58',
    episodeLabel: 'Episode 1',
    title: "La pédiatrie à Maurice : de l'histoire d'un enfant à une décennie d'engagement",
    subtitle: 'Inaugural Med360 Live Broadcast',
    description:
      "Our very first episode of Med360 Live with pediatric surgeon Dr Kevin Teeroovengadum, tracing a decade of pediatric commitment in Mauritius from one child's story.",
    guest: 'Dr Kevin Teeroovengadum',
    date: '03 Sep 2026',
    duration: '1h 13m',
    category: 'Pediatrics',
  },
];
