// "Night Crossing": a humpback whale swims through the night sky over a sleeping village.
// Order: sky, moon, stars, whale body, belly, fin, flukes, rim light, village, lit windows, the one person awake.
export default function (b) {
  const R = b.rng, lerp = (a, c, t) => a + (c - a) * t;

  // Sky: deep indigo at the top, warmer blue at the horizon.
  const bands = [['#0f1430', 0, 0.3], ['#18214a', 0.26, 0.55], ['#24356a', 0.5, 0.8]];
  for (const [c, y0, y1] of bands) b.fill([[0, y0], [1, y0], [1, y1], [0, y1]], { color: c, size: 0.11, alpha: 1, tilt: 0.02, dry: 0.1 });
  b.fill([[0, 0.72], [1, 0.72], [1, 1], [0, 1]], { color: '#34477a', size: 0.1, alpha: 1, tilt: 0.0, dry: 0.1 });
  // Second pass: long sweeping strokes that blend the bands and give the sky movement.
  for (let i = 0; i < 9; i++) {
    const y = 0.05 + i * 0.09, c = ['#141a3a', '#1c2753', '#2a3c72'][Math.min(2, i / 3 | 0)];
    b.stroke([[-0.05, y], [0.3, y - 0.03], [0.65, y + 0.02], [1.05, y - 0.02]], { color: c, size: 0.07, alpha: 0.7, speed: 2.6, dry: 0.3 });
  }

  // Moon with a soft halo, top right.
  const MX = 0.8, MY = 0.17;
  const circle = (cx, cy, r) => { const c = []; for (let a = 0; a < 6.28; a += 0.3) c.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); return c; };
  for (const r of [0.17, 0.14, 0.115, 0.09, 0.075]) b.fill(circle(MX, MY, r), { color: '#56689e', size: 0.05, alpha: 0.12, tilt: 0, dry: 0.5 });
  b.pause(0.2);
  b.fill(circle(MX, MY, 0.06), { color: '#efe3bf', size: 0.03, alpha: 1, tilt: 0, dry: 0.1, speed: 1.6 });
  b.stroke([[MX - 0.035, MY - 0.005], [MX - 0.01, MY + 0.02], [MX + 0.015, MY + 0.03]], { color: '#cdbd92', size: 0.016, alpha: 0.45 });
  b.stroke([[MX + 0.015, MY - 0.03], [MX + 0.03, MY - 0.01]], { color: '#fbf5e2', size: 0.014, alpha: 0.8 });

  // Stars: short dabs, a few bright ones.
  for (let i = 0; i < 46; i++) {
    const x = R(), y = R() * 0.7;
    if (Math.hypot(x - MX, y - MY) < 0.15) continue;
    const s = R() < 0.15 ? 0.012 : 0.006;
    b.stroke([[x, y], [x + 0.004, y + 0.002]], { color: R() < 0.3 ? '#f5d99a' : '#dfe6f5', size: s, alpha: 0.85, speed: 3 });
  }
  b.pause(0.4);

  // Whale geometry. Centre line from tail (s=0) to head (s=1), rising to the right.
  const T = [0.1, 0.66], H = [0.86, 0.33];
  const dx = H[0] - T[0], dy = H[1] - T[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = uy, ny = -ux; // n points up-left (the back)
  const bend = s => 0.035 * Math.sin(Math.PI * s);           // slight arch
  const half = s => 0.01 + 0.115 * Math.pow(Math.sin(Math.PI * 0.95 * Math.pow(s, 1.4)), 0.7);
  const at = (s, o) => { const c = bend(s) + o; return [T[0] + dx * s + nx * c, T[1] + dy * s + ny * c]; };
  const back = s => at(s, half(s)), belly = s => at(s, -half(s) * 0.95);
  const N = 24, S = i => 0.04 + 0.96 * i / N;
  const outline = [];
  for (let i = 0; i <= N; i++) outline.push(back(S(i)));
  outline.push(at(1.025, -0.004));
  for (let i = N; i >= 0; i--) outline.push(belly(S(i)));
  const tilt = dy / dx;

  // Body block-in, then strokes along the body to carry the form.
  b.fill(outline, { color: '#1d2742', size: 0.07, alpha: 1, tilt, dry: 0.2 });
  for (let k = 0; k < 7; k++) {
    const o = lerp(0.9, -0.2, k / 6), pts = [];
    for (let i = 0; i <= 10; i++) { const s = 0.06 + 0.92 * i / 10; pts.push([...at(s, half(s) * o), 0.6 + 0.6 * Math.sin(Math.PI * s)]); }
    b.stroke(pts, { color: k < 3 ? '#2c3a5e' : '#253150', size: 0.035, alpha: 0.7, speed: 2.2, dry: 0.45 });
  }

  // Pale belly with ventral grooves.
  const bellyPoly = [];
  const inner = s => -half(s) * lerp(0.95, 0.12, Math.min(1, (s - 0.42) / 0.22));
  for (let i = 0; i <= 12; i++) { const s = lerp(0.42, 0.99, i / 12); bellyPoly.push(at(s, inner(s))); }
  for (let i = 12; i >= 0; i--) { const s = lerp(0.42, 0.99, i / 12); bellyPoly.push(belly(s)); }
  b.fill(bellyPoly, { color: '#7d8cab', size: 0.04, alpha: 0.9, tilt, dry: 0.3 });
  for (let k = 0; k < 6; k++) {
    const o = lerp(-0.3, -0.85, k / 5), pts = [];
    for (let i = 0; i <= 8; i++) { const s = lerp(0.6 + k * 0.012, 0.97, i / 8); pts.push(at(s, half(s) * o)); }
    b.stroke(pts, { color: '#3a4766', size: 0.007, alpha: 0.85, speed: 2.6, dry: 0.3 });
  }
  b.pause(0.3);

  // Long pectoral fin, sweeping down and back, white underside.
  const F0 = at(0.68, -half(0.68) * 0.6), F1 = at(0.6, -half(0.6) * 0.9);
  const tip = [F0[0] - 0.2, F0[1] + 0.2];
  const fin = [F0, [lerp(F0[0], tip[0], 0.5) + 0.025, lerp(F0[1], tip[1], 0.5) + 0.0], tip, [lerp(F1[0], tip[0], 0.5) - 0.01, lerp(F1[1], tip[1], 0.5) - 0.01], F1];
  b.fill(fin, { color: '#c9cfdc', size: 0.035, alpha: 0.95, tilt: -1, dry: 0.3 });
  b.stroke([F1, [lerp(F1[0], tip[0], 0.5) - 0.012, lerp(F1[1], tip[1], 0.5) - 0.012, 0.9], [tip[0] + 0.01, tip[1] - 0.01, 0.3]], { color: '#4a5778', size: 0.016, alpha: 0.8 });
  for (let k = 1; k <= 3; k++) { const p = [lerp(F0[0], tip[0], k / 4) + 0.012, lerp(F0[1], tip[1], k / 4) + 0.004]; b.stroke([p, [p[0] + 0.006, p[1] - 0.004]], { color: '#eef0f5', size: 0.009, alpha: 0.9 }); }

  // Tail flukes, spread across the line of travel.
  const tb = at(0.03, 0), fl = [tb[0] - ux * 0.02 + nx * 0.1, tb[1] - uy * 0.02 + ny * 0.1], fr = [tb[0] - ux * 0.02 - nx * 0.1, tb[1] - uy * 0.02 - ny * 0.1];
  for (const sg of [1, -1]) {
    const m = [tb[0] + nx * sg * 0.05 - ux * 0.005, tb[1] + ny * sg * 0.05 - uy * 0.005], e = [tb[0] + nx * sg * 0.1 - ux * 0.035, tb[1] + ny * sg * 0.1 - uy * 0.035];
    b.stroke([[...tb, 1.3], [...m, 1.1], [...e, 0.2]], { color: '#1d2742', size: 0.045, alpha: 1, dry: 0.1 });
    b.stroke([[...tb, 0.6], [...m, 0.5], [...e, 0.1]], { color: '#a9b6d6', size: 0.012, alpha: 0.6 });
  }

  // Moonlight on the back: the light comes from the top right.
  for (let k = 0; k < 3; k++) {
    const pts = [];
    for (let i = 0; i <= 9; i++) { const s = lerp(0.25 + k * 0.08, 0.97, i / 9); pts.push([...at(s, half(s) * (0.86 - k * 0.12)), 0.3 + 0.9 * s]); }
    b.stroke(pts, { color: ['#a9b6d6', '#d7dcea', '#f1e6c4'][k], size: 0.016 - k * 0.004, alpha: 0.75, speed: 1.6, dry: 0.55 });
  }
  // Knobs on the head, eye, mouth line.
  for (let i = 0; i < 9; i++) { const s = 0.86 + R() * 0.12, p = at(s, half(s) * (0.2 + R() * 0.6)); b.stroke([p, [p[0] + 0.003, p[1]]], { color: '#5b6a90', size: 0.007, alpha: 0.9, speed: 3 }); }
  const mouth = []; for (let i = 0; i <= 6; i++) { const s = lerp(0.74, 0.995, i / 6); mouth.push(at(s, -half(s) * 0.15)); }
  b.stroke(mouth, { color: '#111727', size: 0.008, alpha: 0.9 });
  const eye = at(0.78, -half(0.78) * 0.02);
  b.stroke([eye, [eye[0] + 0.005, eye[1] - 0.002]], { color: '#0a0d18', size: 0.013, alpha: 1 });
  b.stroke([[eye[0] + 0.003, eye[1] - 0.003], [eye[0] + 0.005, eye[1] - 0.004]], { color: '#f1e6c4', size: 0.004, alpha: 1 });
  b.pause(0.4);

  // Wake: a drift of sparks behind the flukes, like bubbles in the air.
  for (let i = 0; i < 22; i++) {
    const t = i / 21, x = tb[0] - 0.02 - t * 0.12 + (R() - 0.5) * 0.06, y = tb[1] + 0.02 + Math.sin(t * 3) * 0.05 + (R() - 0.5) * 0.05;
    b.stroke([[x, y], [x + 0.003, y]], { color: '#e3ecfa', size: 0.008 + R() * 0.014 * (1 - t), alpha: 0.9, speed: 3 });
  }

  // The village: a dark hill and roofs, small against the whale.
  const hill = [[0, 0.86], [0.2, 0.83], [0.45, 0.85], [0.7, 0.82], [1, 0.84], [1, 1], [0, 1]];
  b.fill(hill, { color: '#0b0e1c', size: 0.06, alpha: 1, tilt: 0 });
  const houses = [];
  let x = 0.03;
  while (x < 0.95) {
    const w = 0.04 + R() * 0.035, h = 0.035 + R() * 0.04, base = 0.87;
    houses.push([x, w, h]);
    b.fill([[x, base], [x, base - h], [x + w / 2, base - h - w * 0.55], [x + w, base - h], [x + w, base]], { color: '#0d1122', size: 0.025, alpha: 1, tilt: 0 });
    x += w + 0.008 + R() * 0.03;
  }
  // A steeple.
  b.fill([[0.6, 0.87], [0.6, 0.76], [0.613, 0.7], [0.626, 0.76], [0.626, 0.87]], { color: '#0d1122', size: 0.02, alpha: 1, tilt: 0 });
  // Moon catches the roof ridges.
  for (const [hx, w, h] of houses) b.stroke([[hx + w / 2, 0.87 - h - w * 0.55], [hx + w, 0.87 - h]], { color: '#3b4c7e', size: 0.005, alpha: 0.8, speed: 3 });

  // Windows: most dark, a few lit. One window is open, and someone is awake.
  b.pause(0.3);
  for (const [hx, w, h] of houses) {
    if (R() < 0.45) continue;
    const wx = hx + w * (0.25 + R() * 0.5), wy = 0.87 - h * (0.35 + R() * 0.3);
    b.stroke([[wx, wy], [wx, wy + 0.008]], { color: '#f2b84b', size: 0.009, alpha: 1, speed: 2 });
  }
  // The one person awake: a small figure with a lantern on the hill, looking up.
  b.fill([[0, 0.93], [0.12, 0.905], [0.26, 0.9], [0.4, 0.92], [0.55, 0.955], [0.7, 0.985], [0.78, 1], [0, 1]], { color: '#05070f', size: 0.04, alpha: 1, tilt: 0 });
  const P = [0.22, 0.905];
  const LX = P[0] + 0.024, LY = P[1] - 0.036;
  for (let i = 0; i < 16; i++) {
    const a = R() * 6.28, r = R() * 0.03, x = LX + Math.cos(a) * r, y = LY + Math.sin(a) * r;
    b.stroke([[x - 0.01, y], [x + 0.01, y + 0.003]], { color: i < 8 ? '#b9783a' : '#e8a94f', size: 0.05 - i * 0.002, alpha: 0.2, speed: 3, dry: 0.5 });
  }
  const fig = [[-0.017, 0.004], [-0.011, -0.03], [-0.01, -0.052], [-0.004, -0.057], [0.003, -0.053], [0.004, -0.03], [0.009, 0.004]].map(([u, v]) => [P[0] + u, P[1] + v]);
  b.fill(fig, { color: '#020308', size: 0.014, alpha: 1, tilt: 0, dry: 0 });
  b.fill(circle(P[0] - 0.003, P[1] - 0.066, 0.009), { color: '#020308', size: 0.01, alpha: 1, tilt: 0, dry: 0 });
  b.stroke([[P[0] - 0.001, P[1] - 0.055], [P[0] + 0.012, P[1] - 0.045], [LX, LY - 0.008]], { color: '#020308', size: 0.007, alpha: 1 });
  b.stroke([[LX, LY], [LX, LY + 0.008]], { color: '#ffd27a', size: 0.013, alpha: 1 });
  b.stroke([[P[0] + 0.004, P[1] - 0.05], [P[0] + 0.006, P[1] - 0.02], [P[0] + 0.009, P[1]]], { color: '#c98a3c', size: 0.004, alpha: 0.8 });
  b.stroke([[P[0] - 0.003, P[1] - 0.05], [P[0] + 0.001, P[1] - 0.045]], { color: '#c98a3c', size: 0.004, alpha: 0.8 });

  // Last touch: the brightest stars and a glint on the whale's back.
  b.pause(0.3);
  for (const [sx, sy] of [[0.12, 0.12], [0.42, 0.08], [0.6, 0.27]]) {
    b.stroke([[sx - 0.012, sy], [sx + 0.012, sy]], { color: '#f7efd6', size: 0.004, alpha: 0.9, speed: 2 });
    b.stroke([[sx, sy - 0.012], [sx, sy + 0.012]], { color: '#f7efd6', size: 0.004, alpha: 0.9, speed: 2 });
  }
  const g = at(0.72, half(0.72) * 0.85);
  b.stroke([[g[0] - 0.02, g[1] + 0.008], [g[0] + 0.02, g[1] - 0.006]], { color: '#fff6dc', size: 0.008, alpha: 0.9 });
}
