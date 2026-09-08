import React, { useState, useMemo } from 'react';
import {
  Image as ImageIcon,
  Search,
  Copy,
  Check,
  ExternalLink,
  Filter,
  Sparkles,
  Building2,
  UserCheck,
  Stethoscope,
  Award,
  Layers,
  UploadCloud,
} from 'lucide-react';
import { useToast } from '../../../providers/ToastProvider';
import { ImageWithFallback } from '../../../components/common/ImageWithFallback';
import './AdminMedia.css';

interface MediaAsset {
  id: string;
  title: string;
  url: string;
  category: 'hospital' | 'doctor' | 'specialty' | 'case_study' | 'branding';
  dimensions: string;
  fileSize: string;
  tags: string[];
}

const SYSTEM_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'med-1',
    title: 'Apollo Hospitals Chennai Campus',
    url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1200&q=80',
    category: 'hospital',
    dimensions: '1200 x 800',
    fileSize: '240 KB',
    tags: ['apollo', 'chennai', 'hospital', 'exterior'],
  },
  {
    id: 'med-2',
    title: 'Fortis Memorial Research Institute',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80',
    category: 'hospital',
    dimensions: '1200 x 800',
    fileSize: '310 KB',
    tags: ['fortis', 'delhi', 'gurgaon', 'hospital'],
  },
  {
    id: 'med-3',
    title: 'Max Super Speciality Hospital Saket',
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&q=80',
    category: 'hospital',
    dimensions: '1200 x 800',
    fileSize: '280 KB',
    tags: ['max', 'saket', 'delhi', 'cardiology'],
  },
  {
    id: 'med-4',
    title: 'Medanta The Medicity Gurugram',
    url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=80',
    category: 'hospital',
    dimensions: '1200 x 800',
    fileSize: '295 KB',
    tags: ['medanta', 'trehan', 'multispeciality'],
  },
  {
    id: 'med-5',
    title: 'Dr. Naresh Trehan (Chairman, Medanta)',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80',
    category: 'doctor',
    dimensions: '800 x 800',
    fileSize: '145 KB',
    tags: ['cardiac', 'trehan', 'doctor', 'portrait'],
  },
  {
    id: 'med-6',
    title: 'Dr. Suresh Joshi (Pediatric Cardiologist)',
    url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&q=80',
    category: 'doctor',
    dimensions: '800 x 800',
    fileSize: '160 KB',
    tags: ['pediatric', 'cardiology', 'doctor'],
  },
  {
    id: 'med-7',
    title: 'Dr. Vinod Raina (Executive Chairman Oncology)',
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
    category: 'doctor',
    dimensions: '800 x 800',
    fileSize: '175 KB',
    tags: ['oncology', 'cancer', 'chemo', 'doctor'],
  },
  {
    id: 'med-8',
    title: 'Interventional Cardiology Suite',
    url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1000&q=80',
    category: 'specialty',
    dimensions: '1000 x 667',
    fileSize: '210 KB',
    tags: ['cardiology', 'catheterization', 'surgery'],
  },
  {
    id: 'med-9',
    title: 'Advanced Linear Accelerator (Oncology)',
    url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=1000&q=80',
    category: 'specialty',
    dimensions: '1000 x 667',
    fileSize: '235 KB',
    tags: ['oncology', 'radiation', 'truebeam'],
  },
  {
    id: 'med-10',
    title: 'Robotic Orthopaedic Surgery Suite',
    url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1000&q=80',
    category: 'specialty',
    dimensions: '1000 x 667',
    fileSize: '220 KB',
    tags: ['orthopaedics', 'mako', 'knee', 'hip'],
  },
  {
    id: 'med-11',
    title: 'Mauritius Patient Cardiac Case Study',
    url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1000&q=80',
    category: 'case_study',
    dimensions: '1000 x 667',
    fileSize: '190 KB',
    tags: ['patient', 'recovery', 'mauritius', 'cabg'],
  },
  {
    id: 'med-12',
    title: 'Med360 Official Social Card & Branding',
    url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80',
    category: 'branding',
    dimensions: '1200 x 630',
    fileSize: '180 KB',
    tags: ['branding', 'banner', 'og-image', 'social'],
  },
];

