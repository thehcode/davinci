You are painting one piece for a side-by-side video. Four AI models each paint on
their own canvas, live, and viewers watch every stroke appear. Make your best,
most creative painting. Pick your own subject. Avoid the obvious (sunsets, a lone
tree, flowers in a vase) unless you do something no one expects with it.

Write ONE file: painters/NAME.mjs
Edit no other file. Do not read the other files in painters/.

  export default function (b) { ... }

The canvas is square. Coordinates are 0..1, with (0,0) at the top left.
Strokes play back in the order you write them, so the ORDER is the performance:
viewers watch the piece being built. Total paint time is scaled to ~24 s, and a long
stroke takes longer than a short one. In the final video your canvas is about
410 px wide, so read clearly at that size.

Brush API (every call is chainable):
  b.color('#rrggbb')  b.size(0.01..0.15)  b.alpha(0..1)  b.speed(0.5..3)
  b.stroke([[x,y,pressure?], ...], {color,size,alpha,speed,dry,smooth})
     A bristle brush with 6-44 hairs, shade variation and tapered ends.
     The points are smoothed. pressure 0..1.5 sets the width along the path.
     dry 0..1: how fast the brush runs out of paint and breaks into streaks.
  b.fill([[x,y], ...], {color,size,alpha,dry,tilt,speed})
     Polygon covered with broad back-and-forth strokes, not a flat fill.
  b.pause(seconds)
  b.rng()  seeded random number in 0..1. Use it, never Math.random.
The engine source is davinci.src.html
and the builder is render.mjs next to it. Read them if you want.

Think like a painter: block in the large shapes, then build up mid-tones and
direction of strokes, then finish with highlights and accents. Brush direction
carries form. Choose a limited, deliberate palette. 150-600 ops is a good range.

To look at your work, run this from the repo root:
  node render.mjs --solo NAME --still 8,16,25
and open the PNGs in work/NAME/stills/ (t25.00.png is the finished piece).
Look at it, judge it honestly, and revise at least twice before you stop.
Return: the title of the piece, one line on the idea, and the file path.
