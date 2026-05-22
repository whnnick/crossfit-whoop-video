<p align="center">
  <a href="README.md"><strong>English</strong></a> |
  <a href="README.zh-CN.md"><strong>简体中文</strong></a>
</p>

<h1 align="center">CrossFit WHOOP Video</h1>

<p align="center">
  Vertical 4K sports-ad video workflow for CrossFit footage, biometric HUDs, and agent-assisted editing.
</p>

<p align="center">
  <a href="docs/CODEX_USAGE.md">Codex / OpenClaw usage</a> |
  <a href="docs/WORKFLOW.md">Workflow</a> |
  <a href="docs/ENVIRONMENT.md">Environment</a> |
  <a href="docs/TUTORIAL.md">Tutorial</a> |
  <a href="README.zh-CN.md">中文文档</a>
</p>

<p align="center">
  <a href="docs/ENVIRONMENT.md"><img alt="Environment: ffmpeg, Node.js, HyperFrames" src="https://img.shields.io/badge/environment-ffmpeg%20%7C%20Node.js%20%7C%20HyperFrames-1677ff"></a>
  <a href="docs/CODEX_USAGE.md"><img alt="Agents: Codex, OpenClaw" src="https://img.shields.io/badge/agents-Codex%20%7C%20OpenClaw-7c3aed"></a>
  <a href="docs/WORKFLOW.md"><img alt="Workflow: 9:16 4K sports video" src="https://img.shields.io/badge/output-9%3A16%204K%20sports%20video-00a36c"></a>
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-f2c94c"></a>
</p>

> **Chinese users:** start from [README.zh-CN.md](README.zh-CN.md). Every user-facing English guide has a matching `*.zh-CN.md` Chinese version, and documentation changes should be kept in sync.

## Start Here

| Need | Read this |
| --- | --- |
| Fastest path: use Codex with HyperFrames enabled, attached footage, and a prompt | [Codex quick workflow](docs/CODEX_USAGE.md#codex-fast-path) |
| Use OpenClaw as a local agent deployment | [OpenClaw workflow](docs/CODEX_USAGE.md#openclaw-workflow) |
| Run the reusable template yourself | [Local template workflow](docs/CODEX_USAGE.md#local-template-workflow) |
| Install local tools for OpenClaw, local rendering, or development | [Environment requirements](docs/ENVIRONMENT.md) |
| Understand the full pipeline | [End-to-end workflow](docs/WORKFLOW.md) |

## Preview

This animated preview is synthetic. It demonstrates the intended vertical sports-ad HUD direction without using private training footage, real WHOOP data, tokens, or local file paths.

![Animated CrossFit biometric HUD preview](docs/assets/crossfit-whoop-hud-preview.svg)

## Fastest Path: Codex

For most Codex users, this project is a promptable workflow, not a manual installation checklist. Enable the HyperFrames plugin or equivalent video capability in Codex, attach workout footage or paste local file paths, then ask Codex to create the edit.

```text
Use the crossfit-whoop-video workflow to cut the attached CrossFit footage into a 50 second vertical 4K sports ad. Keep it cinematic and energetic. Show WHOOP-style data only in the opening, peak effort, and ending summary.
```

Codex can use the guidance in this repository to inspect footage, choose complete action shots, build the story arc, create selective HUD overlays, render when the environment supports it, and verify the output. Codex users usually do not need to manually install `ffmpeg`, Node.js, or Chrome before starting if the active Codex plugin/environment already provides video rendering tools.

## OpenClaw Path

OpenClaw is more like a local agent deployment. Install the plain skill or compatible plugin bundle, then make sure the OpenClaw machine has the local video toolchain needed for real rendering.

```bash
openclaw skills install ./skills/crossfit-whoop-video --as crossfit-whoop-video
```

See [Codex / OpenClaw usage](docs/CODEX_USAGE.md) and [OpenClaw compatibility](docs/OPENCLAW_COMPATIBILITY.md).

## Local Template Path

Use this when you want to clone the repository, edit `template.config.json`, configure WHOOP data yourself, and run the HyperFrames/ffmpeg pipeline locally.

```bash
cd crossfit-whoop-ad
npm run dry-run
```

See [Environment requirements](docs/ENVIRONMENT.md) and [Full template tutorial](docs/TUTORIAL.md).

## Project Modes

- `crossfit-whoop-ad/`: reusable HyperFrames video template for local rendering.
- `skills/crossfit-whoop-video/`: skill instructions that teach Codex/OpenClaw how to plan and execute CrossFit/WHOOP-style edits.
- `plugins/crossfit-whoop-video/`: Codex plugin bundle that packages the same skill for plugin-capable environments.

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
│   ├── ENVIRONMENT.md                # Required local tools and setup checks
│   ├── ENVIRONMENT.zh-CN.md
│   ├── WORKFLOW.md                   # End-to-end project pipeline
│   ├── WORKFLOW.zh-CN.md
│   ├── CODEX_USAGE.md                # Local/Codex/OpenClaw usage and prompt examples
│   ├── CODEX_USAGE.zh-CN.md
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

## Local Template Setup

This section is for local template users and contributors. Codex users with HyperFrames or equivalent video capability enabled can usually start from the [Codex fast path](docs/CODEX_USAGE.md#codex-fast-path).

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
