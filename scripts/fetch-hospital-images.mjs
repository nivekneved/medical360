import fs from 'fs';

// Query Wikimedia Commons for real photos of each hospital and write a compact
// manifest (title, download URL, size, license) for manual review + download.
// Usage: node scripts/fetch-hospital-images.mjs

const SEARCHES = [
  { id: 'apollo',        q: 'Apollo Hospitals Chennai building' },
  { id: 'manipal',       q: 'Manipal Hospital Old Airport Road Bengaluru' },
  { id: 'kims',          q: 'KIMS Hospital Secunderabad' },
  { id: 'yashoda',       q: 'Yashoda Hospitals Hyderabad' },
  { id: 'lilavati',      q: 'Lilavati Hospital Mumbai' },
  { id: 'medanta',       q: 'Medanta The Medicity Gurugram' },
  { id: 'fortis',        q: 'Fortis Escorts Heart Institute New Delhi' },
  { id: 'paras',         q: 'Paras Hospital Gurugram' },
  { id: 'max-saket',     q: 'Max Super Speciality Hospital Saket' },
  { id: 'reliance',      q: 'Sir H N Reliance Foundation Hospital Mumbai' },
  { id: 'kokilaben',     q: 'Kokilaben Dhirubhai Ambani Hospital Mumbai' },
  { id: 'park',          q: 'Park Hospital New Delhi' },
  { id: 'sankara',       q: 'Sankara Nethralaya Chennai' },
  { id: 'miot',          q: 'MIOT International Chennai' },
  { id: 'aster',         q: 'Aster Prime Hospital Hyderabad' },
];

const stripQuery = (u) => u.split('?')[0];

async function search(q) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search' +
    `&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=6&prop=imageinfo` +
    '&iiprop=url|size|extmetadata&iiurlwidth=1200';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Med360-ImageResearch/1.0' } });
    const json = await res.json();
    const pages = json?.query?.pages || {};
    const out = [];
    for (const [, p] of Object.entries(pages)) {
      const ii = p.imageinfo?.[0];
      if (!ii) continue;
      const meta = ii.extmetadata || {};
      const license = meta.LicenseShortName?.value || meta.License?.value || 'unknown';
      out.push({
        title: p.title,
        url: stripQuery(ii.thumburl || ii.url),
        width: ii.thumbwidth ?? ii.width,
        height: ii.thumbheight ?? ii.height,
        license,
      });
    }
    return out;
  } catch (e) {
    return [{ error: String(e) }];
  }
}

const results = {};
for (const s of SEARCHES) {
  results[s.id] = { query: s.q, hits: await search(s.q) };
  console.log(`✔ ${s.id}: ${results[s.id].hits.filter(h => !h.error).length} results`);
}

fs.writeFileSync('scripts/_image_manifest.json', JSON.stringify(results, null, 2), 'utf8');
console.log('\nManifest written to scripts/_image_manifest.json');