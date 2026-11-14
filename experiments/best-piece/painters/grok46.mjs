// Actias — a luna moth crosses the moon. Tails last.
export default function (b) {
  const R = () => b.rng();
  const j = (a = 0.01) => (R() - 0.5) * a;

  const C = {
    void: '#0e121c',
    night: '#171e32',
    dusk: '#26344c',
    haze: '#4a5870',
    moon: '#e8dcb8',
    moon2: '#d2c49a',
    crater: '#b8aa86',
    glow: '#d4c8a4',
    wing: '#a6be6e',
    wingL: '#c6d690',
    wingD: '#6a8e54',
    wingY: '#c8cc7a',
    vein: '#5a7642',
    costa: '#6a2c3c',
    costaL: '#8a4858',
    lilac: '#b0909c',
    body: '#f0eadc',
    fur: '#f6f2ea',
    warm: '#deceb2',
    ant: '#c49a52',
    antD: '#8a6a34',
    spot: '#d4c888',
    spotR: '#5a4030',
    spotD: '#241810',
    star: '#e8e0cc',
  };

  const ring = (cx, cy, rx, ry, n = 16) => {
    const p = [];
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n;
      p.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
    }
    return p;
  };

  const catmull = (anchors, n = 6, loop = true) => {
    const pts = [], N = anchors.length;
    const P = i => (loop
      ? anchors[(i + N) % N]
      : anchors[Math.max(0, Math.min(N - 1, i))]);
    const last = loop ? N : N - 1;
    for (let i = 0; i < last; i++) {
      for (let k = 0; k < n; k++) {
        const t = k / n, a = P(i - 1), b = P(i), c = P(i + 1), d = P(i + 2);
        pts.push([0, 1].map(m =>
          0.5 * (2 * b[m] + (-a[m] + c[m]) * t
            + (2 * a[m] - 5 * b[m] + 4 * c[m] - d[m]) * t * t
            + (-a[m] + 3 * b[m] - 3 * c[m] + d[m]) * t * t * t)));
      }
    }
    if (!loop) pts.push(anchors[N - 1]);
    return pts;
  };

  const bez = (p0, p1, p2, n, press) => {
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, u = 1 - t;
      pts.push([
        u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
        u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
        press ? press(t) : 1,
      ]);
    }
    return pts;
  };

  const edge = (anchors, o) => {
    const pts = catmull(anchors, 5, false);
    b.stroke(pts.map((p, i, a) => [
      p[0], p[1], i === 0 || i === a.length - 1 ? 0.25 : 0.95,
    ]), o);
  };

  // —— 1. night: clipped fill covers the paper, then a few long strokes ——
  const full = [[-0.1, -0.1], [1.1, -0.1], [1.1, 1.1], [-0.1, 1.1]];
  b.fill(full, { color: C.void, size: 0.15, alpha: 0.97, dry: 0.08, tilt: 0.02, speed: 2.95 });
  for (let i = 0; i < 6; i++) {
    const y = 0.06 + i * 0.16;
    b.stroke([
      [-0.4, y + j(0.03), 1.2],
      [0.5, y + j(0.04), 1.0],
      [1.4, y + j(0.03), 1.15],
    ], { color: C.dusk, size: 0.13, alpha: 0.22, dry: 0.35, speed: 2.95 });
  }
  b.pause(0.08);

  // —— 2. moon: a disc, not a fingerprint ——
  const mx = 0.23, my = 0.19, mr = 0.175;
  b.stroke([
    [mx - 0.26, my + 0.02, 0.7], [mx, my - 0.04, 1.1], [mx + 0.24, my + 0.02, 0.7],
  ], { color: C.haze, size: 0.15, alpha: 0.28, dry: 0.55, speed: 2.2 });
  b.stroke([
    [mx - 0.18, my - 0.02, 0.6], [mx, my + 0.02, 1], [mx + 0.16, my - 0.01, 0.5],
  ], { color: C.glow, size: 0.12, alpha: 0.22, dry: 0.6, speed: 2.1 });
  b.fill(ring(mx, my, mr, mr, 22), {
    color: C.moon, size: 0.075, alpha: 0.88, dry: 0.18, tilt: 0.04, speed: 2.4,
  });
  b.fill(ring(mx + 0.04, my + 0.015, mr * 0.68, mr * 0.74, 16), {
    color: C.moon2, size: 0.055, alpha: 0.38, dry: 0.4, tilt: 0.1, speed: 2.3,
  });
  // round the rim
  b.stroke(ring(mx, my, mr * 0.92, mr * 0.92, 20).concat([ring(mx, my, mr * 0.92, mr * 0.92, 20)[0]])
    .map((p, i, a) => [p[0], p[1], i === 0 || i === a.length - 1 ? 0.35 : 0.9]), {
    color: C.moon, size: 0.03, alpha: 0.55, dry: 0.35, speed: 1.6,
  });
  b.stroke([[mx - 0.07, my - 0.05, 0.55], [mx - 0.02, my - 0.08, 0.8], [mx + 0.04, my - 0.04, 0.4]], {
    color: C.crater, size: 0.026, alpha: 0.3, dry: 0.7, speed: 1.3,
  });
  b.stroke([[mx - 0.05, my + 0.05, 0.45], [mx, my + 0.07, 0.7], [mx + 0.04, my + 0.04, 0.3]], {
    color: C.crater, size: 0.02, alpha: 0.25, dry: 0.72, speed: 1.3,
  });
  b.pause(0.14);

  // —— 3. hindwings (behind) ——
  const LHanc = [
    [0.47, 0.39], [0.36, 0.41], [0.24, 0.49], [0.15, 0.60],
    [0.12, 0.70], [0.16, 0.78], [0.28, 0.81], [0.40, 0.74],
    [0.47, 0.60], [0.48, 0.46],
  ];
  const RHanc = [
    [0.53, 0.38], [0.66, 0.39], [0.78, 0.47], [0.87, 0.58],
    [0.89, 0.68], [0.84, 0.78], [0.72, 0.81], [0.60, 0.74],
    [0.53, 0.60], [0.52, 0.46],
  ];
  b.fill(catmull(LHanc, 5, true), { color: C.wingL, size: 0.075, alpha: 0.86, dry: 0.26, tilt: 0.18, speed: 2.5 });
  b.fill(catmull(RHanc, 5, true), { color: C.wing, size: 0.075, alpha: 0.88, dry: 0.26, tilt: -0.14, speed: 2.5 });

  // —— 4. forewings, more swept, left one veils the moon ——
  const LFanc = [
    [0.47, 0.24], [0.36, 0.14], [0.22, 0.08], [0.10, 0.07],
    [0.03, 0.12], [0.02, 0.20], [0.05, 0.28], [0.12, 0.34],
    [0.24, 0.37], [0.36, 0.34], [0.44, 0.30], [0.48, 0.26],
  ];
  const RFanc = [
    [0.53, 0.23], [0.66, 0.13], [0.80, 0.08], [0.92, 0.08],
    [0.98, 0.14], [0.99, 0.22], [0.96, 0.30], [0.88, 0.36],
    [0.76, 0.38], [0.64, 0.35], [0.55, 0.30], [0.52, 0.26],
  ];
  b.fill(catmull(LFanc, 5, true), { color: C.wing, size: 0.075, alpha: 0.68, dry: 0.3, tilt: -0.22, speed: 2.5 });
  b.fill(catmull(RFanc, 5, true), { color: C.wing, size: 0.075, alpha: 0.86, dry: 0.26, tilt: 0.16, speed: 2.5 });
  b.stroke([[0.36, 0.18, 0.5], [0.22, 0.16, 0.7], [0.10, 0.20, 0.4]], {
    color: C.wingL, size: 0.04, alpha: 0.28, dry: 0.55, speed: 2.2,
  });
  b.stroke([[0.70, 0.28, 0.5], [0.84, 0.30, 0.7], [0.94, 0.26, 0.35]], {
    color: C.wingD, size: 0.04, alpha: 0.22, dry: 0.55, speed: 2.2,
  });

  // lilac at the roots
  b.stroke([[0.45, 0.33, 0.7], [0.40, 0.41, 1], [0.45, 0.50, 0.5]], {
    color: C.lilac, size: 0.036, alpha: 0.3, dry: 0.5, speed: 1.5,
  });
  b.stroke([[0.55, 0.33, 0.7], [0.62, 0.41, 1], [0.55, 0.50, 0.5]], {
    color: C.lilac, size: 0.036, alpha: 0.28, dry: 0.5, speed: 1.5,
  });

  // —— 5. body now, so the moth is a moth before the details ——
  const tx = 0.50, ty = 0.36;
  b.fill(ring(tx, ty + 0.04, 0.038, 0.12, 16), {
    color: C.warm, size: 0.045, alpha: 0.88, dry: 0.24, tilt: 0.08, speed: 2.3,
  });
  b.fill(ring(tx, ty, 0.05, 0.062, 12), {
    color: C.body, size: 0.04, alpha: 0.9, dry: 0.22, speed: 2.2,
  });
  for (let i = 0; i < 7; i++) {
    const t = i / 6;
    const y = 0.42 + t * 0.16;
    const w = 0.036 * (1 - t * 0.5);
    b.stroke([
      [tx - w, y + j(0.006), 0.75],
      [tx + 0.004, y + 0.004 + j(0.005), 1.1],
      [tx + w * 0.9, y + 0.006 + j(0.006), 0.6],
    ], { color: i % 2 ? C.lilac : C.fur, size: 0.022, alpha: 0.5, dry: 0.38, speed: 1.7 });
  }
  for (let i = 0; i < 18; i++) {
    const a = R() * Math.PI * 2;
    const r = 0.016 + R() * 0.042;
    b.stroke([
      [tx + j(0.012), ty + j(0.014), 0.85],
      [tx + Math.cos(a) * r, ty + Math.sin(a) * r * 1.05, 0.22],
    ], {
      color: R() > 0.4 ? C.fur : C.warm,
      size: 0.012 + R() * 0.008,
      alpha: 0.4 + R() * 0.35,
      dry: 0.55, speed: 2.3,
    });
  }
  b.stroke([[0.468, 0.278, 0.7], [0.490, 0.255, 1.2], [0.514, 0.278, 0.7]], {
    color: C.fur, size: 0.032, alpha: 0.9, dry: 0.24, speed: 1.3,
  });
  b.stroke([[0.470, 0.268, 0.5], [0.490, 0.248, 0.85], [0.512, 0.266, 0.5]], {
    color: C.warm, size: 0.018, alpha: 0.7, dry: 0.35, speed: 1.4,
  });
  b.stroke([[0.476, 0.274, 0.8], [0.484, 0.270, 1.05], [0.492, 0.280, 0.55]], {
    color: C.spotD, size: 0.013, alpha: 0.9, dry: 0.16, speed: 1.8,
  });
  b.stroke([[0.478, 0.270, 0.4], [0.482, 0.266, 0.65]], {
    color: C.ant, size: 0.006, alpha: 0.7, dry: 0.3, speed: 2,
  });

  // —— 6. margins, so the clip reads as a curve ——
  edge(LFanc.concat([LFanc[0]]), { color: C.wingD, size: 0.02, alpha: 0.5, dry: 0.4, speed: 1.2 });
  edge(RFanc.concat([RFanc[0]]), { color: C.wingD, size: 0.02, alpha: 0.55, dry: 0.4, speed: 1.2 });
  edge(LHanc.concat([LHanc[0]]), { color: C.wingD, size: 0.02, alpha: 0.48, dry: 0.42, speed: 1.2 });
  edge(RHanc.concat([RHanc[0]]), { color: C.wingD, size: 0.02, alpha: 0.48, dry: 0.42, speed: 1.2 });

  // —— 7. veins ——
  const vein = (pts, size = 0.012) =>
    b.stroke(pts, { color: C.vein, size, alpha: 0.4, dry: 0.62, speed: 1.3 });
  vein([[0.46, 0.27, 0.85], [0.28, 0.14, 0.55], [0.10, 0.10, 0.22]], 0.015);
  vein([[0.46, 0.29, 0.75], [0.26, 0.22, 0.5], [0.08, 0.20, 0.2]]);
  vein([[0.45, 0.32, 0.7], [0.24, 0.30, 0.48], [0.06, 0.28, 0.18]]);
  vein([[0.44, 0.34, 0.6], [0.24, 0.35, 0.42], [0.12, 0.34, 0.18]]);
  vein([[0.54, 0.26, 0.85], [0.74, 0.13, 0.55], [0.92, 0.10, 0.22]], 0.015);
  vein([[0.54, 0.29, 0.75], [0.76, 0.21, 0.5], [0.94, 0.20, 0.2]]);
  vein([[0.55, 0.32, 0.7], [0.78, 0.30, 0.48], [0.96, 0.28, 0.18]]);
  vein([[0.56, 0.34, 0.6], [0.78, 0.35, 0.42], [0.90, 0.34, 0.18]]);
  vein([[0.46, 0.44, 0.7], [0.30, 0.56, 0.5], [0.20, 0.70, 0.35]], 0.013);
  vein([[0.54, 0.44, 0.7], [0.72, 0.54, 0.5], [0.82, 0.70, 0.35]], 0.013);

  const grain = (x, y, dx, dy, n, col) => {
    for (let i = 0; i < n; i++) {
      const t = (i + 0.35) / n;
      const px = x + dx * t + j(0.032);
      const py = y + dy * t + j(0.028);
      b.stroke([
        [px, py, 0.4],
        [px + dx * 0.04 + j(0.01), py + dy * 0.04 + j(0.01), 0.75],
      ], { color: col, size: 0.015, alpha: 0.15 + R() * 0.16, dry: 0.78, speed: 2.7 });
    }
  };
  grain(0.40, 0.18, -0.28, -0.05, 7, C.wingL);
  grain(0.36, 0.26, -0.24, 0.06, 6, C.wingY);
  grain(0.62, 0.16, 0.28, -0.04, 7, C.wingL);
  grain(0.64, 0.26, 0.24, 0.07, 6, C.wingD);
  grain(0.32, 0.52, -0.12, 0.2, 6, C.wingD);
  grain(0.68, 0.50, 0.12, 0.2, 6, C.wingL);

  // —— 8. burgundy costa ——
  b.stroke([
    [0.46, 0.232, 0.3], [0.32, 0.11, 1.15], [0.16, 0.07, 1.2], [0.05, 0.11, 0.75], [0.02, 0.18, 0.28],
  ], { color: C.costa, size: 0.024, alpha: 0.88, dry: 0.28, speed: 0.88 });
  b.stroke([[0.44, 0.24, 0.25], [0.30, 0.125, 0.75], [0.14, 0.09, 0.55]], {
    color: C.costaL, size: 0.011, alpha: 0.5, dry: 0.42, speed: 1.15,
  });
  b.stroke([
    [0.54, 0.225, 0.3], [0.70, 0.10, 1.15], [0.86, 0.07, 1.2], [0.96, 0.12, 0.75], [0.99, 0.20, 0.28],
  ], { color: C.costa, size: 0.024, alpha: 0.88, dry: 0.28, speed: 0.88 });
  b.stroke([[0.56, 0.235, 0.25], [0.72, 0.115, 0.75], [0.88, 0.09, 0.55]], {
    color: C.costaL, size: 0.011, alpha: 0.5, dry: 0.42, speed: 1.15,
  });

  // —— 9. THE TAILS — the long note, after the moth has a body ——
  // attach at the outer-lower corner of each hindwing
  b.stroke(bez([0.16, 0.76], [0.06, 0.88], [0.13, 0.99], 8, t => 1.25 - t * 0.9), {
    color: C.wingD, size: 0.046, alpha: 0.9, dry: 0.26, speed: 0.5,
  });
  b.stroke(bez([0.18, 0.75], [0.10, 0.86], [0.15, 0.975], 7, t => 1.0 - t * 0.7), {
    color: C.wingL, size: 0.028, alpha: 0.78, dry: 0.38, speed: 0.55,
  });
  b.stroke([[0.125, 0.945, 0.45], [0.10, 0.99, 1.1], [0.17, 0.995, 0.85], [0.19, 0.955, 0.28]], {
    color: C.wing, size: 0.03, alpha: 0.82, dry: 0.32, speed: 0.68,
  });

  b.stroke(bez([0.84, 0.76], [0.96, 0.86], [0.89, 0.995], 8, t => 1.3 - t * 0.95), {
    color: C.wingD, size: 0.048, alpha: 0.92, dry: 0.24, speed: 0.46,
  });
  b.stroke(bez([0.82, 0.75], [0.92, 0.85], [0.87, 0.98], 7, t => 1.05 - t * 0.75), {
    color: C.wingL, size: 0.03, alpha: 0.8, dry: 0.36, speed: 0.52,
  });
  b.stroke([[0.875, 0.95, 0.45], [0.85, 0.995, 1.15], [0.93, 0.998, 0.9], [0.94, 0.958, 0.28]], {
    color: C.wing, size: 0.032, alpha: 0.84, dry: 0.3, speed: 0.62,
  });
  // veins running into the tails
  vein([[0.28, 0.70, 0.5], [0.20, 0.80, 0.35], [0.14, 0.92, 0.15]], 0.012);
  vein([[0.72, 0.70, 0.5], [0.82, 0.80, 0.35], [0.88, 0.92, 0.15]], 0.012);
  b.pause(0.06);

  // —— 10. eyespots: a round mark, then a dark comma ——
  const spot = (cx, cy, r) => {
    b.fill(ring(cx, cy, r * 1.05, r * 0.9, 12), {
      color: C.spot, size: Math.max(0.028, r * 1.1), alpha: 0.84, dry: 0.2, speed: 2.2,
    });
    b.stroke([
      [cx - r * 0.5, cy - r * 0.1, 0.45],
      [cx - r * 0.1, cy - r * 0.48, 1],
      [cx + r * 0.45, cy - r * 0.08, 0.4],
    ], { color: C.spotR, size: r * 0.5, alpha: 0.88, dry: 0.28, speed: 1.4 });
    b.stroke([[cx - r * 0.08, cy + r * 0.02, 0.55], [cx + r * 0.16, cy + r * 0.14, 0.75]], {
      color: C.spotD, size: r * 0.2, alpha: 0.75, dry: 0.22, speed: 1.9,
    });
  };
  spot(0.20, 0.22, 0.038);
  spot(0.80, 0.21, 0.04);
  spot(0.25, 0.61, 0.05);
  spot(0.76, 0.60, 0.052);

  // —— 11. antennae, reaching for the moon ——
  const antenna = (p0, p1, p2, side) => {
    b.stroke(bez(p0, p1, p2, 8, t => 0.95 - t * 0.65), {
      color: C.antD, size: 0.013, alpha: 0.92, dry: 0.28, speed: 0.72,
    });
    b.stroke(bez(p0, p1, p2, 7, t => 0.55 - t * 0.35), {
      color: C.ant, size: 0.007, alpha: 0.7, dry: 0.4, speed: 0.85,
    });
    for (let i = 1; i <= 10; i++) {
      const t = i / 11, u = 1 - t;
      const x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0];
      const y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1];
      const dx = 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
      const dy = 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len, ny = dx / len;
      const barb = (0.03 - t * 0.02) * side;
      b.stroke([[x, y, 0.5], [x + nx * barb + j(0.005), y + ny * barb + j(0.005), 0.22]], {
        color: C.ant, size: 0.007, alpha: 0.58, dry: 0.52, speed: 2.4,
      });
      b.stroke([[x, y, 0.4], [x - nx * barb * 0.65 + j(0.005), y - ny * barb * 0.65 + j(0.005), 0.18]], {
        color: C.antD, size: 0.006, alpha: 0.4, dry: 0.58, speed: 2.4,
      });
    }
  };
  antenna([0.452, 0.242], [0.33, 0.11], [0.16, 0.03], 1);
  antenna([0.508, 0.238], [0.62, 0.10], [0.76, 0.025], -1);

  b.stroke([[0.46, 0.40, 0.55], [0.40, 0.48, 0.38], [0.37, 0.55, 0.16]], {
    color: C.antD, size: 0.011, alpha: 0.48, dry: 0.5, speed: 1.5,
  });
  b.stroke([[0.47, 0.43, 0.45], [0.43, 0.52, 0.28], [0.41, 0.58, 0.12]], {
    color: C.antD, size: 0.01, alpha: 0.38, dry: 0.55, speed: 1.5,
  });
  b.stroke([[0.55, 0.40, 0.55], [0.62, 0.48, 0.38], [0.66, 0.54, 0.16]], {
    color: C.antD, size: 0.011, alpha: 0.45, dry: 0.5, speed: 1.5,
  });

  // —— 12. moonlight through the left wing, lost edges, stars ——
  b.stroke([[0.14, 0.12, 0.3], [0.22, 0.17, 0.7], [0.30, 0.14, 0.35]], {
    color: C.glow, size: 0.048, alpha: 0.2, dry: 0.7, speed: 1.15,
  });
  b.stroke([[0.12, 0.18, 0.22], [0.21, 0.21, 0.5], [0.28, 0.18, 0.22]], {
    color: C.moon, size: 0.03, alpha: 0.14, dry: 0.75, speed: 1.2,
  });
  b.stroke([[0.01, 0.22, 0.45], [0.04, 0.32, 0.65], [0.12, 0.37, 0.25]], {
    color: C.night, size: 0.028, alpha: 0.3, dry: 0.6, speed: 1.4,
  });
  b.stroke([[0.99, 0.24, 0.45], [0.95, 0.34, 0.65], [0.86, 0.38, 0.25]], {
    color: C.night, size: 0.028, alpha: 0.32, dry: 0.6, speed: 1.4,
  });

  for (const [x, y] of [
    [0.07, 0.50], [0.11, 0.86], [0.40, 0.05], [0.63, 0.04],
    [0.91, 0.48], [0.95, 0.72], [0.04, 0.70], [0.48, 0.93],
    [0.70, 0.91], [0.97, 0.07], [0.35, 0.90], [0.85, 0.88],
  ]) {
    const s = 0.007 + R() * 0.007;
    b.stroke([[x - s, y, 0.35], [x, y, 1], [x + s * 0.8, y + j(0.004), 0.25]], {
      color: C.star, size: 0.009 + R() * 0.005, alpha: 0.32 + R() * 0.4, dry: 0.42, speed: 2.5,
    });
  }

  b.stroke([[0.52, 0.46, 0.35], [0.535, 0.54, 0.65], [0.52, 0.63, 0.22]], {
    color: C.fur, size: 0.012, alpha: 0.42, dry: 0.5, speed: 1.2,
  });
  b.stroke([[0.84, 0.74, 0.28], [0.92, 0.84, 0.55], [0.90, 0.95, 0.2]], {
    color: C.wingL, size: 0.016, alpha: 0.4, dry: 0.5, speed: 0.85,
  });
}
