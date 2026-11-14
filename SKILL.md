---
name: davinci
description: Run a painting match between AI models. Each model writes a script of bristle-brush strokes; the engine replays every canvas side by side with a label and renders a looping 1920x1080 60fps mp4 + webm. Use when asked to have agents or models paint, compare models visually, or make an "AI vs AI painting" video.
---

# davinci

Agents paint by writing code, not by moving a mouse. Each painter is one file of
stroke commands. The engine replays all painters side by side, deterministically,
so any frame can be rendered at any time and the video loops cleanly.

## Files

| Path | What it is |
|---|---|
| `painters/<name>.mjs` | One painter. `export default function (b) { ... }` |
| `scene.json` | Timing, paper colour, and the list of painters with labels |
| `prompt.md` | The task given to each model. Replace `NAME` with the painter name |
| `davinci.src.html` | Replay engine (Canvas 2D, bristle brush, canvas grain) |
| `render.mjs` | Builds `out/davinci.html` and renders the video |

## Setup

```
npm install
npx playwright install chromium
```
ffmpeg must be on PATH.

## Brush API

The canvas is square. Coordinates are 0..1, with (0,0) at the top left. Strokes play
back in the order they are written. Each painter's total time is scaled to fit
the paint window, so every painter finishes at the same moment.

```
b.color('#rrggbb')  b.size(0.01..0.15)  b.alpha(0..1)  b.speed(0.5..3)
b.stroke([[x,y,pressure?], ...], {color,size,alpha,speed,dry,smooth})
b.fill([[x,y], ...], {color,size,alpha,dry,tilt,speed})   // broad strokes clipped to the polygon
b.pause(seconds)
b.rng()                                                    // seeded; never use Math.random
```

## Run a match

1. Pick the painter names, for example `fable`, `opus`, `astra`, `sol`.

2. Give each model `prompt.md` with `NAME` replaced, and run it in this folder.
   The models can run in parallel: `--solo` mode gives each one its own
   `work/<name>/` folder, so they never overwrite each other's stills.

   ```
   P="$(sed s/NAME/opus/g prompt.md)"
   claude -p "$P" --model claude-opus-5-5 --allowedTools "Read" "Write" "Edit" "Bash(node render.mjs:*)"
   codex exec --skip-git-repo-check -m gpt-6.1-sol --sandbox workspace-write -C . "$P" < /dev/null
   grok -p "$P" -m <grok-model> --always-approve --cwd .
   ```

3. Each model checks its own work with:
   ```
   node render.mjs --solo <name> --still 8,16,25    # PNGs in work/<name>/stills/
   ```

4. List every painter in `scene.json`:
   ```json
   { "label": "Opus 5.5", "file": "painters/opus.mjs" }
   ```

## Add a painter later

Run step 2 for the new model, then add one line to `scene.json` and render again.
You do not change the other painters. Their strokes replay the same way every time.

## Make the video

```
node render.mjs --still 12,25     # check the 4-panel frames first: stills/
node render.mjs --build           # out/davinci.html, open it to watch live
node render.mjs                   # out/davinci.mp4 + out/davinci.webm
```

- mp4: H.264 High, yuv420p, 1920x1080, 60fps, `+faststart`. webm: VP9, same size and framerate.
- Length = `duration` x `loops` from `scene.json` (default 30 s x 2 = 60 s).
- The loop: paper is blank at t=0. Painters paint, the result holds for `hold` seconds, then fades back to blank over `fade` seconds, so the last frame cuts back to the first.

Check before you publish:
```
ffprobe -v error -show_entries stream=width,height,r_frame_rate -show_entries format=duration out/davinci.mp4
```

## Limits

- Layout is one row. With 4 painters each canvas is about 410 px wide; with more painters each canvas gets smaller.
- An open prompt ("be creative") makes many models choose the same kind of subject. Give each model a theme if you want variety.
