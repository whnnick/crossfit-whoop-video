# OpenClaw Compatibility

This repository provides two extension formats:

- `skills/crossfit-whoop-video/`: plain `SKILL.md` skill directory.
- `plugins/crossfit-whoop-video/`: Codex plugin bundle containing `.codex-plugin/plugin.json` and a bundled skill.

## Compatibility Position

Verified against OpenClaw documentation:

- The plain skill is compatible with OpenClaw's skills model because it is a normal `SKILL.md` directory with references/assets.
- The plugin bundle is compatible as an OpenClaw-compatible bundle because OpenClaw detects Codex bundles using `.codex-plugin/plugin.json` and maps `skills/` into OpenClaw skills.
- This plugin uses the safe compatible subset: `.codex-plugin/plugin.json` plus `skills/`.

## Suggested OpenClaw Use

For maximum compatibility, install or copy the plain skill directory into the OpenClaw workspace/global skills location used by the user's OpenClaw setup:

```bash
cp -R skills/crossfit-whoop-video <openclaw-skills-directory>/
```

For OpenClaw bundle installation, install the plugin directory:

```bash
openclaw plugins install ./plugins/crossfit-whoop-video
openclaw plugins list
openclaw plugins inspect crossfit-whoop-video
openclaw gateway restart
```

OpenClaw should detect it as a compatible bundle. The `skills/crossfit-whoop-video/` directory inside the plugin is the useful payload.

## Caveats

- Codex UI metadata in `agents/openai.yaml` may not be used by OpenClaw.
- Codex plugin UI fields may be ignored by OpenClaw.
- Video generation still depends on local tools such as `ffmpeg`, `ffprobe`, Node.js, and project scripts.
- Apple Watch is supported through exports, not direct Apple cloud access.