export function AdminMediaPage() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredAssets = useMemo(() => {
    return SYSTEM_MEDIA_ASSETS.filter((item) => {
      const matchCategory = category === 'all' || item.category === category;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [search, category]);

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    toast.success(`Image URL for "${asset.title}" copied to clipboard.`, {
      title: 'URL Copied',
    });
    setTimeout(() => {
      setCopiedId((prev) => (prev === asset.id ? null : prev));
    }, 2000);
  };

  const getCategoryCount = (cat: string) => {
    if (cat === 'all') return SYSTEM_MEDIA_ASSETS.length;
    return SYSTEM_MEDIA_ASSETS.filter((a) => a.category === cat).length;
  };

  return (
    <div className="admin-media-container">
      {/* ── Top Header ── */}
      <div className="admin-media-header">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ImageIcon size={26} color="#38bdf8" /> Media & Asset Gallery
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0.35rem 0 0', fontSize: '0.875rem' }}>
            Central repository of hospital imagery, specialist portraits, and social share graphics.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            toast.info('Drag-and-drop or select new high-resolution clinical assets.', {
              title: 'Asset Ingestion',
            });
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <UploadCloud size={16} /> Upload New Asset
        </button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="admin-media-stats-grid">
        <div className="admin-media-stat-card">
          <div className="admin-media-stat-icon"><Building2 size={22} /></div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{getCategoryCount('hospital')}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Hospital Campuses</div>
          </div>
        </div>

        <div className="admin-media-stat-card">
          <div className="admin-media-stat-icon" style={{ color: '#a78bfa', background: 'rgba(167, 139, 250, 0.12)' }}><UserCheck size={22} /></div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{getCategoryCount('doctor')}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Specialist Portraits</div>
          </div>
        </div>

        <div className="admin-media-stat-card">
          <div className="admin-media-stat-icon" style={{ color: '#34d399', background: 'rgba(52, 211, 153, 0.12)' }}><Stethoscope size={22} /></div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{getCategoryCount('specialty')}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Clinical Suites</div>
          </div>
        </div>

        <div className="admin-media-stat-card">
          <div className="admin-media-stat-icon" style={{ color: '#fbbf24', background: 'rgba(251, 191, 36, 0.12)' }}><Sparkles size={22} /></div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>100%</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>CDN Accelerated</div>
          </div>
        </div>
      </div>

      {/* ── Search & Filters ── */}
      <div className="admin-media-controls">
        <div className="admin-media-search">
          <Search size={16} color="rgba(255,255,255,0.4)" />
          <input
            type="text"
            placeholder="Search by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-media-category-pills">
          {[
            { id: 'all', label: `All (${getCategoryCount('all')})` },
            { id: 'hospital', label: `Hospitals (${getCategoryCount('hospital')})` },
            { id: 'doctor', label: `Doctors (${getCategoryCount('doctor')})` },
            { id: 'specialty', label: `Specialties (${getCategoryCount('specialty')})` },
            { id: 'case_study', label: `Case Studies (${getCategoryCount('case_study')})` },
            { id: 'branding', label: `Branding (${getCategoryCount('branding')})` },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              className={`admin-media-pill ${category === pill.id ? 'admin-media-pill--active' : ''}`}
              onClick={() => setCategory(pill.id)}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Media Grid ── */}
      {filteredAssets.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
          <Layers size={36} color="rgba(255,255,255,0.3)" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ color: '#fff', fontSize: '1.125rem', margin: '0 0 0.25rem' }}>No media assets found</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Try refining your search keyword or switching category filters.</p>
        </div>
      ) : (
        <div className="admin-media-grid">
          {filteredAssets.map((asset) => (
            <div key={asset.id} className="admin-media-card">
              <div className="admin-media-thumbnail-wrapper">
                <ImageWithFallback
                  src={asset.url}
                  alt={asset.title}
                  className="admin-media-thumbnail"
                  fallbackCategory={asset.category === 'doctor' ? 'doctor' : asset.category === 'specialty' ? 'specialty' : 'hospital'}
                />
                <span className="admin-media-category-badge">{asset.category.replace('_', ' ')}</span>
              </div>

              <div className="admin-media-body">
                <h4 className="admin-media-title" title={asset.title}>{asset.title}</h4>
                <div className="admin-media-meta">
                  <span>{asset.dimensions}</span>
                  <span>{asset.fileSize}</span>
                </div>

                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', margin: '4px 0' }}>
                  {asset.tags.map((t) => (
                    <span key={t} style={{ fontSize: '10px', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', color: 'rgba(255,255,255,0.6)' }}>
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="admin-media-actions">
                  <button
                    type="button"
                    className={`admin-media-btn ${copiedId === asset.id ? 'admin-media-btn--copied' : ''}`}
                    onClick={() => handleCopyUrl(asset)}
                    title="Copy direct asset link"
                  >
                    {copiedId === asset.id ? <Check size={13} /> : <Copy size={13} />}
                    {copiedId === asset.id ? 'Copied' : 'Copy URL'}
                  </button>

                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-media-btn"
                    title="Open full size image in new tab"
                    style={{ flex: '0 0 auto', textDecoration: 'none' }}
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
