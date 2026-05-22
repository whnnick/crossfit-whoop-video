# Environment Requirements

This page is mainly for OpenClaw users, local template users, contributors, and Codex setups that do not already provide video rendering tools.

If you are using Codex with the HyperFrames plugin or an equivalent video capability already enabled, you usually can start by attaching footage and prompting Codex. You do not need to manually install every tool on this page before trying the Codex workflow.

For OpenClaw, local rendering, and development, this repository is a local video-generation workflow. It does not ship a cloud renderer, so the machine that renders real footage needs a working local video environment.

## Required Tools

| Tool | Why it is needed | How to check |
| --- | --- | --- |
| Git | Clone the repository and manage source changes | `git --version` |
| Node.js | Run project scripts and HyperFrames commands | `node --version` |
| npm / npx | Run package scripts and fetch HyperFrames CLI | `npm --version` |
| ffmpeg | Cut clips, extract audio, mix audio, compose final video | `ffmpeg -version` |
| ffprobe | Inspect rendered video duration, resolution, fps, and streams | `ffprobe -version` |
| Chrome / Chromium | HyperFrames uses a browser-like renderer for HTML video compositions | open Chrome or use the bundled browser in your environment |

## Recommended Versions

- Node.js: 20 or newer.
- npm: current stable version bundled with Node.js.
- ffmpeg / ffprobe: recent Homebrew, apt, or official binary build.
- HyperFrames: run through `npx`; the template pins `hyperframes@0.6.22` where needed.

## macOS Setup

If you use Homebrew:

```bash
brew install git node ffmpeg
```

Then verify:

```bash
git --version
node --version
npm --version
ffmpeg -version
ffprobe -version
```

## Linux Setup

On Debian/Ubuntu-style systems:

```bash
sudo apt update
sudo apt install -y git nodejs npm ffmpeg
```

Some distributions ship an older Node.js. If `node --version` is below 20, install a newer Node.js release through your normal Node version manager.

## Project Environment Check

From the repository root:

```bash
bash skills/crossfit-whoop-video/scripts/check-video-env.sh
```

Expected output:

```text
ffmpeg   /path/to/ffmpeg
ffprobe  /path/to/ffprobe
node     /path/to/node
npm      /path/to/npm
Video environment looks ready.
```

## Clean Checkout Dry-Run

Before adding private footage:

```bash
cd crossfit-whoop-ad
npm run dry-run
```

The dry-run uses synthetic placeholder media committed to the repository. It validates the template without requiring private videos, real WHOOP data, `.env`, or tokens.

## WHOOP API Requirements

WHOOP integration is optional. To use real WHOOP data, you need:

- a WHOOP Developer account
- your own `WHOOP_CLIENT_ID`
- your own `WHOOP_CLIENT_SECRET`
- redirect URL set to `http://localhost:8977/callback`

Local private files:

```text
crossfit-whoop-ad/.env
crossfit-whoop-ad/.whoop-token.json
crossfit-whoop-ad/assets/whoop-data.json
crossfit-whoop-ad/assets/whoop-data.js
```

These are intentionally ignored by Git and must not be committed.

## Troubleshooting

`ffmpeg: command not found`

Install ffmpeg and make sure it is available in your shell `PATH`.

`npx hyperframes ...` fails with a network error

Check your network, npm registry access, and proxy settings. HyperFrames is fetched through npm when it is not already cached.

`npm run dry-run` passes but real render fails

Check that `template.config.json` points to real local media paths and that those files exist.

`WHOOP auth fails`

Confirm the redirect URL in the WHOOP Developer Dashboard exactly matches `http://localhost:8977/callback`.
