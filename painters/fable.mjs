// "What the Lantern Doesn't Know" — a night rower with one lantern; under the keel, a whale.
export default function (b) {
  const R = b.rng, j = a => (R() - 0.5) * a;
  const dot = (x, y, s, color, alpha = 1) => {
    const a = R() * 6.28, l = s * 0.75;
    b.stroke([[x - Math.cos(a) * l, y - Math.sin(a) * l], [x, y, 1.5], [x + Math.cos(a) * l, y + Math.sin(a) * l]], { color, size: s, alpha, speed: 0.6, dry: 0 });
  };
  const SURF = 0.235;

  // ---- 1. Block in: night sky, then the water from teal down to black-blue ----
  b.fill([[0, 0], [1, 0], [1, SURF + 0.02], [0, SURF + 0.02]], { color: '#231f44', size: 0.15, speed: 3, dry: 0.1, tilt: 0.02 });
  b.fill([[0, 0], [1, 0], [1, 0.15], [0, 0.15]], { color: '#15142f', size: 0.14, speed: 3, alpha: 0.85, dry: 0.3, tilt: -0.03 });
  const bands = [['#1c5a66', SURF, 0.45], ['#134454', 0.38, 0.62], ['#0d3145', 0.55, 0.82], ['#081d30', 0.74, 1.02]];
  for (const [c, y0, y1] of bands) b.fill([[0, y0], [1, y0], [1, y1], [0, y1]], { color: c, size: 0.15, speed: 3, dry: 0.1 });
  for (const [c, y0, y1] of bands) b.fill([[0, y0 + 0.03], [1, y0 + 0.03], [1, y1], [0, y1]], { color: c, size: 0.15, speed: 3, alpha: 0.85, dry: 0.3, tilt: 0.05 });
  b.fill([[0, 0.9], [1, 0.9], [1, 1.02], [0, 1.02]], { color: '#050f1d', size: 0.13, speed: 3, alpha: 0.7, dry: 0.5 });
  for (const [c, y, a] of [['#3d3566', SURF - 0.05, 0.7], ['#5a4a7c', SURF - 0.022, 0.75], ['#7a6590', SURF - 0.008, 0.55]])
    b.stroke([[-0.02, y + j(0.006)], [0.33, y + j(0.006)], [0.66, y + j(0.006)], [1.02, y + j(0.006)]], { color: c, size: 0.045, alpha: a, speed: 2.2, dry: 0.5 });
  // soften the steps in the deep
  for (const [c, y] of [['#17505e', 0.4], ['#103b4d', 0.585], ['#0a273b', 0.78], ['#071827', 0.9]])
    b.stroke([[-0.02, y + j(0.01)], [0.33, y + j(0.02)], [0.66, y + j(0.02)], [1.02, y + j(0.01)]], { color: c, size: 0.08, alpha: 0.6, speed: 2.4, dry: 0.6 });
  // the waterline
  b.stroke([[-0.02, SURF + 0.004], [0.3, SURF - 0.003], [0.6, SURF + 0.004], [1.02, SURF]], { color: '#2f7c84', size: 0.022, alpha: 0.9, speed: 1.6, dry: 0.3 });
  b.stroke([[-0.02, SURF - 0.004], [0.35, SURF + 0.002], [0.7, SURF - 0.004], [1.02, SURF - 0.002]], { color: '#8fc2bd', size: 0.007, alpha: 0.85, speed: 1.6, dry: 0.7 });

  // stars
  for (let i = 0; i < 16; i++) dot(0.03 + R() * 0.94, 0.02 + R() * 0.15, 0.004 + R() * 0.004, '#d9d6ea', 0.6 + R() * 0.4);

  // ---- 2. The boat: for a moment this is the whole picture ----
  const BX = 0.6, BY = SURF, K = 1.5;
  for (let n = 0; n < 2; n++) b.stroke([[BX - K * 0.075, BY - K * 0.022, 0.5], [BX - K * 0.04, BY - K * 0.002, 1.1], [BX + K * 0.02, BY + K * 0.002, 1.2], [BX + K * 0.07, BY - K * 0.012, 0.9], [BX + K * 0.092, BY - K * 0.03, 0.4]], { color: '#120d14', size: K * 0.026, speed: 0.5, dry: 0 });
  b.stroke([[BX - K * 0.07, BY - K * 0.02], [BX, BY - K * 0.012], [BX + K * 0.088, BY - K * 0.028]], { color: '#5a3b2a', size: K * 0.006, speed: 0.5, dry: 0.2 });
  // rower: back, head, oar
  for (let n = 0; n < 2; n++) b.stroke([[BX - K * 0.022, BY - K * 0.012, 1.2], [BX - K * 0.026, BY - K * 0.04, 1], [BX - K * 0.016, BY - K * 0.058, 0.8]], { color: '#120d14', size: K * 0.02, speed: 0.6, dry: 0 });
  for (let n = 0; n < 3; n++) dot(BX - K * 0.012, BY - K * 0.072, K * 0.017, '#120d14');
  b.stroke([[BX - K * 0.018, BY - K * 0.045], [BX + K * 0.02, BY - K * 0.02], [BX + K * 0.075, BY + K * 0.018]], { color: '#120d14', size: K * 0.005, speed: 0.5, dry: 0 });
  // lantern pole and lantern at the bow
  const LX = BX + K * 0.082, LY = BY - K * 0.085;
  b.stroke([[BX + K * 0.08, BY - K * 0.028], [LX, LY + 0.008]], { color: '#120d14', size: K * 0.005, speed: 0.5, dry: 0 });
  for (const [r, a] of [[0.1, 0.12], [0.065, 0.2], [0.036, 0.4]]) {
    const ring = []; for (let k = 0; k <= 10; k++) ring.push([LX + Math.cos(k * 0.63) * r * 0.5, LY + Math.sin(k * 0.63) * r * 0.5]);
    b.stroke(ring, { color: '#e8862e', size: r, alpha: a, speed: 0.8, dry: 0.2 });
  }
  for (let n = 0; n < 2; n++) dot(LX, LY, 0.024, '#ffb648'); dot(LX, LY, 0.012, '#fff1c4');
  // reflection breaking up on the water
  for (let i = 0; i < 7; i++) {
    const y = BY + 0.02 + i * 0.02, w = 0.04 - i * 0.004;
    b.stroke([[LX - w + j(0.01), y], [LX + j(0.008), y + 0.003, 1.2], [LX + w + j(0.01), y]], { color: i < 3 ? '#ffb648' : '#e8862e', size: K * 0.008, alpha: 0.9 - i * 0.1, speed: 0.5, dry: 0.3 });
  }
  b.pause(0.5);

  // ---- 3. Lantern light falling into the deep ----
  for (let i = 0; i < 7; i++) {
    const x1 = LX - 0.1 + i * 0.04 + j(0.02), spread = (x1 - LX) * 2.2;
    b.stroke([[x1, SURF + 0.03, 0.5], [x1 + spread * 0.5, 0.42, 1], [x1 + spread, 0.6, 0.7]], { color: '#3f9a98', size: 0.05, alpha: 0.13, speed: 0.9, dry: 0.8 });
  }

  // ---- 4. The whale: dark mass first, along the spine ----
  const SP = [[0.13, 0.47, 0.014], [0.22, 0.545, 0.03], [0.34, 0.61, 0.062], [0.48, 0.655, 0.092], [0.62, 0.662, 0.104], [0.76, 0.635, 0.096], [0.87, 0.59, 0.068], [0.945, 0.552, 0.022]];
  const at = t => {                       // t 0..1 along spine -> [x, y, halfwidth, nx, ny]
    const n = SP.length - 1, u = Math.min(n - 1e-6, Math.max(0, t * n)), i = Math.floor(u), f = u - i;
    const P = k => SP[Math.max(0, Math.min(n, k))], a = P(i - 1), p = P(i), q = P(i + 1), d = P(i + 2);
    const cr = k => 0.5 * (2 * p[k] + (-a[k] + q[k]) * f + (2 * a[k] - 5 * p[k] + 4 * q[k] - d[k]) * f * f + (-a[k] + 3 * p[k] - 3 * q[k] + d[k]) * f * f * f);
    return [cr(0), cr(1), cr(2)];
  };
  const body = (f, t0, t1, o, wob = 0.05) => {   // one stroke along the body at cross position f (-1 back .. 1 belly)
    const pts = [], n = Math.max(3, Math.round((t1 - t0) * 9));
    for (let k = 0; k <= n; k++) {
      const t = t0 + (t1 - t0) * k / n, [x, y, h] = at(t), [x2, y2] = at(Math.min(1, t + 0.02)), [x1, y1] = at(Math.max(0, t - 0.02));
      let nx = -(y2 - y1), ny = x2 - x1; const l = Math.hypot(nx, ny); nx /= l; ny /= l;
      const ff = f + j(wob);
      pts.push([x + nx * ff * h, y + ny * ff * h, Math.max(0.22, h / 0.104) * (o.p ?? 1)]);
    }
    if (o.rev) pts.reverse();
    b.stroke(pts, o);
  };
  // silhouette
  for (const f of [-0.7, -0.25, 0.2, 0.62, -0.5, 0.0, 0.45]) body(f, 0, 1, { color: '#2c4860', size: 0.062, speed: 0.5, dry: 0.15, rev: R() < 0.5 });
  // flukes
  const fluke = (pts, o) => b.stroke(pts, { color: '#2c4860', size: 0.06, speed: 0.6, dry: 0.2, ...o });
  fluke([[0.15, 0.485, 0.45], [0.105, 0.44, 1.1], [0.07, 0.385, 1.2], [0.035, 0.335, 0.4]]);
  fluke([[0.15, 0.485, 0.45], [0.095, 0.475, 1.1], [0.05, 0.49, 1.1], [0.012, 0.525, 0.4]]);
  fluke([[0.12, 0.465, 0.8], [0.075, 0.435, 1], [0.05, 0.46, 0.9]], { size: 0.05 });
  // long pectoral flipper
  b.stroke([[0.69, 0.735, 0.9], [0.64, 0.8, 1.15], [0.575, 0.87, 1], [0.5, 0.93, 0.6], [0.455, 0.955, 0.25]], { color: '#2c4860', size: 0.062, speed: 0.6, dry: 0.15 });

  // ---- 5. Form: dark back, mid flank, pale belly ----
  for (const f of [-0.82, -0.6, -0.4]) body(f, 0.02, 0.98, { color: '#1b3147', size: 0.04, alpha: 0.9, speed: 0.5, dry: 0.4 });
  for (const f of [-0.15, 0.08]) body(f, 0.05, 0.97, { color: '#3f6379', size: 0.04, alpha: 0.85, speed: 0.5, dry: 0.5, rev: true });
  for (const f of [0.3, 0.5]) body(f, 0.2, 0.97, { color: '#6f95a3', size: 0.036, alpha: 0.85, speed: 0.5, dry: 0.5 });
  for (const f of [0.66, 0.8]) body(f, 0.3, 0.96, { color: '#b9cfcc', size: 0.03, alpha: 0.9, speed: 0.5, dry: 0.45, rev: true });
  for (const [f, c] of [[-0.3, '#34546b'], [0.2, '#587f92'], [0.58, '#93b3b8']]) body(f, 0.12, 0.96, { color: c, size: 0.022, alpha: 0.7, speed: 0.5, dry: 0.8 });
  body(0.88, 0.42, 0.93, { color: '#e6ece0', size: 0.016, alpha: 0.9, speed: 0.6, dry: 0.5 });
  // throat grooves, following the jaw
  for (let i = 0; i < 7; i++) body(0.34 + i * 0.085, 0.5 + i * 0.012, 0.93 - i * 0.012, { color: i % 2 ? '#3f6379' : '#2c4860', size: 0.007, alpha: 0.9, speed: 0.7, dry: 0.3, p: 1 }, 0.012);
  // mouth line and eye
  b.stroke([[0.945, 0.556], [0.9, 0.592], [0.84, 0.625], [0.785, 0.66], [0.75, 0.672]], { color: '#0b1622', size: 0.011, speed: 0.5, dry: 0 });
  dot(0.762, 0.648, 0.016, '#0b1622'); dot(0.764, 0.645, 0.004, '#e6ece0');
  // knobs on the head
  for (let i = 0; i < 6; i++) dot(0.83 + i * 0.02 + j(0.008), 0.578 - i * 0.008 + j(0.008), 0.007, '#4f758a', 0.9);
  // flipper underside and knuckled edge
  b.stroke([[0.675, 0.75, 0.8], [0.63, 0.805, 1], [0.57, 0.868, 0.9], [0.5, 0.925, 0.4]], { color: '#b9cfcc', size: 0.03, alpha: 0.9, speed: 0.6, dry: 0.5 });
  b.stroke([[0.66, 0.775, 0.6], [0.6, 0.845, 1], [0.52, 0.915, 0.4]], { color: '#e6ece0', size: 0.012, alpha: 0.85, speed: 0.6, dry: 0.6 });
  // fluke lights
  b.stroke([[0.125, 0.46, 0.5], [0.085, 0.415, 1], [0.045, 0.35, 0.4]], { color: '#6f95a3', size: 0.016, alpha: 0.8, speed: 0.6, dry: 0.6 });
  b.stroke([[0.12, 0.482, 0.5], [0.07, 0.478, 1], [0.025, 0.512, 0.4]], { color: '#6f95a3', size: 0.014, alpha: 0.8, speed: 0.6, dry: 0.6 });

  // ---- 6. The lantern finds its back ----
  for (let i = 0; i < 9; i++) { const t0 = 0.4 + i * 0.055 + j(0.02); body(-1.0 + R() * 0.12, t0, t0 + 0.05 + R() * 0.05, { color: i % 3 ? '#e8a04e' : '#ffcf85', size: 0.007, alpha: 0.8 - Math.abs(i - 4.5) * 0.09, speed: 0.5, dry: 0.7, p: 0.8 }, 0.01); }
  for (let i = 0; i < 10; i++) { const t = 0.4 + R() * 0.45, [x, y, h] = at(t); dot(x + j(0.02), y - h * (0.6 + R() * 0.3), 0.004, '#e8a04e', 0.5); }

  // bubbles climbing from the blowhole toward the keel
  for (let i = 0; i < 12; i++) { const k = i / 11; dot(0.74 - k * 0.07 + j(0.03), 0.53 - k * 0.26, 0.005 + R() * 0.007 * (1 - k * 0.5), '#bfe3dc', 0.75 - k * 0.3); }
  // drifting motes
  for (let i = 0; i < 26; i++) dot(R(), 0.3 + R() * 0.68, 0.003 + R() * 0.003, '#7fb7b3', 0.25 + R() * 0.3);
  // last touch: the flame
  dot(LX, LY, 0.02, '#ffd980'); dot(LX, LY, 0.011, '#fffbe6');
}
