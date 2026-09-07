import fs from 'fs';

const SEARCHES = [
  { id: 'kims',          q: 'Krishna Institute of Medical Sciences Secunderabad' },
  { id: 'medanta',       q: 'Medanta The Medicity Gurugram building' },
  { id: 'fortis',        q: 'Fortis Escorts Heart Institute Okhla' },
  { id: 'paras',         q: 'Paras Hospitals Gurugram' },
  { id: 'max-saket',     q: 'Max Super Speciality Hospital Saket Delhi' },
  { id: 'reliance',      q: 'Reliance Foundation Hospital Mumbai building' },
  { id: 'kokilaben',     q: 'Kokilaben Dhirubhai Ambani Hospital Andheri' },
  { id: 'park',          q: 'Park Hospital New Delhi' },
  { id: 'sankara',       q: 'Sankara Nethralaya Chennai' },
  { id: 'miot',          q: 'MIOT International Hospital Chennai' },
  { id: 'aster',         q: 'Aster Prime Hyderabad' },
];

const stripQuery = (u) => u.split('?')[0];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function search(q) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search' +
    `&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=8&prop=imageinfo` +
    '&iiprop=url|size|extmetadata&iiurlwidth=1200';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Med360-ImageResearch/1.0' } });
    const text = await res.text();
    const json = JSON.parse(text);
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
  const ok = results[s.id].hits.filter(h => !h.error).length;
  console.log(`✔ ${s.id}: ${ok} results`);
  await sleep(1500);
}

fs.writeFileSync('scripts/_image_manifest2.json', JSON.stringify(results, null, 2), 'utf8');
console.log('\nRetry manifest written to scripts/_image_manifest2.json');