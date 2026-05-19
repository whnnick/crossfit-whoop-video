# CrossFit WHOOP Ad Template

A reusable HyperFrames template for vertical 4K CrossFit-style training ads with WHOOP-inspired biometric overlays, motion effects, and optional real WHOOP API data.

## Is This a Codex Skill?

No. This repository is a normal HyperFrames video template project, not a Codex skill.

The intended use is:

1. Clone the repository.
2. Add your own footage.
3. Fill in your own WHOOP Developer credentials.
4. Edit `template.config.json`.
5. Render a new video.

Codex or another coding agent can help operate and customize the template, but users do not install this repository as a Codex skill.

## What This Repository Contains

- A HyperFrames composition under `crossfit-whoop-ad/`
- A reusable template config: `crossfit-whoop-ad/template.config.json`
- WHOOP OAuth and data-fetch scripts
- Motion-ad visual treatment: speed lines, pulse rings, scan effects, impact flashes, and transition wipes

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
