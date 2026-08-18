// Generates all PWA icon assets for YOU from a single vector source.
// Run with: node scripts/generate-icons.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../public/icons/', import.meta.url));
mkdirSync(OUT, { recursive: true });

// Core mark: a single progress ring (~78% complete) on a deep graphite
// gradient — "your progress, always in motion". No literal text glyph so it
// reads cleanly at every size, from favicon to app-store tile.
function markSvg({ size, padding = 0 }) {
  const r = size / 2;
  const cx = r;
  const cy = r;
  const ringR = r - padding - size * 0.14;
  const stroke = size * 0.09;
  const circumference = 2 * Math.PI * ringR;
  const dash = circumference * 0.78;
  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${size}" y2="${size}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#15151b"/>
      <stop offset="1" stop-color="#0a0a0d"/>
    </linearGradient>
    <linearGradient id="ring" x1="0" y1="0" x2="${size}" y2="${size}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#8b5cf6"/>
      <stop offset="0.55" stop-color="#6366f1"/>
      <stop offset="1" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)"/>
  <circle cx="${cx}" cy="${cy}" r="${ringR}" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="${stroke}"/>
  <circle cx="${cx}" cy="${cy}" r="${ringR}" fill="none" stroke="url(#ring)" stroke-width="${stroke}"
    stroke-linecap="round" stroke-dasharray="${dash} ${circumference}"
    transform="rotate(-90 ${cx} ${cy})"/>
  <circle cx="${cx}" cy="${cy}" r="${size * 0.05}" fill="#ffffff"/>
</svg>`;
}

const targets = [
  { name: 'icon-192.png', size: 192, padding: 0 },
  { name: 'icon-512.png', size: 512, padding: 0 },
  { name: 'icon-maskable-192.png', size: 192, padding: 192 * 0.16 },
  { name: 'icon-maskable-512.png', size: 512, padding: 512 * 0.16 },
  { name: 'apple-touch-icon.png', size: 180, padding: 0 },
];

for (const t of targets) {
  const svg = Buffer.from(markSvg(t));
  await sharp(svg).png().toFile(OUT + t.name);
  console.log('wrote', t.name);
}

// Favicon (32px) goes at the public root.
const publicDir = fileURLToPath(new URL('../public/', import.meta.url));
await sharp(Buffer.from(markSvg({ size: 32, padding: 0 }))).png().toFile(
  publicDir + 'favicon.png'
);
console.log('wrote favicon.png');
