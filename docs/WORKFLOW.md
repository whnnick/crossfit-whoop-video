# Project Workflow

This document describes the full working chain from input footage to final video.

## High-Level Pipeline

```text
input videos / music / biometric data
        |
        v
template.config.json
        |
        v
npm run template:apply
        |
        v
HyperFrames HTML composition
        |
        v
npm run check / npm run template:render
        |
        v
renders/*.mp4
```

For agent-driven edits, Codex or OpenClaw sits above this pipeline: it reads the brief, inspects source files, chooses shots, updates project files, runs checks, and reports the result. Codex users with HyperFrames or equivalent video capability enabled can usually start from the prompt workflow before setting up the full local toolchain.

## Local Template Chain

Use this chain when a human edits the template directly:

1. Clone the repository.
2. Run `npm run dry-run` in `crossfit-whoop-ad/`.
3. Put private videos somewhere local.
4. Edit `template.config.json`.
5. Optional: authorize WHOOP and fetch data.
6. Run `npm run template:apply`.
7. Run `npm run check`.
8. Run `npm run template:render`.
9. Verify output with `ffprobe`.
10. Keep raw media, renders, `.env`, tokens, and health exports out of Git.

## Codex Chain

Use this chain when Codex should help edit:

1. Enable HyperFrames or an equivalent video capability in Codex.
2. Attach videos in Codex or provide absolute local paths.
3. Prompt Codex with the desired edit and, when installed, `$crossfit-whoop-video`.
4. Codex reads the skill/repository guidance when available.
5. Codex inspects available footage and clarifies missing requirements when needed.
6. Codex chooses a story arc, shot order, HUD windows, audio strategy, and output target.
7. Codex updates the project or creates a new project folder.
8. Codex runs dry-run/check/render commands when feasible in the active environment.
9. Codex verifies duration, resolution, fps, audio, required shots, and Git safety.

## OpenClaw Chain

Use this chain when running in OpenClaw:

1. Install the plain skill into OpenClaw's skills directory, or install the compatible plugin bundle if your OpenClaw version supports it.
2. Provide local media paths or attached files according to your OpenClaw environment.
3. Ask OpenClaw to use the CrossFit WHOOP video skill.
4. Keep the same media safety rules: no raw footage, rendered videos, `.env`, tokens, or health exports in Git.
5. Use local ffmpeg/Node/HyperFrames tooling for actual rendering.

## Data Chain

WHOOP data path:

```text
WHOOP OAuth
  -> .whoop-token.json
  -> npm run whoop:fetch
  -> assets/whoop-data.json
  -> assets/whoop-data.js
  -> HTML HUD animation
```

Apple Watch / other devices:

```text
export file (Apple Health XML / FIT / TCX / CSV)
  -> normalize metrics
  -> template data object
  -> HUD animation
```

If a source does not provide WHOOP-specific metrics such as Strain or Recovery, label it with source-appropriate wording instead of pretending it is WHOOP data.

## Media Safety Chain

Public repository:

- source code
- templates
- docs
- synthetic placeholders
- synthetic preview assets

Local-only files:

- real workout videos
- rendered MP4s
- `.env`
- `.whoop-token.json`
- real WHOOP API data
- Apple Health exports
- temporary clip/audio/render assets

## Verification Chain

Before claiming a video is done:

```bash
ffprobe -v error -show_streams -show_format renders/output.mp4
git status --short --ignored
```

Check:

- output exists
- duration matches request
- resolution and aspect ratio match target
- fps is expected
- audio is present and balanced
- required clips appear
- WHOOP/data overlays appear only in planned windows
- private files remain ignored

## Expected User Experience

A good user path should feel like this:

1. User opens README.
2. User sees the Chinese or English start point immediately.
3. Codex users see the fastest prompt-based workflow first.
4. OpenClaw and local users see where environment setup is required.
5. User follows a prompt, skill/plugin workflow, or template configuration.
6. User gets a render or a clear dry-run result.
7. User does not accidentally publish private media or health data.
