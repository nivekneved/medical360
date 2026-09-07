/**
 * Generates public/sitemap.xml from the current specialty + hospital seeds
 * plus all static routes. Run before each release:
 *
 *   node scripts/generate-sitemap.mjs
 *
 * Override the canonical origin with SITE_URL:
 *   SITE_URL=https://www.med360.mu node scripts/generate-sitemap.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = (process.env.SITE_URL || 'https://www.med360.mu').replace(/\/+$/, '');
const TODAY = new Date().toISOString().slice(0, 10);

function loadSeedIds(fileName) {
  const content = fs.readFileSync(path.join(__dirname, '..', 'src', 'core', 'mock', 'seeds', fileName), 'utf8');
  const clean = content
    .replace(/import\s+type\s+[^;]+;/g, '')
    .replace(/:\s*(Specialty|Hospital|Doctor|CaseStudy|Inquiry)\[\]/g, '')
    .replace(/export\s+const\s+(\w+)\s*=\s*/g, 'exports.$1 = ');
  const sandbox = { exports: {} };
  vm.createContext(sandbox);
  vm.runInContext(clean, sandbox);
  return sandbox.exports;
}

const { specialtiesSeed } = loadSeedIds('specialties.seed.ts');
const { hospitalsSeed } = loadSeedIds('hospitals.seed.ts');

const staticRoutes = [
  { path: '/',                 priority: '1.0',  freq: 'daily'   },
  { path: '/how-it-works',     priority: '0.9',  freq: 'monthly' },
  { path: '/hospitals',        priority: '0.95', freq: 'daily'   },
  { path: '/specialties',      priority: '0.95', freq: 'weekly'  },
  { path: '/case-studies',     priority: '0.8',  freq: 'weekly'  },
  { path: '/cost-calculator',  priority: '0.7',  freq: 'monthly' },
  { path: '/describe-need',    priority: '0.7',  freq: 'monthly' },
  { path: '/contact',          priority: '0.7',  freq: 'monthly' },
  { path: '/about',            priority: '0.8',  freq: 'monthly' },
  { path: '/privacy',          priority: '0.3',  freq: 'yearly'  },
  { path: '/terms',            priority: '0.3',  freq: 'yearly'  },
  { path: '/cookies',          priority: '0.3',  freq: 'yearly'  },
  { path: '/medical-disclaimer', priority: '0.3', freq: 'yearly' },
];

const urls = [
  ...staticRoutes,
  ...hospitalsSeed.map(h => ({ path: `/hospitals/${h.id}`,   priority: '0.8', freq: 'weekly'  })),
  ...specialtiesSeed.map(s => ({ path: `/specialties/${s.id}`, priority: '0.8', freq: 'weekly' })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${SITE_URL}${u.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), xml, 'utf8');
console.log(`✅ sitemap.xml generated with ${urls.length} URLs at ${SITE_URL}`);
