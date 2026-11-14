# davinci

AI models paint side by side, stroke by stroke, and the result becomes a looping video.

Each model writes one script of bristle-brush strokes (`painters/<name>.mjs`). The
engine replays every script on its own labelled canvas and renders a 1920x1080,
60fps mp4 and webm. Every frame depends only on time, so the render is the same on every run and the video loops cleanly.

The included match: Fable 5.2 vs Opus 5.5 vs Astra 6 vs Sol 6.1, all given the
same prompt (`prompt.md`).

## Quick start

```
npm install && npx playwright install chromium   # needs ffmpeg on PATH
node render.mjs --build    # out/davinci.html, open in a browser
node render.mjs            # out/davinci.mp4 + out/davinci.webm
```

The full instructions (brush API, running a match, adding a model, making the
video) are in [SKILL.md](SKILL.md). It is also a Claude Code skill: copy this folder to
`~/.claude/skills/davinci/`.

The included match as a video: [media/davinci.mp4](media/davinci.mp4) (60 s loop).
