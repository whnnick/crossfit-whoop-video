# WHOOP HUD Templates

Use `assets/whoop-hud-templates.json` for the machine-readable catalog. The catalog contains 10 reusable built-in presets plus prompt customization rules.

## Built-In Presets

Use these as the default cinematic sports-ad kit:

- `style_01_broadcast_bright` (`01`, `broadcast_bright`): opening context, closest to the May 19 reference but brighter.
- `style_02_glass_side_hud` (`02`, `glass_side_hud`): mid-intensity data, right-side translucent panel with large heart-rate number.
- `style_03_compact_telemetry` (`03`, `compact_telemetry`): small corner card when action must stay unobstructed.
- `style_04_summary_card` (`04`, `summary_card`): ending summary, large bottom card with multiple metrics.
- `style_05_redline_peak` (`05`, `redline_peak`): 1-2 second alert for maximum intensity.
- `style_06_minimal_ticker` (`06`, `minimal_ticker`): bottom strip when only lightweight data is needed.

Use these when the user asks for a cooler or more futuristic treatment:

- `style_07_holographic_matrix`: floating holographic grid panels around the subject.
- `style_08_speed_tunnel_hr`: radial speed lines plus oversized BPM hit for transitions.
- `style_09_recovery_orbit`: animated recovery/sleep rings with small metric satellites.
- `style_10_data_stomp_title`: aggressive title hit with embedded micro metrics.

## Recommended Mix

- Opening: `01` or `style_01_broadcast_bright`
- Middle high-intensity: `02`, `03`, `07`, or `08`
- Peak moment: `05` or `08`
- Recovery/context: `09`
- Closing: `04`

## Prompt Customization

Users can request a custom style directly in the prompt. Start from the closest preset, then adapt:

- mood: cinematic, bright, aggressive, minimal, futuristic, broadcast
- placement: top-left, right-side, lower-third, bottom ticker, full-screen burst
- data density: minimal, balanced, rich
- motion intensity: subtle, medium, high-impact
- colors and accents
- metrics to show
- moments where the HUD should appear

Example:

```text
Use style 08 for the peak wall-ball section, but make it brighter, with less red, a bigger BPM number, and only a 1.5 second burst.
```

## Motion Patterns

Use short, intentional motion:

- number roll/count-up
- progress bar growth
- scan-line sweep
- panel slide-in/out
- radial streak burst
- holographic grid build
- orbital ring draw-on
- title stomp/glitch wipe
- short beat flash
- final glow on summary card

Do not make overlays animate constantly through the whole video.
