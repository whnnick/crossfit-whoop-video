# CrossFit WHOOP Ad Template

This project renders a vertical 4K CrossFit short with cinematic grading, beat-cut training footage, selective WHOOP HUD overlays, mixed music, ambient gym sound, and transition SFX.

## What Is Source vs Generated

Keep these files:

- `scripts/`: rendering pipeline and timeline logic.
- `scripts/timeline.mjs`: clip order, source timecodes, zoom/pan, WHOOP windows, output duration.
- `scripts/generate-overlays.mjs`: WHOOP HUD rendering.
- `docs/`: reusable editing method and template notes.
- `templates/`: reusable WHOOP HUD style specs.

Regenerated files:

- `assets/clips/`
- `assets/overlays/`
- `assets/base-cut.mp4`
- `assets/ambient.wav`
- `assets/music-bed.wav`
- `assets/sfx.wav`
- `renders/`

## Common Commands

```bash
npm run clean
npm run all
```

For a faster rerender after only changing WHOOP styling:

```bash
npm run overlays
npm run render
```

For a faster rerender after only changing clip timing/cropping:

```bash
npm run clips
npm run render
```

## Current Output Target

- Ratio: 9:16
- Resolution: 2160 x 3840
- FPS: 30
- Duration: controlled by `OUTPUT_DURATION` in `scripts/timeline.mjs`
- Current final render name: `crossfit-20260520-ad-vertical-4k-whoop-v2-airbike-50s.mp4`
