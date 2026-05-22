---
name: crossfit-whoop-video
description: Create or refine vertical CrossFit, HYROX, gym, or sports-training videos with cinematic editing, 9:16/4K delivery, ffmpeg/HyperFrames-style pipelines, music and ambient audio mixing, transition SFX, and selective WHOOP-style biometric HUD overlays. Use when the user provides workout footage and asks for a cinematic training video, data-tech sports film, WHOOP data visualization, reusable editing template, or future-proof video workflow.
---

# CrossFit WHOOP Video

Use this skill to turn workout footage into a vertical short with a clear training arc, complete action shots, cinematic treatment, and selective WHOOP-style data overlays.

## Core Workflow

1. Confirm the non-negotiables:
   - output duration, aspect ratio, resolution, and fps
   - required source files and must-include moments
   - whether WHOOP data must be real API/export data or can be skipped
   - whether existing music/audio must be preserved

2. Inspect before editing:
   - run `ffprobe` on all media
   - make contact sheets or sampled frames for long source clips
   - identify complete reps and avoid rest-only fragments unless used intentionally
   - record exact source timecodes in a timeline file

3. Build the training arc:
   - atmosphere or hook
   - engine work such as bike/row/ski
   - power work such as wall balls, pull-ups, barbell, or sprint
   - fatigue/reset
   - optional human/funny contrast
   - final push and WHOOP summary

4. Render with a reproducible pipeline:
   - pre-cut clips from source media
   - mix music, ambient gym audio, and SFX
   - choose a built-in WHOOP HUD preset or derive a prompt-custom HUD style
   - generate WHOOP overlay PNG/video assets
   - compose final video
   - verify output with `ffprobe` and sampled frames

## Editing Rules

- Keep 80% or more of action shots as complete movements when the user requests a polished cinematic sports video.
- For wall balls, prefer shots where the ball clearly crosses the target line.
- For pull-ups, crop/zoom so the athlete is the subject.
- For bike shots, use close kinetic framing where face, arms, and fan/bike motion are readable.
- Preserve requested clips exactly; if the requested moment is ambiguous, inspect and ask.
- Do not cover the athlete with large data panels during key action unless the user explicitly wants that.
- Keep WHOOP overlays selective, not full-video, unless requested.

## WHOOP Data Rules

- Use real WHOOP API/export data when the user requests real data.
- If the repository includes `crossfit-whoop-ad/`, use its WHOOP OAuth/data-fetch scripts when credentials are configured.
- Do not fabricate missing metrics. If a metric is unavailable, omit it or label it as unavailable.
- Never commit or expose WHOOP tokens, client secrets, `.env`, or private API responses.
- For Apple Watch, use user-provided exports such as Apple Health export XML or third-party FIT/TCX/CSV files. Do not claim direct Apple cloud access unless the project includes a real iOS HealthKit app/export bridge.
- Prefer these display windows:
  - opening: 3-6 seconds for session context
  - middle: 1-4 short heart-rate/data hits near high intensity
  - ending: 4-8 seconds for a summary card

## HUD Style Rules

- Prefer built-in presets from `assets/whoop-hud-templates.json` when the user asks for a known style.
- Preserve legacy numeric aliases: `01` maps to `style_01_broadcast_bright`, `02` maps to `style_02_glass_side_hud`, and `04` maps to `style_04_summary_card`.
- When the user asks for a custom style by prompt, start from the closest preset and adapt mood, placement, density, colors, animation intensity, and metric list.
- If the user asks for "more futuristic", "more tech", or "cooler", consider `style_07_holographic_matrix`, `style_08_speed_tunnel_hr`, `style_09_recovery_orbit`, or `style_10_data_stomp_title`.
- Keep large HUD panels out of required action areas unless the user explicitly prioritizes data over visibility.

## References

Load only what is needed:

- `references/editing-methodology.md`: detailed repeatable editing process and QA checklist.
- `references/whoop-hud-templates.md`: HUD preset selection and prompt-customization guide.
- `references/device-data-sources.md`: supported device/export sources and metric mapping.
- `assets/whoop-hud-templates.json`: machine-readable HUD template catalog.
- `assets/device-data-sources.json`: machine-readable data source adapters.

## Useful Commands

Check local video tooling:

```bash
bash skills/crossfit-whoop-video/scripts/check-video-env.sh
```

Typical project commands when a repo already contains the rendering pipeline:

```bash
npm run clean
npm run all
npm run overlays
npm run render
ffprobe -v error -show_entries stream=index,codec_type,codec_name,width,height,r_frame_rate -show_entries format=duration -of default=noprint_wrappers=1 path/to/output.mp4
```

Fetch real WHOOP data when the template project and credentials are available:

```bash
cd crossfit-whoop-ad
cp .env.example .env
npm run whoop:auth
npm run whoop:fetch
```

Keep `.env`, `.whoop-token.json`, `assets/whoop-data.json`, and `assets/whoop-data.js` private and ignored.

## Delivery Checklist

Before final response:

- final video exists and plays
- specs match requested size, fps, duration, and audio
- required moments are present
- WHOOP appears only in planned windows
- subject is not hidden by HUD panels
- generated media, raw footage, secrets, and token files are ignored by git
