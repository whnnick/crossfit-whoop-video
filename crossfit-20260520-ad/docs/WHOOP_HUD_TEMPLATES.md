# WHOOP HUD Template Guide

The current preferred direction is a brighter version of the May 19 WHOOP style: cinematic, high contrast, WHOOP green, glass panels, large numbers, and short animated data hits.

Use templates in `templates/whoop-hud-templates.json` as a style reference when updating `scripts/generate-overlays.mjs`.

## Recommended Mix

- Opening: `broadcast_bright`
- Mid-section: `glass_side_hud` or `compact_telemetry`
- Peak moment: `redline_peak`
- Closing: `summary_card`

## Template Notes

`broadcast_bright`

- Closest to the May 19 reference.
- Big headline, bottom data strip, WHOOP green progress bar.
- Best for 3-6 seconds near the start.

`glass_side_hud`

- Tall right-side glass panel.
- Large heart-rate number and progress bar.
- Best during wall ball, pull-up, or bike intensity.

`summary_card`

- Large bottom card with 4-6 key metrics.
- Best for the last 4-8 seconds.

`compact_telemetry`

- Small corner card.
- Best when the action must stay clean and unobstructed.

`redline_peak`

- High-contrast red/green peak alert.
- Best for 1-2 seconds only.

`minimal_ticker`

- Bottom strip only.
- Best when the video already has strong motion and large panels would be too much.
