# Codex, OpenClaw, and Local Usage

This guide explains the practical ways to use this project. The fastest path is Codex-first: enable the video plugin/capability, provide footage, and prompt Codex to create the edit.

Before local rendering or OpenClaw deployment, also read:

- Environment requirements: [ENVIRONMENT.md](ENVIRONMENT.md)
- End-to-end workflow: [WORKFLOW.md](WORKFLOW.md)

## Quick Decision

| User type | Recommended path |
| --- | --- |
| Codex user | Use the Codex fast path. Enable HyperFrames or equivalent video capability, attach footage or paste local paths, then prompt Codex. |
| OpenClaw user | Install the skill/plugin in OpenClaw and make sure the local machine has `ffmpeg`, Node.js, and related tools. |
| Local developer | Use `crossfit-whoop-ad/`, edit `template.config.json`, configure WHOOP if needed, and run npm scripts. |

## Codex Fast Path

For Codex users, this repository is primarily a reusable editing method. If Codex already has the HyperFrames plugin or another video-rendering capability enabled, you usually do not need to manually install `ffmpeg`, Node.js, Chrome, or the local template before asking for an edit.

Use this flow:

1. Enable the HyperFrames plugin or equivalent video capability in Codex.
2. Attach workout videos in the chat, or paste absolute local paths such as `/path/to/workout.mov`.
3. Tell Codex the desired duration, aspect ratio, style, must-include shots, music, and biometric overlay behavior.
4. Ask Codex to inspect the footage, build the edit, render or dry-run when possible, and verify the output.

Example prompt:

```text
Use the crossfit-whoop-video workflow to edit the attached workout footage into a 50 second vertical 4K sports ad. Keep it cinematic and energetic. Show WHOOP-style HUD data only in the opening, peak effort, and ending summary. Preserve some gym ambience and verify the final output with ffprobe.
```

The skill/plugin guidance helps Codex make editing decisions: complete action shots, training arc, selective HUD windows, music/ambient balance, safety checks, and output verification. It also includes built-in HUD presets such as `01`, `02`, and `04`, plus prompt-custom style rules. It is not a CapCut-style GUI and does not include private footage or real WHOOP credentials.

## Codex Skill Workflow

Use this when your Codex setup supports local skills and you want the workflow available by name.

```bash
mkdir -p ~/.codex/skills
cp -R skills/crossfit-whoop-video ~/.codex/skills/
```

Restart Codex or open a new conversation if the skill does not appear immediately.

Then prompt Codex with the skill name:

```text
Use $crossfit-whoop-video to cut these workout clips into a 50 second vertical 4K CrossFit ad. Keep it cinematic and energetic. Show WHOOP-style data only in the opening, peak effort, and ending summary.
```

## Codex Plugin Workflow

Use this only if your Codex build supports local plugin bundles.

```bash
mkdir -p ~/plugins
cp -R plugins/crossfit-whoop-video ~/plugins/
```

Then enable the plugin in Codex's plugin UI. The plugin packages the same skill and workflow guidance. If plugin support is unclear, use the Codex fast path or plain skill workflow instead.

## OpenClaw Workflow

OpenClaw is closer to a local agent deployment. It can use the same skill guidance, but real rendering depends on the OpenClaw machine having local video tools such as `ffmpeg`, `ffprobe`, Node.js, npm/npx, and a browser-capable rendering environment.

Recommended skill install:

```bash
openclaw skills install ./skills/crossfit-whoop-video --as crossfit-whoop-video
```

If your OpenClaw version supports Codex-compatible plugin bundles:

```bash
openclaw plugins install ./plugins/crossfit-whoop-video
openclaw plugins list
openclaw plugins inspect crossfit-whoop-video
openclaw gateway restart
```

The useful payload is the skill under:

```text
plugins/crossfit-whoop-video/skills/crossfit-whoop-video/
```

Example OpenClaw prompt:

```text
Use crossfit-whoop-video to edit these local videos into a 50 second vertical 4K CrossFit ad. Use cinematic pacing, complete action shots, selective biometric HUD overlays, and keep private footage out of Git.
```

## Local Template Workflow

Use this when you want to run the template yourself without relying on Codex to make editing decisions.

```bash
git clone https://github.com/whnnick/crossfit-whoop-video.git
cd crossfit-whoop-video/crossfit-whoop-ad
npm run dry-run
cp .env.example .env
```

Fill `.env` with your own WHOOP Developer credentials only if you want real WHOOP data, then authorize and fetch:

```bash
npm run whoop:auth
npm run whoop:fetch
```

Edit:

```text
crossfit-whoop-ad/template.config.json
```

Set your source video paths:

```json
{
  "media": {
    "videoA": {
      "src": "assets/training-a.mov",
      "source": "/absolute/path/to/your/video-1.mov",
      "mediaStart": 8
    },
    "videoB": {
      "src": "assets/training-b.mov",
      "source": "/absolute/path/to/your/video-2.mov",
      "mediaStart": 22
    },
    "audio": {
      "src": "assets/silence.wav",
      "source": "/absolute/path/to/your/music-or-video.mp4",
      "mediaStart": 0,
      "volume": 0.78
    }
  }
}
```

Then run:

```bash
npm run template:apply
npm run check
npm run template:render
```

## Prompt Examples

With required shots:

```text
Use $crossfit-whoop-video. Make a 55 second vertical sports ad from these clips. Include the wall ball rep where the ball clears the target line, the close pull-up effort, and the funny fatigue moment near the end. At least 80% of action shots should show complete movements.
```

With music:

```text
Use $crossfit-whoop-video. Use this MP4's audio as the music bed, preserve some gym ambience from the training videos, and cut the video to match the beat. WHOOP HUD should appear only 3-4 times.
```

With custom HUD styling:

```text
Use $crossfit-whoop-video. Use preset 01 + 02 + 04 as the base WHOOP look, but make the opening brighter, add a holographic matrix feel in the middle, and use a 1.5 second speed-tunnel BPM burst only at the peak effort moment.
```

With local paths:

```text
Use $crossfit-whoop-video.

Input videos:
- /absolute/path/to/video-1.mov
- /absolute/path/to/video-2.mov

Output:
- 45-60 seconds
- 9:16 vertical
- 4K if practical
- cinematic CrossFit sports ad

Safety:
- do not commit raw footage, rendered videos, .env, tokens, or personal health exports
- put final renders under an ignored renders/ folder
```

## Verification Prompt

After Codex or OpenClaw creates an edit, ask:

```text
Check the output with ffprobe. Confirm duration, resolution, fps, audio, required shots, and that private media files are still ignored by Git.
```

Useful checks:

```bash
git status --short --ignored
git ls-files
npm run dry-run
```

## Safety Rules

Never commit:

- raw workout videos
- rendered MP4 files
- `.env`
- `.whoop-token.json`
- real WHOOP JSON or Apple Health exports
- private local paths in documentation

Use synthetic placeholders for public examples and previews.
