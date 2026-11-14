// Build out/davinci.html from scene.json + painter scripts, then render it to mp4 + webm.
// Usage: node render.mjs [--build] [--still t1,t2,...] [--frames N]
//   --build   write out/davinci.html only (open it to watch live)
//   --still   write PNGs of the given seconds to stills/
//   --frames  render only the first N frames (smoke test)
//   --solo <name>  one painter (painters/<name>.mjs) alone; page and stills go to work/<name>/,
//                  so several agents can check their own work at the same time
//   Final video: no --solo; scene.json lists every painter.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out');
mkdirSync(OUT, { recursive: true });
const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };

// Seeded RNG, so a painter script gives the same strokes every run.
function rng(seed) {
  let a = [...seed].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261) >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
// Catmull-Rom smoothing: painters give a few control points, the brush gets a smooth path.
function smooth(pts, n = 8) {
  if (pts.length < 3) return pts;
  const out = [], P = i => pts[Math.max(0, Math.min(pts.length - 1, i))];
  for (let i = 0; i < pts.length - 1; i++)
    for (let j = 0; j < n; j++) {
      const t = j / n, a = P(i - 1), b = P(i), c = P(i + 1), d = P(i + 2);
      out.push([0, 1, 2].map(k => 0.5 * (2 * b[k] + (-a[k] + c[k]) * t + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * t * t + (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * t * t * t)));
    }
  out.push(pts[pts.length - 1]);
  return out;
}
const r4 = x => Math.round(x * 1e4) / 1e4;

// The painter API. A painter script is `export default function (b) { ... }`.
function makeBrush(label, aspect) {
  const ops = [], st = { color: '#000000', size: 0.01, alpha: 1, speed: 0.9 };
  const hex = c => { if (!/^#[0-9a-f]{6}$/i.test(c)) throw new Error(`${label}: colour must be #rrggbb, got ${c}`); return c.toLowerCase(); };
  const norm = pts => pts.map(([x, y, p = 1]) => [x, y, p]);
  const b = {
    aspect, rng: rng(label),
    color(c) { st.color = hex(c); return b; },
    size(s) { st.size = s; return b; },
    alpha(a) { st.alpha = a; return b; },
    speed(v) { st.speed = v; return b; },
    stroke(pts, o = {}) {
      const p = o.smooth === false ? norm(pts) : smooth(norm(pts));
      ops.push({ k: 's', color: hex(o.color || st.color), size: o.size ?? st.size, alpha: o.alpha ?? st.alpha, speed: o.speed ?? st.speed, dry: o.dry ?? 0.5, ...(o.clip && { clip: o.clip }), pts: p.map(q => q.map(r4)) });
      return b;
    },
    // Fill = broad brush strokes, back and forth, clipped to the polygon. Not a flat shape.
    fill(pts, o = {}) {
      const clip = pts.map(([x, y]) => [r4(x), r4(y)]), R = b.rng, size = o.size ?? 0.09;
      const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
      const [ax, bx, ay, by] = [Math.min(...xs) - 0.08, Math.max(...xs) + 0.08, Math.min(...ys), Math.max(...ys)];
      const tilt = o.tilt ?? (R() - 0.5) * 0.12;
      for (let y = ay - size * 0.1, i = 0; y < by + size * 0.4; y += size * 0.42, i++) {
        const row = [];
        for (let k = 0; k <= 4; k++) {
          const x = ax + (bx - ax) * k / 4;
          row.push([x, y + tilt * (x - 0.5) + (R() - 0.5) * size * 0.35, 0.85 + R() * 0.3]);
        }
        if (i % 2) row.reverse();
        b.stroke(row, { color: o.color || st.color, size: size * (0.9 + R() * 0.25), alpha: o.alpha ?? st.alpha, speed: o.speed ?? 2.6, dry: o.dry ?? 0.35, clip });
      }
      return b;
    },
    pause(sec) { ops.push({ k: 'p', d: sec }); return b; },
  };
  return { b, ops };
}

const SOLO = opt('--solo');
const scene = JSON.parse(readFileSync(join(HERE, 'scene.json'), 'utf8'));
if (SOLO) scene.painters = [{ label: SOLO, file: `painters/${SOLO}.mjs` }];
const WORK = SOLO ? join(HERE, 'work', SOLO) : HERE;
mkdirSync(WORK, { recursive: true });
const painters = [];
for (const p of scene.painters) {
  const { b, ops } = makeBrush(p.label, scene.aspect);
  (await import(pathToFileURL(join(HERE, p.file)).href)).default(b);
  painters.push({ label: p.label, ops });
  console.log(`${p.label}: ${ops.length} ops`);
}
const { painters: _, ...rest } = scene;
const html = readFileSync(join(HERE, 'davinci.src.html'), 'utf8')
  .replace('/*%%SCENE%%*/null', JSON.stringify({ ...rest, painters }));
const pagePath = SOLO ? join(WORK, 'page.html') : join(OUT, 'davinci.html');
writeFileSync(pagePath, html);
console.log('wrote', pagePath);
if (args.includes('--build')) process.exit(0);
if (SOLO && !opt('--still')) { console.error('--solo needs --still'); process.exit(1); }

const { chromium } = await import('playwright');
const FPS = 60, W = 1920, H = 1080;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
page.on('pageerror', e => console.error('pageerror:', e.message));
await page.goto(pathToFileURL(pagePath).href + '?capture=1');
await page.waitForFunction(() => window.davinciCapture?.ready);
const { duration: dur, loops } = await page.evaluate(() => window.davinciCapture);
const shot = async t => { await page.evaluate(t => window.davinciCapture.renderAt(t), t); return page.screenshot({ type: 'png' }); };

if (opt('--still')) {
  mkdirSync(join(WORK, 'stills'), { recursive: true });
  for (const t of opt('--still').split(',').map(Number))
    writeFileSync(join(WORK, 'stills', `t${t.toFixed(2)}.png`), await shot(t));
  await browser.close(); process.exit(0);
}

const total = Math.min(Math.round(dur * loops * FPS), Number(opt('--frames')) || Infinity);
const ff = outArgs => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', ...outArgs], { stdio: ['pipe', 'inherit', 'inherit'] });
const mp4 = ff(['-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-crf', '16', '-preset', 'slow', '-movflags', '+faststart', join(OUT, 'davinci.mp4')]);
const webm = ff(['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '28', '-row-mt', '1', '-pix_fmt', 'yuv420p', join(OUT, 'davinci.webm')]);
const write = (p, buf) => new Promise(r => p.stdin.write(buf) ? r() : p.stdin.once('drain', r));
for (let f = 0; f < total; f++) {
  const buf = await shot(f / FPS);
  await Promise.all([write(mp4, buf), write(webm, buf)]);
  if (f % 300 === 0) console.log(`frame ${f}/${total}`);
}
mp4.stdin.end(); webm.stdin.end();
await Promise.all([mp4, webm].map(p => new Promise(r => p.on('close', r))));
await browser.close();
console.log('done');
