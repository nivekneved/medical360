import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets', 'hospitals');

const HOSPITALS = {
  'hosp-medanta': { name: 'Medanta', initials: 'M', color: '#065f46' },
  'hosp-fortis-escorts': { name: 'Fortis Escorts Heart Institute', initials: 'FE', color: '#7c3aae' },
  'hosp-paras': { name: 'Paras Health', initials: 'P', color: '#0e7490' },
  'hosp-kokilaben': { name: 'Kokilaben Dhirubhai Ambani Hospital', initials: 'K', color: '#b45309' },
  'hosp-park': { name: 'Park Hospital', initials: 'P', color: '#1d4ed8' },
  'hosp-aster-prime': { name: 'Aster Prime Hospital', initials: 'A', color: '#be185d' },
};

const svg = (name, initials, color) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f172a"/>
      <stop offset="1" stop-color="${color}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)"/>
  <rect x="24" y="24" width="1152" height="752" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="4"/>
  <circle cx="600" cy="300" r="150" fill="rgba(255,255,255,0.10)"/>
  <text x="600" y="348" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="800" fill="#ffffff" text-anchor="middle">${initials}</text>
  <text x="600" y="540" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="700" fill="#ffffff" text-anchor="middle">${name}</text>
  <text x="600" y="602" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="rgba(255,255,255,0.75)" text-anchor="middle">Official partner hospital &middot; photograph coming soon</text>
</svg>
`;

for (const [id, h] of Object.entries(HOSPITALS)) {
  const dest = path.join(OUT, `${id}__placeholder.svg`);
  fs.writeFileSync(dest, svg(h.name, h.initials, h.color), 'utf8');
  console.log('created', dest);
}
console.log('placeholders done');