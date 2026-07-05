// Generates the app icons (charcoal faceplate, amber badge stripe) as PNGs
// without any image dependencies. Placeholder until real art in Phase 7.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};

function png(size, draw) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = draw(x, y, size);
      const o = y * (size * 4 + 1) + 1 + x * 4;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b; raw[o + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const lerp = (a, b, t) => Math.round(a + (b - a) * t);
function draw(x, y, s) {
  const r = s * 0.18; // corner radius
  const dx = Math.max(0, Math.max(r - x, x - (s - 1 - r)));
  const dy = Math.max(0, Math.max(r - y, y - (s - 1 - r)));
  if (dx * dx + dy * dy > r * r) return [0, 0, 0, 0];
  const t = y / s; // faceplate vertical gradient #45484e -> #242629
  let px = [lerp(0x45, 0x24, t), lerp(0x48, 0x26, t), lerp(0x4e, 0x29, t), 255];
  // amber badge stripe (#ffc36b -> #f09a2e) across the middle
  const b0 = s * 0.42, b1 = s * 0.62;
  if (y >= b0 && y < b1) {
    const bt = (y - b0) / (b1 - b0);
    px = [lerp(0xff, 0xf0, bt), lerp(0xc3, 0x9a, bt), lerp(0x6b, 0x2e, bt), 255];
  }
  return px;
}

mkdirSync(new URL('../src-tauri/icons/', import.meta.url), { recursive: true });
for (const [size, name] of [[32, '32x32.png'], [128, '128x128.png'], [512, 'icon.png']]) {
  writeFileSync(new URL(`../src-tauri/icons/${name}`, import.meta.url), png(size, draw));
  console.log(`wrote src-tauri/icons/${name}`);
}
