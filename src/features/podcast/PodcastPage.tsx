import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Radio,
  Calendar,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  User,
  ArrowRight,
  MessageCircle,
  ListVideo,
} from 'lucide-react';
import { SEO } from '../../components/SEO/SEO';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import {
  PODCAST_CATEGORIES,
  PODCAST_EPISODES,
  PODCAST_PLAYLIST_URL,
  type PodcastCategory,
  type PodcastEpisode,
} from './podcastData';
import './PodcastPage.css';

export function PodcastPage() {
  const navigate = useNavigate();
  const playerRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<PodcastCategory>('All');
  const [activeEpisode, setActiveEpisode] = useState<PodcastEpisode>(PODCAST_EPISODES[0]);

  const filteredEpisodes =
    selectedCategory === 'All'
      ? PODCAST_EPISODES
      : PODCAST_EPISODES.filter((ep) => ep.category === selectedCategory);

  const currentIndex = PODCAST_EPISODES.findIndex((ep) => ep.id === activeEpisode.id);

  const handleSelectEpisode = (episode: PodcastEpisode) => {
    setActiveEpisode(episode);
    playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveEpisode(PODCAST_EPISODES[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < PODCAST_EPISODES.length - 1) {
      setActiveEpisode(PODCAST_EPISODES[currentIndex + 1]);
    }
  };

  return (
    <main className="page-wrapper podcast-page">
      <SEO
        title="Med360 Live Podcast — Medical Awareness & Specialist Shows"
        description="Watch all Med360 Live & Podcast episodes featuring leading medical specialists discussing pediatrics, oncology, cardiology, spine surgery, and preventive healthcare in Mauritius."
        canonical="/podcast"
      />

      {/* Hero Header */}
      <section className="podcast-hero">
        <div className="container podcast-hero__inner">
          <div className="podcast-hero__badge">
            <Radio size={14} />
            <span>Med360 Live &amp; Podcast Series</span>
          </div>
          <h1 className="podcast-hero__title">
            Trusted Medical Conversations, <span>Straight From Specialists</span>
          </h1>
          <p className="podcast-hero__subtitle">
            Explore our complete library of Med360 Live broadcasts and specialist awareness shows —
            empowering Mauritian patients and families with clear, ethical medical knowledge.
          </p>
          <div className="podcast-hero__actions">
            <a
              href={PODCAST_PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <ListVideo size={17} />
              <span>Open Official YouTube Playlist</span>
              <ExternalLink size={14} />
            </a>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() =>
                navigate('/describe-need?from=Podcast+Page&serviceName=Request+an+Appointment')
              }
            >
              <span>Request an Appointment</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Cinema Player */}
      <section className="podcast-theatre-section" ref={playerRef}>
        <div className="container">
          <div className="podcast-theatre">
            <div className="podcast-theatre__video-col">
              <div className="podcast-theatre__frame-wrap">
                <iframe
                  key={activeEpisode.videoId}
                  src={`https://www.youtube-nocookie.com/embed/${activeEpisode.videoId}?rel=0&modestbranding=1`}
                  title={activeEpisode.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="podcast-theatre__info-col">
              <div className="podcast-theatre__meta-top">
                <span className="podcast-badge podcast-badge--live">
                  Now Playing • {activeEpisode.episodeLabel}
                </span>
                <span className="podcast-badge podcast-badge--cat">
                  {activeEpisode.category}
                </span>
              </div>

              <h2 className="podcast-theatre__title">{activeEpisode.title}</h2>
              <p className="podcast-theatre__subtitle">{activeEpisode.subtitle}</p>
              <p className="podcast-theatre__desc">{activeEpisode.description}</p>

              <div className="podcast-theatre__details">
                <span className="podcast-detail-chip">
                  <Calendar size={14} />
                  {activeEpisode.date}
                </span>
                {activeEpisode.duration && (
                  <span className="podcast-detail-chip">
                    <Clock size={14} />
                    {activeEpisode.duration}
                  </span>
                )}
                {activeEpisode.guest && (
                  <span className="podcast-detail-chip">
                    <User size={14} />
                    {activeEpisode.guest}
                  </span>
                )}
              </div>

              <div className="podcast-theatre__controls">
                <div className="podcast-theatre__nav-btns">
                  <button
                    type="button"
                    className="podcast-nav-btn"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    aria-label="Newer episode"
                  >
                    <ChevronLeft size={17} />
                    <span>Newer</span>
                  </button>
                  <button
                    type="button"
                    className="podcast-nav-btn"
                    onClick={handleNext}
                    disabled={currentIndex === PODCAST_EPISODES.length - 1}
                    aria-label="Older episode"
                  >
                    <span>Older</span>
                    <ChevronRight size={17} />
                  </button>
                </div>

                <a
                  href={`https://www.youtube.com/watch?v=${activeEpisode.videoId}&list=PLd-JH53JNuS8`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="podcast-yt-link"
                >
                  <span>Watch on YouTube</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Episode Library */}
      <section className="section podcast-library-section">
        <div className="container">
          <div className="podcast-library__header">
            <div>
              <span className="section-label">Complete Broadcast Archive</span>
              <h2 className="text-h2" style={{ margin: '0.25rem 0 0' }}>
                All Shows ({filteredEpisodes.length})
              </h2>
            </div>

            <div className="podcast-filters" role="tablist" aria-label="Filter podcast episodes">
              {PODCAST_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === category}
                  className={`podcast-filter-btn ${
                    selectedCategory === category ? 'podcast-filter-btn--active' : ''
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="podcast-grid">
            {filteredEpisodes.map((episode) => {
              const isPlaying = activeEpisode.id === episode.id;
              return (
                <article
                  key={episode.id}
                  className={`podcast-card ${isPlaying ? 'podcast-card--active' : ''}`}
                >
                  <button
                    type="button"
                    className="podcast-card__thumb-btn"
                    onClick={() => handleSelectEpisode(episode)}
                    aria-label={`Play ${episode.episodeLabel}: ${episode.title}`}
                  >
                    <img
                      src={`https://i.ytimg.com/vi/${episode.videoId}/hqdefault.jpg`}
                      alt={episode.title}
                      loading="lazy"
                      className="podcast-card__thumb"
                    />
                    <div className="podcast-card__overlay">
                      <span className="podcast-card__play-circle">
                        <Play size={22} fill="currentColor" />
                      </span>
                    </div>
                    <span className="podcast-card__ep-pill">{episode.episodeLabel}</span>
                    {episode.duration && (
                      <span className="podcast-card__duration">{episode.duration}</span>
                    )}
                    {isPlaying && <span className="podcast-card__playing-tag">Playing</span>}
                  </button>

                  <div className="podcast-card__body">
                    <div className="podcast-card__meta">
                      <span className="podcast-card__cat">{episode.category}</span>
                      <span className="podcast-card__date">{episode.date}</span>
                    </div>

                    <h3 className="podcast-card__title">
                      <button
                        type="button"
                        className="podcast-card__title-btn"
                        onClick={() => handleSelectEpisode(episode)}
                      >
                        {episode.title}
                      </button>
                    </h3>

                    <p className="podcast-card__desc">{episode.description}</p>

                    <div className="podcast-card__footer">
                      <button
                        type="button"
                        className="podcast-card__watch-btn"
                        onClick={() => handleSelectEpisode(episode)}
                      >
                        <Play size={14} />
                        <span>{isPlaying ? 'Now Playing' : 'Watch Episode'}</span>
                      </button>
                      <a
                        href={`https://www.youtube.com/watch?v=${episode.videoId}&list=PLd-JH53JNuS8`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="podcast-card__ext-link"
                        aria-label={`Open ${episode.episodeLabel} on YouTube`}
                        title="Open on YouTube"
                      >
                        <ExternalLink size={15} />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Bottom Conversion CTA */}
          <div className="podcast-cta">
            <span className="section-label">Need Personalised Guidance?</span>
            <h2 className="text-h2" style={{ margin: '0.35rem 0 0.75rem' }}>
              Have a Medical Question Inspired by Our Shows?
            </h2>
            <p className="podcast-cta__text">
              Speak confidentially with our Mauritius patient coordination team to request an
              appointment or explore specialist care options worldwide.
            </p>
            <div className="podcast-cta__actions">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() =>
                  navigate('/describe-need?from=Podcast+CTA&serviceName=Request+an+Appointment')
                }
              >
                <span>Request an Appointment</span>
                <ArrowRight size={18} />
              </button>
              <a
                href={buildMed360WhatsAppUrl('Hello Med360, I watched your podcast and would like to ask a question.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
              >
                <MessageCircle size={18} />
                <span>Chat With Us on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PodcastPage;
