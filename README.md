# CrossFit WHOOP Ad Template

A reusable HyperFrames template for vertical 4K CrossFit-style training ads with WHOOP-inspired biometric overlays, motion effects, and optional real WHOOP API data.

中文文档见 [README.zh-CN.md](README.zh-CN.md). User-facing documentation also has matching `*.zh-CN.md` versions.

## Preview

This animated preview is synthetic. It demonstrates the intended vertical sports-ad HUD direction without using private training footage, real WHOOP data, tokens, or local file paths.

![Animated CrossFit biometric HUD preview](docs/assets/crossfit-whoop-hud-preview.svg)

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

## Documentation Structure

This repository follows a GitHub-friendly documentation layout: the root README gives the quick start, `docs/` holds general guides, each project folder has local README/design notes, and every user-facing English document has a matching `*.zh-CN.md` Chinese version.

```text
.
├── README.md                         # English overview and quick start
├── README.zh-CN.md                   # Chinese overview, quick start, and doc index
├── LICENSE                           # Open-source license
├── docs/assets/                      # Safe synthetic preview assets
├── docs/
│   ├── TUTORIAL.md                   # End-to-end template tutorial
│   ├── TUTORIAL.zh-CN.md
│   ├── OPENCLAW_COMPATIBILITY.md     # OpenClaw compatibility notes
│   └── OPENCLAW_COMPATIBILITY.zh-CN.md
├── crossfit-whoop-ad/
│   ├── README-TEMPLATE.md            # Reusable template workflow
│   ├── README-TEMPLATE.zh-CN.md
│   ├── DESIGN.md                     # Template visual direction
│   └── DESIGN.zh-CN.md
├── crossfit-20260520-ad/
│   ├── README.md                     # Example project pipeline
│   ├── README.zh-CN.md
│   ├── DESIGN.md                     # Example project visual direction
│   ├── DESIGN.zh-CN.md
│   └── docs/
│       ├── VIDEO_EDITING_METHODOLOGY.md
│       ├── VIDEO_EDITING_METHODOLOGY.zh-CN.md
│       ├── WHOOP_HUD_TEMPLATES.md
│       └── WHOOP_HUD_TEMPLATES.zh-CN.md
├── skills/crossfit-whoop-video/
│   ├── SKILL.md                      # Agent-readable skill entrypoint
│   └── references/                   # Human-readable skill references
├── plugins/crossfit-whoop-video/
│   ├── README.md                     # Plugin install/use notes
│   ├── README.zh-CN.md
│   └── skills/crossfit-whoop-video/  # Bundled skill payload
└── flow-whoop-60s/
    ├── DESIGN.md                     # Earlier Flow video visual direction
    └── DESIGN.zh-CN.md
```

`SKILL.md`, `AGENTS.md`, and `CLAUDE.md` are kept as agent-facing instruction files. They are not translated one-to-one because changing their wording can affect how coding agents interpret the workflow.

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

Run a source-only dry-run before adding private footage:

```bash
npm run dry-run
```

The dry-run uses a committed synthetic silent audio placeholder. Replace `media.audio.src` in `template.config.json` with your own footage or music before rendering a real edit.

The committed media files under `crossfit-whoop-ad/assets/` are synthetic placeholders for open-source validation only. They are not real training footage or real WHOOP exports.

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
- `crossfit-20260520-ad/` and `flow-whoop-60s/` are source examples from prior edits. Their full `npm run check`/render commands require generated media assets that are intentionally not committed; use their `npm run check:source` command for clean-checkout validation.
