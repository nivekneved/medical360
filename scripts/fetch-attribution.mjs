import fs from 'node:fs/promises';

const titles = [
  'File:Apollo Proton Cancer Centre, Chennai.jpg',
  'File:Manipal Hospital front View 4-20-2008 5-24-37 PM.JPG',
  'File:Manippal Hostpiral view 1.JPG',
  'File:Manippal Hostpiral view 2.JPG',
  'File:Krishna Institute of Medical Sciences KIMS Secunderabad.jpg',
  'File:Krishna Institute of Medical Sciences KIMS Secunderabad 2.jpg',
  'File:Yashoda Hospitals Somajiguda.jpg',
  'File:Yashoda Hospital,Secundrabad.jpg',
  'File:Lilavati Hospital, Bandra.jpg',
  'File:Lilavati Hospital.jpg',
  'File:Max Building.jpg',
  'File:HN Hospital.jpg',
  'File:Hurkissandos Hospital.jpg',
  'File:Shankara Nethraalaya Chennai.jpg',
  'File:Mahyco Block Building- Sankara Nethralaya, College Road.jpg',
  'File:Miot Hospital 2.jpg',
  'File:MIOT.JPG',
];

const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo' +
  '&iiprop=extmetadata&titles=' + encodeURIComponent(titles.join('|'));
const res = await fetch(url, { headers: { 'User-Agent': 'Med360-ImageResearch/1.0' } });
const json = await res.json();
const strip = (h) => (h || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
const out = {};
for (const [, page] of Object.entries(json?.query?.pages || {})) {
  const ii = page.imageinfo?.[0];
  if (!ii) continue;
  const meta = ii.extmetadata || {};
  out[page.title] = {
    artist: strip(meta.Artist?.value) || 'Unknown',
    license: meta.LicenseShortName?.value || meta.License?.value || 'unknown',
    licenseUrl: (meta.LicenseUrl?.value || '').split('?')[0],
    page: 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(page.title),
  };
}
await fs.writeFile('scripts/_image_attrib.json', JSON.stringify(out, null, 2), 'utf8');
console.log('wrote attribution for', Object.keys(out).length, 'files');