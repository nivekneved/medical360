import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'assets', 'hospitals');

// id -> [titles in order: front (index 0), then gallery]
const PICKS = {
  'hosp-apollo':   ['File:Apollo Proton Cancer Centre, Chennai.jpg'],
  'hosp-manipal':  ['File:Manipal Hospital front View 4-20-2008 5-24-37 PM.JPG', 'File:Manippal Hostpiral view 1.JPG', 'File:Manippal Hostpiral view 2.JPG'],
  'hosp-kims':     ['File:Krishna Institute of Medical Sciences KIMS Secunderabad.jpg', 'File:Krishna Institute of Medical Sciences KIMS Secunderabad 2.jpg'],
  'hosp-yashoda':  ['File:Yashoda Hospitals Somajiguda.jpg', 'File:Yashoda Hospital,Secundrabad.jpg'],
  'hosp-lilavati': ['File:Lilavati Hospital, Bandra.jpg', 'File:Lilavati Hospital.jpg'],
  'hosp-max-saket': ['File:Max Building.jpg'],
  'hosp-reliance': ['File:HN Hospital.jpg', 'File:Hurkissandos Hospital.jpg'],
  'hosp-sankara':  ['File:Shankara Nethraalaya Chennai.jpg', 'File:Mahyco Block Building- Sankara Nethralaya, College Road.jpg'],
  'hosp-miot':     ['File:Miot Hospital 2.jpg', 'File:MIOT.JPG'],
};

async function loadManifests() {
  const merged = {};
  for (const name of ['_image_manifest.json', '_image_manifest2.json', '_image_manifest3.json']) {
    const p = path.join(__dirname, name);
    try {
      const raw = JSON.parse(await fs.readFile(p, 'utf8'));
      for (const [id, r] of Object.entries(raw)) {
        for (const h of r.hits || []) {
          if (h.title && !merged[h.title]) merged[h.title] = h;
        }
      }
    } catch {}
  }
  return merged;
}

const stripQuery = (u) => u.split('?')[0];
const extOf = (u) => {
  const m = stripQuery(u).match(/\.(jpe?g|png|tif{1,2}|gif|svg)(?=$|[/#])/i);
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg').replace('tiff', 'tif').replace('tif', 'jpg') : 'jpg';
};

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Med360-ImageResearch/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
  return buf.length;
}

const manifest = await loadManifests();
await fs.mkdir(OUT, { recursive: true });

const credits = [];
let count = 0;
for (const [id, titles] of Object.entries(PICKS)) {
  const urls = [];
  for (const t of titles) {
    const entry = manifest[t];
    if (!entry || !entry.url) { console.log(`✖ no entry: ${t}`); continue; }
    const url = stripQuery(entry.url);
    const dest = path.join(OUT, `${id}__${urls.length + 1}.${extOf(url)}`);
    try {
      const bytes = await download(url, dest);
      urls.push(`/assets/hospitals/${path.basename(dest)}`);
      credits.push({ hospital: id, file: path.basename(dest), title: t, license: entry.license, source: url });
      count++;
      console.log(`✔ ${path.basename(dest)} (${bytes} bytes) <- ${t.slice(0, 60)}`);
    } catch (e) {
      console.log(`✖ download failed for ${t}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 600));
  }
  if (urls.length) {
    console.log(`  → ${id}: front=${urls[0]} gallery=${urls.slice(1).join(', ')}`);
  }
}

await fs.writeFile(path.join(__dirname, '_image_credits.json'), JSON.stringify(credits, null, 2), 'utf8');
console.log(`\nDone. ${count} images downloaded. Credits manifest written.`);