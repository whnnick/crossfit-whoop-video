# Reusable CrossFit WHOOP Video Template

This project is now a reusable HyperFrames template for 9:16 vertical 4K CrossFit/WHOOP-style cinematic training videos.

## Usual Workflow

1. Put new training footage anywhere on this machine.
2. Update `template.config.json`:
   - Set `media.videoA.source` and `media.videoB.source` to the new source video paths.
   - Adjust `media.videoA.mediaStart` and `media.videoB.mediaStart` to pick better moments.
   - Set `layout.subjectArea` to `left`, `center`, or `right` so the data avoids the athlete.
   - Update copy under `copy`.
3. Run:

```bash
npm run template:apply
npm run whoop:fetch
npm run check
npm run template:render
```

If you do not want to use a source path and already placed files under `assets/`, set `source` to an empty string and point `src` to the asset file.

## Config Fields That Matter Most

- `media.videoA` and `media.videoB`: the two main training clips.
- `media.whoopCapture`: optional WHOOP app screen recording overlay.
- `layout.subjectArea`: where the athlete mainly appears. Use `left`, `center`, or `right`.
- `layout.hudPosition`: where the compact WHOOP HUD goes. Use `left` or `right`.
- `layout.dataDensity`: use `balanced` for the current style or `minimal` to hide extra data panels.
- `copy`: labels, headlines, and short supporting text.

## What Stays Reusable

- Vertical 4K format: `2160x3840`, 30 seconds.
- WHOOP API data pipeline.
- Cinematic performance look: dark grade, scan lines, impact flashes, pulse rings, speed lines, and energy wipes.
- Compact data treatment that avoids covering the athlete.

## About AGENTS.md

`AGENTS.md` is not part of the video. HyperFrames generated it as instructions for AI coding agents. It explains the composition rules, commands, and validation workflow.
