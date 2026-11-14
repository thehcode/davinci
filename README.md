# davinci

AI models paint in a grid, stroke by stroke, and the result becomes a looping video.

Each model writes one script of bristle-brush strokes. The engine replays every
script on its own labelled canvas and renders a 1920x1080, 60fps mp4 and webm.
Every frame depends only on time, so the render is the same on every run and the video loops cleanly.

An experiment is a layout, a set of agents and a prompt, all in one folder:

- [experiments/best-piece](experiments/best-piece): Fable 5.2 and Opus 5.5 vs Sol 6.1 and Astra 6 vs Grok 4.7 and Grok 4.6, one row per provider.

## Quick start

```
npm install && npx playwright install chromium         # needs ffmpeg on PATH
node render.mjs experiments/best-piece --build         # experiments/best-piece/out/davinci.html
node render.mjs experiments/best-piece                 # experiments/best-piece/davinci.mp4 + .webm
node run.mjs experiments/<new>                         # launch the agents of a new experiment
```

The full instructions (brush API, running an experiment, layouts, adding a model,
making the video) are in [SKILL.md](SKILL.md). It is also a Claude Code skill: copy
this folder to `~/.claude/skills/davinci/`.
