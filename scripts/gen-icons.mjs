import sharp from "sharp";
import { writeFileSync } from "node:fs";

// Icona installazione: foglia bianca su sfondo emerald arrotondato.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#059669"/>
  <g transform="translate(106 106) scale(12.5)" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </g>
</svg>`;

const buf = Buffer.from(svg);
await sharp(buf).resize(512, 512).png().toFile("public/icon-512.png");
await sharp(buf).resize(192, 192).png().toFile("public/icon-192.png");
// favicon multi-size
await sharp(buf).resize(48, 48).png().toFile("public/favicon-48.png");
writeFileSync("public/icon-source.svg", svg);
console.log("icone generate: icon-192.png, icon-512.png, favicon-48.png");
