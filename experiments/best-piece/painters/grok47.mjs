// Displacement — the berg and the animal under it are the same pale paint.
export default function (b) {
  const j = (a) => (b.rng() - 0.5) * a;
  const mix = (a, c, t) => {
    t = Math.max(0, Math.min(1, t));
    const A = parseInt(a.slice(1), 16), B = parseInt(c.slice(1), 16);
    let o = '#';
    for (let s = 16; s >= 0; s -= 8) {
      const av = (A >> s) & 255, bv = (B >> s) & 255;
      o += Math.round(av + (bv - av) * t).toString(16).padStart(2, '0');
    }
    return o;
  };
  const along = (n, fn) => {
    const a = [];
    for (let i = 0; i < n; i++) a.push(fn(i / (n - 1)));
    return a;
  };
  // Packed strokes, clipped. Fill() leaves sky showing between bristle rows.
  const hatch = (poly, color, gap, tilt, size, alpha) => {
    const ys = poly.map((p) => p[1]);
    let y0 = Math.min(...ys), y1 = Math.max(...ys);
    for (let y = y0 - 0.01, i = 0; y <= y1 + 0.02; y += gap, i++) {
      const row = [];
      for (let k = 0; k <= 5; k++) {
        const x = -0.02 + 1.04 * k / 5;
        row.push([x, y + tilt * (x - 0.4) + j(0.004), 0.95]);
      }
      if (i % 2) row.reverse();
      b.stroke(row, { color, size, alpha, dry: 0.06, speed: 2.5, clip: poly });
    }
  };

  // Wide arch. Snout and tail sink. The shoulder stays at the surface — no waist.
  function top(t) {
    const x = 0.068 + t * 0.68;
    const arch = Math.exp(-((t - 0.36) ** 2) / 0.045);
    const snoutDrop = Math.exp(-(t * t) / 0.02) * 0.06;
    const sink = Math.pow(Math.max(0, t - 0.45), 1.35) * 0.34;
    return [x, 0.4 - arch * 0.09 + snoutDrop + sink];
  }
  function gap(t) {
    const nose = Math.exp(-(t * t) / 0.0035);
    const belly = Math.sin(Math.PI * t) ** 0.8 * 0.25;
    const jaw = Math.exp(-((t - 0.16) ** 2) / 0.028) * 0.035;
    let g = (0.018 + belly + jaw) * (1 - nose * 0.82);
    if (t > 0.84) g *= Math.max(0.22, (1 - t) / 0.16);
    return g;
  }
  function whale(t, v) {
    const tt = Math.max(0, Math.min(1, t));
    const [x, y] = top(tt);
    const k = (Math.max(-1, Math.min(1, v)) + 1) / 2;
    return [x, y + gap(tt) * k];
  }

  const clip = [];
  {
    const a = top(0), g0 = gap(0);
    clip.push([a[0] - 0.012, a[1] + g0 * 0.5]);
    for (let i = 0; i <= 32; i++) clip.push(whale(i / 32, -1));
    for (let i = 32; i >= 0; i--) clip.push(whale(i / 32, 1));
  }

  const WL = 0.332;
  const ABYSS = '#0c1e22';
  const SEA = '#143238';
  const PALE = '#e5f1ed';
  const WET = '#8fadad';
  const INK = '#141210';
  const MOUTH = '#6e3e38';
  const DIRT = '#7a5340';
  const FOAM = '#e8f1ec';

  const skin = (v) => {
    if (v < -0.35) return mix(PALE, '#c5d8d4', (v + 1) / 0.65);
    if (v < 0.2) return mix('#7e9ea2', '#2c585c', (v + 0.35) / 0.55);
    return mix('#245258', '#14383e', (v - 0.2) / 0.8);
  };

  b.fill([[-0.06, -0.04], [1.06, -0.04], [1.06, 0.4], [-0.06, 0.4]], {
    color: '#74868a', size: 0.12, alpha: 0.97, dry: 0.26, tilt: 0.025, speed: 2.8,
  });
  b.fill([[-0.02, -0.02], [0.42, 0.0], [0.3, 0.15], [-0.02, 0.12]], {
    color: '#5a6c70', size: 0.08, alpha: 0.4, dry: 0.48, tilt: -0.06, speed: 2.6,
  });
  for (let i = 0; i < 4; i++) {
    const y = 0.03 + i * 0.05;
    b.stroke(along(5, t => [0.5 + t * 0.55, y + Math.sin(t * 5 + i) * 0.01, 0.65]), {
      color: i < 2 ? '#c3cfca' : '#a7b4b0', size: 0.04, alpha: 0.26, dry: 0.5, speed: 2.4,
    });
  }
  b.stroke(along(8, t => [t, 0.302 + Math.sin(t * 7) * 0.005, 0.55]), {
    color: '#d4cfc4', size: 0.026, alpha: 0.32, dry: 0.55, speed: 2.2,
  });

  b.fill([[-0.06, 0.3], [1.06, 0.3], [1.06, 1.06], [-0.06, 1.06]], {
    color: ABYSS, size: 0.14, alpha: 1, dry: 0.3, tilt: -0.01, speed: 2.7,
  });
  b.fill([[-0.06, 0.3], [1.06, 0.3], [1.06, 0.5], [-0.06, 0.5]], {
    color: '#1c4a4e', size: 0.065, alpha: 0.5, dry: 0.38, tilt: 0.018, speed: 2.5,
  });
  for (let i = 0; i < 7; i++) {
    const y = WL + 0.01 + i * 0.022;
    b.stroke(along(6, t => [t * 1.02 - 0.01, y + Math.sin(t * 12 + i) * 0.006, 0.6]), {
      color: i < 2 ? '#3a6e6a' : SEA, size: 0.024, alpha: 0.32, dry: 0.45, speed: 2.3,
    });
  }
  for (let i = 0; i < 5; i++) {
    const y = 0.62 + i * 0.07;
    b.stroke(along(5, t => [-0.02 + t * 1.04, y + Math.sin(t * 4 + i) * 0.012, 0.7]), {
      color: i % 2 ? '#0a191c' : '#16383c', size: 0.05, alpha: 0.28, dry: 0.62, speed: 2.5,
    });
  }

  b.pause(0.55);

  b.stroke(along(20, t => {
    const [x, y] = whale(t, -1);
    return [x, y, 0.35 + 0.95 * Math.sin(Math.PI * t) ** 0.65];
  }), { color: PALE, size: 0.022, alpha: 0.95, dry: 0.12, speed: 0.52 });

  b.pause(0.35);

  for (let k = 0; k < 14; k++) {
    const v = -0.98 + k * (1.92 / 13);
    const t0 = v > 0.45 ? 0.04 : 0;
    const t1 = Math.abs(v) < 0.3 ? 0.97 : v > 0.15 ? 0.9 : 0.95;
    b.stroke(along(14, u => {
      const t = t0 + (t1 - t0) * u;
      const [x, y] = whale(t, v);
      return [x, y + j(0.0035), 0.34 + 0.9 * Math.sin(Math.PI * u)];
    }), {
      color: skin(v), size: v < -0.4 ? 0.044 : 0.05,
      alpha: v > 0.5 ? 0.66 : 0.92,
      dry: 0.12 + Math.max(0, v) * 0.38, speed: 0.84, clip,
    });
  }
  for (let k = 0; k < 6; k++) {
    const v = -1 + k * 0.11;
    b.stroke(along(12, u => {
      const [x, y] = whale(0.02 + u * 0.72, v);
      return [x, y, 0.5 + 0.55 * Math.sin(Math.PI * u)];
    }), { color: k < 2 ? PALE : '#d7e8e4', size: 0.03, alpha: 0.72, dry: 0.08, speed: 1, clip });
  }
  for (const v of [-0.4, 0, 0.35]) {
    b.stroke(along(6, u => {
      const [x, y] = whale(0.74 + u * 0.26, v);
      return [x, y, 0.45 * (1 - u) + 0.3];
    }), { color: skin(v * 0.4), size: 0.018, alpha: 0.85, dry: 0.28, speed: 1, clip });
  }
  b.stroke(along(8, u => {
    const [x, y] = whale(0.05 + u * 0.2, 0.5);
    return [x, y, 0.55];
  }), { color: '#1a2e30', size: 0.018, alpha: 0.4, dry: 0.3, speed: 0.9, clip });

  // The berg sits on the right of the shoulder, so the blow has open sky.
  const ice = [
    [0.46, 0.1],
    [0.56, 0.16],
    [0.6, 0.24],
    [0.55, 0.29],
    [0.58, 0.338],
    [0.4, 0.352],
    [0.3, 0.336],
    [0.28, 0.24],
    [0.34, 0.15],
    [0.4, 0.11],
  ];
  const iceShade = [
    [0.48, 0.12],
    [0.56, 0.16],
    [0.6, 0.24],
    [0.55, 0.29],
    [0.58, 0.338],
    [0.46, 0.34],
    [0.5, 0.2],
  ];
  hatch(ice, '#d2e3df', 0.013, -0.18, 0.042, 1);
  hatch(ice, '#eef6f3', 0.016, 0.22, 0.03, 0.75);
  hatch(iceShade, '#3e646c', 0.015, 0.4, 0.04, 0.62);

  // Ragged fringe so the clip edge is not a cutout. Skip the base — that joins the animal.
  for (let i = 0; i < ice.length - 1; i++) {
    if (i >= 4 && i <= 6) continue;
    const a = ice[i], c = ice[i + 1];
    const mx = (a[0] + c[0]) / 2 + j(0.008), my = (a[1] + c[1]) / 2 - 0.008;
    b.stroke([[a[0], a[1], 0.4], [mx, my, 0.8], [c[0], c[1], 0.35]], {
      color: '#f4faf8', size: 0.018, alpha: 0.55, dry: 0.78, speed: 1.3, smooth: false,
    });
  }
  b.stroke([[0.42, 0.14], [0.38, 0.2], [0.36, 0.27]], {
    color: '#f7fbfa', size: 0.014, alpha: 0.8, dry: 0.15, speed: 0.7, smooth: false,
  });
  b.stroke([[0.36, 0.17], [0.44, 0.16], [0.52, 0.175], [0.57, 0.16]], {
    color: DIRT, size: 0.02, alpha: 0.88, dry: 0.32, speed: 0.7, smooth: false,
  });
  b.stroke([[0.5, 0.14], [0.47, 0.2]], {
    color: '#1c383e', size: 0.008, alpha: 0.55, dry: 0.65, speed: 0.8, smooth: false,
  });
  for (const [x, y] of [[0.36, 0.17], [0.42, 0.13], [0.33, 0.22]]) {
    b.stroke([[x, y], [x + 0.018, y + 0.005], [x + 0.01, y + 0.012]], {
      color: '#f5faf8', size: 0.024, alpha: 0.88, dry: 0.05, speed: 0.8, smooth: false,
    });
  }
  // The foot keeps going and becomes the back.
  for (let k = 0; k < 6; k++) {
    const t = 0.34 + k * 0.035;
    const [x, y] = whale(t, -0.55);
    b.stroke([[x + j(0.006), 0.33, 0.7], [x, (0.33 + y) / 2, 0.9], [x + j(0.008), y, 0.4]], {
      color: k < 3 ? PALE : '#c9ddd8', size: 0.024, alpha: 0.62, dry: 0.35, speed: 0.95,
    });
  }

  b.stroke(along(5, t => [t * 0.2, WL + Math.sin(t * 8) * 0.003, 0.6]), {
    color: '#071214', size: 0.015, alpha: 0.85, dry: 0.25, speed: 1.4,
  });
  b.stroke(along(7, t => [0.62 + t * 0.4, WL + Math.sin(t * 9) * 0.004, 0.55]), {
    color: '#071214', size: 0.014, alpha: 0.8, dry: 0.3, speed: 1.5,
  });
  for (const x of [0.26, 0.6]) {
    b.stroke([[x, WL - 0.003], [x + 0.016, WL + 0.004], [x + 0.008, WL + 0.008]], {
      color: FOAM, size: 0.012, alpha: 0.75, dry: 0.65, speed: 1.2, smooth: false,
    });
  }

  for (let i = 0; i < 7; i++) {
    const y = 0.66 + i * 0.048;
    b.stroke(along(5, t => [-0.02 + t * 1.04, y + Math.sin(t * 6 + i) * 0.008, 0.6]), {
      color: ABYSS, size: 0.038, alpha: 0.07 + i * 0.028, dry: 0.48, speed: 2.4,
    });
  }

  b.stroke(along(8, u => {
    const [x, y] = whale(0.03 + u * 0.2, 0.32);
    return [x, y + u * 0.018, 0.5];
  }), { color: MOUTH, size: 0.012, alpha: 0.92, dry: 0.18, speed: 0.62, clip });
  for (let p = 0; p < 5; p++) {
    const v = 0.45 + p * 0.1;
    b.stroke(along(8, u => {
      const [x, y] = whale(0.06 + u * 0.4, v);
      return [x, y, 0.35 + 0.3 * Math.sin(u * Math.PI)];
    }), { color: p % 2 ? '#10282c' : '#1c383c', size: 0.008, alpha: 0.48, dry: 0.58, speed: 1.1, clip });
  }

  for (let i = 0; i < 6; i++) {
    const [x, y] = whale(0.025 + i * 0.03, -0.78);
    b.stroke([[x, y], [x + 0.01, y - 0.006]], {
      color: i % 2 ? PALE : WET, size: 0.014, alpha: 0.85, dry: 0.2, speed: 1.4, smooth: false,
    });
  }

  const fin = (s, side) => {
    const cx = 0.25 + s * 0.02 - Math.sin(s * Math.PI) * 0.028;
    const cy = 0.46 + s * 0.42;
    const w = Math.sin(Math.PI * s) ** 0.55 * 0.03 + 0.02 * (1 - s * 0.75);
    return [cx + side * w * 0.85, cy + side * w * 0.06];
  };
  const finPoly = [];
  for (let i = 0; i <= 10; i++) finPoly.push(fin(i / 10, 1));
  for (let i = 10; i >= 0; i--) finPoly.push(fin(i / 10, -1));
  hatch(finPoly, '#d7e7e3', 0.012, 0.55, 0.028, 0.95);
  for (let k = 0; k < 4; k++) {
    const side = -0.6 + k * 0.4;
    b.stroke(along(6, s => {
      const p = fin(0.05 + s * 0.9, side);
      return [p[0], p[1], 0.45 + 0.6 * Math.sin(Math.PI * s)];
    }), { color: side < 0 ? '#f4faf8' : '#6e9094', size: 0.014, alpha: 0.65, dry: 0.22, speed: 0.85 });
  }
  b.stroke(along(6, s => {
    const p = fin(s * 0.28, 0.1);
    return [p[0], p[1] - 0.01, 0.85];
  }), { color: '#5d8488', size: 0.028, alpha: 0.5, dry: 0.2, speed: 0.9 });
  b.stroke(along(6, s => {
    const p = fin(0.25 + s * 0.65, 0.75);
    return [p[0], p[1], 0.5];
  }), { color: '#2f555a', size: 0.014, alpha: 0.35, dry: 0.3, speed: 0.9 });

  const ped = whale(0.99, 0);
  const flukeEdge = (s) => {
    const notch = Math.exp(-((s - 0.5) ** 2) / 0.014) * 0.022;
    const bow = Math.sin(s * Math.PI) * 0.008;
    return [0.968 - notch + bow, ped[1] - 0.155 + s * 0.31];
  };
  const flukePoly = [[ped[0] - 0.01, ped[1]]];
  for (let i = 0; i <= 14; i++) flukePoly.push(flukeEdge(i / 14));
  hatch(flukePoly, '#c5d8d4', 0.012, 0.08, 0.03, 1);
  hatch(flukePoly, '#e7f2ee', 0.016, -0.2, 0.02, 0.55);
  for (let i = 0; i <= 4; i++) {
    const s = i / 4;
    const e = flukeEdge(s);
    b.stroke([
      [ped[0], ped[1], 0.45],
      [(ped[0] + e[0]) / 2, (ped[1] + e[1]) / 2, 0.8],
      [e[0] - 0.012, e[1], 0.3],
    ], { color: s < 0.4 ? PALE : s > 0.75 ? '#3e686c' : WET, size: 0.016, alpha: 0.6, dry: 0.2, speed: 0.85 });
  }
  b.stroke(along(12, s => {
    const e = flukeEdge(s);
    return [e[0], e[1], 0.55];
  }), { color: '#16383c', size: 0.008, alpha: 0.35, dry: 0.45, speed: 0.7 });
  b.stroke(along(5, s => {
    const e = flukeEdge(0.55 + s * 0.4);
    return [(ped[0] + e[0]) / 2, (ped[1] + e[1]) / 2 + 0.01, 0.6];
  }), { color: '#3a6066', size: 0.02, alpha: 0.4, dry: 0.3, speed: 0.9 });

  for (const [t0, len, dv] of [[0.22, 0.05, -0.72], [0.4, 0.04, -0.8], [0.52, 0.035, -0.7]]) {
    b.stroke(along(3, u => {
      const [x, y] = whale(t0 + u * len, dv);
      return [x, y, 0.4];
    }), { color: '#f4f8f6', size: 0.006, alpha: 0.55, dry: 0.8, speed: 1.2, clip });
  }

  b.pause(1.4);

  const bh = whale(0.27, -1);
  b.stroke([[bh[0] - 0.01, bh[1] + 0.002], [bh[0] + 0.012, bh[1] - 0.004]], {
    color: INK, size: 0.009, alpha: 0.8, dry: 0.1, speed: 0.65, smooth: false,
  });
  for (let k = 0; k < 8; k++) {
    const spread = (k - 3.5) * 0.008;
    b.stroke(along(6, u => [
      bh[0] - 0.01 + spread * u + Math.sin(u * 2 + k) * 0.006,
      Math.min(bh[1], WL) - 0.012 - u * (0.16 + (k % 3) * 0.02),
      0.45 + u * 0.35,
    ]), {
      color: '#f3f7f4', size: 0.026, alpha: Math.max(0.12, 0.72 - k * 0.07), dry: 0.7, speed: 0.55,
    });
  }

  b.pause(2);

  const eye = whale(0.13, -0.18);
  b.stroke(along(5, u => [eye[0] - 0.02 + u * 0.046, eye[1] + Math.sin(u * Math.PI) * 0.005, 0.7]), {
    color: '#dceae6', size: 0.028, alpha: 0.92, dry: 0.06, speed: 0.52,
  });
  b.stroke([[eye[0] - 0.018, eye[1] + 0.002], [eye[0] - 0.002, eye[1] - 0.01], [eye[0] + 0.022, eye[1]]], {
    color: INK, size: 0.01, alpha: 0.95, dry: 0.08, speed: 0.5, smooth: false,
  });
  b.stroke([[eye[0] - 0.014, eye[1] + 0.004], [eye[0] + 0.002, eye[1] + 0.012], [eye[0] + 0.018, eye[1] + 0.006]], {
    color: '#2a211c', size: 0.008, alpha: 0.7, dry: 0.12, speed: 0.52, smooth: false,
  });
  b.stroke([[eye[0] - 0.005, eye[1]], [eye[0] + 0.009, eye[1] + 0.002]], {
    color: INK, size: 0.018, alpha: 1, dry: 0, speed: 0.5, smooth: false,
  });

  b.stroke(along(10, t => {
    const [x, y] = whale(0.05 + t * 0.5, -0.96);
    return [x, y, 0.35 + 0.4 * Math.sin(Math.PI * t)];
  }), { color: '#f5faf8', size: 0.01, alpha: 0.7, dry: 0.3, speed: 0.58 });

  b.stroke([[eye[0] - 0.003, eye[1] - 0.003], [eye[0] + 0.001, eye[1] - 0.001]], {
    color: '#f4efe4', size: 0.009, alpha: 1, dry: 0, speed: 0.5, smooth: false,
  });
}
