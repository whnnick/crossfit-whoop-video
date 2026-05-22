# CrossFit WHOOP Video Plugin

Codex plugin bundle for creating vertical CrossFit, gym, HYROX, and sports-training videos with cinematic editing guidance and selective biometric HUD overlays.

This bundle is a workflow/skill package for agents. It is not a standalone video editor UI. In Codex, use it with an enabled video capability such as HyperFrames. In OpenClaw, use it with a local machine that has the required video toolchain.

## Contents

- `.codex-plugin/plugin.json`: Codex plugin manifest.
- `skills/crossfit-whoop-video/`: bundled Codex skill.
- `skills/crossfit-whoop-video/references/`: editing, WHOOP HUD, and device-data guidance.
- `skills/crossfit-whoop-video/assets/`: reusable HUD preset and device-source catalogs, including 10 WHOOP HUD presets and prompt-custom HUD style rules.
- `skills/crossfit-whoop-video/scripts/check-video-env.sh`: local video tooling check.

## Install As A Codex Plugin

After cloning the repository:

```bash
mkdir -p ~/plugins
cp -R plugins/crossfit-whoop-video ~/plugins/
```

Then install or enable the local plugin from Codex's plugin UI if your Codex build supports local plugins.

## Install As An OpenClaw Compatible Bundle

OpenClaw can install compatible Codex bundles that contain `.codex-plugin/plugin.json`. OpenClaw still needs local rendering tools such as `ffmpeg`, Node.js, and a browser-capable renderer for real video output.

```bash
openclaw plugins install ./plugins/crossfit-whoop-video
openclaw plugins list
openclaw plugins inspect crossfit-whoop-video
openclaw gateway restart
```

The useful payload is the bundled skill under `skills/crossfit-whoop-video/`.

## Install As A Plain Codex Skill

If the user only wants the skill:

```bash
mkdir -p ~/.codex/skills
cp -R plugins/crossfit-whoop-video/skills/crossfit-whoop-video ~/.codex/skills/
```

Prompt:

```text
Use $crossfit-whoop-video to cut this workout footage into a vertical 4K cinematic training video with biometric HUD overlays.
```

Custom HUD prompt:

```text
Use preset 01 + 02 + 04 as the base WHOOP look, then make the peak section more futuristic with a short speed-tunnel BPM burst.
```

## Device Data

Supported guidance includes:

- WHOOP API/export data
- Apple Watch through Apple Health XML, FIT, TCX, or CSV exports
- Garmin/Strava-style FIT, TCX, GPX, or CSV exports
- manual metrics when clearly labeled

Do not commit raw workout exports, videos, tokens, `.env`, or private API responses.
