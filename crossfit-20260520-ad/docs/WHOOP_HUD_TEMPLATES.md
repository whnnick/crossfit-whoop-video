# WHOOP HUD Template Guide

The template catalog lives at `templates/whoop-hud-templates.json`. It now contains reusable presets from the prior edits plus prompt-customization rules for future edits.

## Existing Presets

- `style_01_broadcast_bright` (`01`): May 19-style opening HUD, brighter than the original dark reference.
- `style_02_glass_side_hud` (`02`): large right-side glass panel with dynamic heart-rate data.
- `style_03_compact_telemetry` (`03`): small corner telemetry chip for action-safe moments.
- `style_04_summary_card` (`04`): closing scorecard with multiple workout metrics.
- `style_05_redline_peak` (`05`): short red/green peak-effort alert.
- `style_06_minimal_ticker` (`06`): low-obstruction bottom ticker.

## New Futuristic Options

- `style_07_holographic_matrix`: floating holographic panels around the athlete.
- `style_08_speed_tunnel_hr`: kinetic BPM burst with radial speed lines.
- `style_09_recovery_orbit`: animated recovery/sleep rings.
- `style_10_data_stomp_title`: cinematic title hit with micro data chips.

## Recommended Mix

- Opening: `01`
- Mid-section: `02` or `03`
- Peak/transition: `05` or `08`
- Recovery/context: `09`
- Closing: `04`

## Prompt Customization

Users can request custom HUD styling in plain language. Start from the closest preset, then adapt:

- brightness and contrast
- accent colors
- data density
- placement and safe zones
- animation intensity
- metrics and timing windows

Example:

```text
Use 01 + 02 + 04 as the base WHOOP look, but make the opening brighter, add more holographic scan lines, and use a large dynamic BPM burst only during the peak wall-ball section.
```

When updating `scripts/generate-overlays.mjs`, use the JSON catalog as the style source of truth. Do not hard-code private data or one-off user footage paths into the template docs.
