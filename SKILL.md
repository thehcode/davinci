---
name: davinci
description: Run a painting match between AI models. Each model writes a script of bristle-brush strokes; the engine replays every canvas in a labelled grid and renders a looping 1920x1080 60fps mp4 + webm. Use when asked to have agents or models paint, compare models visually, or make an "AI vs AI painting" video.
---

# davinci

Agents paint by writing code, not by moving a mouse. Each painter is one file of
stroke commands. The engine replays all painters in a grid, deterministically,
so any frame can be rendered at any time and the video loops cleanly.

## Files

| Path | What it is |
|---|---|
| `davinci.src.html` | Replay engine (Canvas 2D, bristle brush, canvas grain, grid layout) |
| `render.mjs` | Builds an experiment's page and renders stills or the video |
| `run.mjs` | Launches every painter agent of an experiment in parallel |
| `experiments/<name>/` | One experiment: setup, prompt, paintings, video |

An experiment = layout + agents + prompt:

| Path in `experiments/<name>/` | What it is |
|---|---|
| `experiment.json` | Timing, paper, `layout`, and the painters: name, label, provider, agent CLI, model |
| `prompt.md` | The task given to every agent. `NAME` = painter name, `EXP` = experiment folder |
| `painters/<name>.mjs` | One painting. `export default function (b) { ... }` |
| `davinci.mp4` | The rendered video (not in git) |

## Setup

```
npm install
npx playwright install chromium
```
ffmpeg must be on PATH. For `run.mjs`, install and sign in to each agent CLI you use:
`claude`, `codex`, `grok`.

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

## Run an experiment

1. Copy `experiments/best-piece/` to `experiments/<new>/`. Delete its `painters/*.mjs` and `davinci.mp4`.

2. Edit `experiment.json`: one entry per painter. `agent` is `claude`, `codex` or
   `grok`; `model` is that CLI's model id; `effort` is optional (codex only).

   ```json
   { "name": "opus", "label": "Opus 5.5", "provider": "Anthropic", "agent": "claude", "model": "claude-opus-5-5" }
   ```

3. Edit `prompt.md` if you want a different task.

4. Launch the agents:
   ```
   node run.mjs experiments/<new>                 # all painters, in parallel
   node run.mjs experiments/<new> --only grok47   # one painter
   ```
   Each agent may write only its own painter file and run `render.mjs`. Logs go to
   `experiments/<new>/work/<name>/agent.log`. Each agent checks its own work with
   `node render.mjs experiments/<new> --solo <name> --still 8,16,25`, so agents in
   parallel never overwrite each other's stills.

To add a CLI, add one entry to `AGENTS` in `run.mjs`.

## Layout

Canvases fill the grid row by row, in the order of `painters`. Without `layout`,
all canvases sit in one row.

```json
"layout": { "rows": 3, "cols": 2 }
```

Canvas size at 1920x1080: one row of 4 is about 410 px; a 3x2 grid is about 280 px.

## Add a painter later

Add its entry to `experiment.json`, run `node run.mjs experiments/<name> --only <painter>`,
and render again. The other paintings replay unchanged.

## Make the video

```
node render.mjs experiments/<name> --still 12,25   # check frames first: <exp>/stills/
node render.mjs experiments/<name> --build         # <exp>/out/davinci.html, open it to watch live
node render.mjs experiments/<name>                 # <exp>/davinci.mp4 + <exp>/davinci.webm
```

- mp4: H.264 High, yuv420p, 1920x1080, 60fps, `+faststart`. webm: VP9, same size and framerate.
- Length = `duration` x `loops` (`best-piece`: 30 s x 1 = 30 s).
- The loop: paper is blank at t=0. Painters paint, the result holds for `hold` seconds, then fades back to blank over `fade` seconds, so the last frame cuts back to the first.

Check before you publish:
```
ffprobe -v error -show_entries stream=width,height,r_frame_rate -show_entries format=duration experiments/<name>/davinci.mp4
```

## Limits

- More rows or columns make each canvas smaller. Tell the painters the real canvas size in `prompt.md`.
- An open prompt ("be creative") makes many models choose the same kind of subject. In `best-piece`, 4 of 6 painted a whale. Give each model a theme if you want variety.
