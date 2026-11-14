# best-piece

Top 2 models from 3 providers, one row per provider. Every model got the same
`prompt.md`: "make your best, most creative painting, pick your own subject".

| Row | Painter | Title | Idea |
|---|---|---|---|
| Anthropic | Fable 5.2 | What the Lantern Doesn't Know | A rower with a lantern, above a huge whale under the boat |
| Anthropic | Opus 5.5 | Night Crossing | A whale swims through the night sky above a sleeping village |
| OpenAI | Sol 6.1 | The Last Performance | A whale carries a gilded opera house; a tiny soprano sings to the fish |
| OpenAI | Astra 6 | The Night Shift | An octopus folds the ocean into clean sheets in a moonlit laundromat |
| xAI | Grok 4.7 | Displacement | A whale rests at the surface with an iceberg on its back |
| xAI | Grok 4.6 | Actias | A luna moth crosses the moon |

Video: [davinci.mp4](davinci.mp4) (60 s, 2 loops of 30 s).

## How this run was made

- Fable 5.2 and Opus 5.5 ran as Claude Code subagents at default effort.
- Sol 6.1 and Astra 6 ran with `codex exec`, reasoning effort high.
- Grok 4.7 and Grok 4.6 ran with the `grok` CLI, at default effort. They could write only their own file and run `render.mjs`.
- Each painter revised its piece 2 to 4 times after looking at its own stills.
- The prompt says "four AI models" and "about 410 px". It was written for the first
  round (one row of 4), and the Grok painters got the same text, so all six had the
  same task. In this 3x2 grid each canvas is about 280 px.
- `run.mjs` with `experiment.json` re-creates this setup with the same CLIs and models.
