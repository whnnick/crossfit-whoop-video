# CrossFit WHOOP Ad Template

A reusable HyperFrames template for vertical 4K CrossFit-style training ads with WHOOP-inspired biometric overlays, motion effects, and optional real WHOOP API data.

中文文档见 [README.zh-CN.md](README.zh-CN.md).

## Project Modes

This repository now supports two use patterns:

- `crossfit-whoop-ad/`: a normal HyperFrames video template project.
- `skills/crossfit-whoop-video/`: a Codex skill that teaches Codex how to plan and execute CrossFit/WHOOP-style edits.
- `plugins/crossfit-whoop-video/`: a Codex plugin bundle that packages the skill for plugin-based installs.

For the normal template project, the intended use is:

1. Clone the repository.
2. Add your own footage.
3. Fill in your own WHOOP Developer credentials.
4. Edit `template.config.json`.
5. Render a new video.

For the Codex skill, copy or symlink `skills/crossfit-whoop-video/` into your Codex skills directory, then ask Codex to use `$crossfit-whoop-video`.

Example:

```bash
mkdir -p ~/.codex/skills
cp -R skills/crossfit-whoop-video ~/.codex/skills/
```

Then prompt Codex:

```text
Use $crossfit-whoop-video to cut this CrossFit footage into a 50 second vertical 4K sports ad with selective WHOOP overlays.
```

For the Codex plugin bundle:

```bash
mkdir -p ~/plugins
cp -R plugins/crossfit-whoop-video ~/plugins/
```

OpenClaw compatibility notes are in [docs/OPENCLAW_COMPATIBILITY.md](docs/OPENCLAW_COMPATIBILITY.md).

## What This Repository Contains

- A HyperFrames composition under `crossfit-whoop-ad/`
- A reusable Codex skill under `skills/crossfit-whoop-video/`
- A Codex plugin bundle under `plugins/crossfit-whoop-video/`
- A reusable template config: `crossfit-whoop-ad/template.config.json`
- WHOOP OAuth and data-fetch scripts
- Motion-ad visual treatment: speed lines, pulse rings, scan effects, impact flashes, and transition wipes

## Device Data Sources

The workflow supports biometric data in these practical ways:

- WHOOP: OAuth/API or exported JSON data.
- Apple Watch: Apple Health export XML, or FIT/TCX/CSV exports from apps such as HealthFit.
- Garmin/Strava-style sources: FIT, TCX, GPX, CSV, or authorized API data when implemented by the user.
- Manual metrics: allowed only when clearly labeled as manual input.

Apple Watch support is export-based in this open-source project. Direct HealthKit access requires an iOS app or export bridge.

## What This Repository Does Not Include

This repository intentionally excludes:

- Real training videos
- Rendered MP4 files
- `.env`
- `.whoop-token.json`
- `assets/whoop-data.json`
- `assets/whoop-data.js`

Those files may contain private data, credentials, or large media assets.

## Setup

```bash
cd crossfit-whoop-ad
cp .env.example .env
```

Fill in your own WHOOP Developer credentials in `.env`, then configure your WHOOP Developer app redirect URL:

```text
http://localhost:8977/callback
```

Authorize WHOOP:

```bash
npm run whoop:auth
```

Fetch WHOOP data:

```bash
npm run whoop:fetch
```

## Use New Footage

Edit `crossfit-whoop-ad/template.config.json`.

For local assets already inside `assets/`:

```json
{
  "media": {
    "videoA": {
      "src": "assets/new-video.mov",
      "source": "",
      "mediaStart": 0
    }
  }
}
```

For footage elsewhere on your machine:

```json
{
  "media": {
    "videoA": {
      "src": "assets/training-a.mov",
      "source": "/absolute/path/to/new-video.mov",
      "mediaStart": 12
    }
  }
}
```

Apply the template, check it, and render:

```bash
npm run template:apply
npm run check
npm run template:render
```

For a full walkthrough, see [docs/TUTORIAL.md](docs/TUTORIAL.md).

## Notes

- WHOOP API data is processed workout/recovery/cycle data, not a continuous raw real-time heart-rate stream.
- WHOOP is a trademark of WHOOP, Inc. This template is not affiliated with or endorsed by WHOOP.
- Do not commit personal training footage, rendered videos, credentials, tokens, or exported WHOOP data.
