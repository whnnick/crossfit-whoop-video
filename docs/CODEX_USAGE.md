# Codex, OpenClaw, and Local Usage

This guide is for regular Codex/OpenClaw users. The intended experience is: ask the agent to install this skill/plugin, provide workout footage, copy a prompt, and get a guided edit. The local template section is for advanced developers.

Version history is tracked in [../CHANGELOG.md](../CHANGELOG.md). Every release should update both the version number and the changelog.

Before local rendering or OpenClaw deployment, also read:

- Environment requirements: [ENVIRONMENT.md](ENVIRONMENT.md)
- End-to-end workflow: [WORKFLOW.md](WORKFLOW.md)

## User Workflows

### Codex User Workflow

1. In Codex, ask: `Please install the crossfit-whoop-video skill/plugin from https://github.com/whnnick/crossfit-whoop-video`.
2. Enable HyperFrames or equivalent video generation capability.
3. Attach workout videos, or paste local video paths.
4. Copy the prompt below and ask Codex to use the `crossfit-whoop-video` workflow.

```text
Use the crossfit-whoop-video workflow to edit my workout footage into an approximately 50 second 9:16 vertical 4K sports ad. Make it cinematic, energetic, and tightly paced. Show WHOOP-style data only at key moments, not as a full-video overlay. Prefer complete action shots, preserve some gym ambience, and verify final duration, resolution, audio, and private-file safety.
```

### OpenClaw User Workflow

1. In OpenClaw, ask it to install the `crossfit-whoop-video` skill/plugin from this repository, or install it manually from the repo checkout.
2. Make sure the OpenClaw machine has the local video toolchain.
3. Provide local media paths and use the prompt below.

```text
Use crossfit-whoop-video to edit these local workout videos into an approximately 50 second vertical 4K sports ad. Use cinematic pacing, complete action shots, selective WHOOP-style HUD overlays, and make sure raw footage, renders, .env, tokens, and health exports do not enter Git.
```

## Quick Decision

| User type | Recommended path |
| --- | --- |
| Codex user | Ask Codex to install the skill/plugin, enable HyperFrames or equivalent video capability, attach footage or paste local paths, then prompt Codex. |
| OpenClaw user | Ask OpenClaw to install the skill/plugin, make sure the local machine has `ffmpeg`, Node.js, and related tools, then provide footage paths. WHOOP API data is available through the same local `whoop:auth` / `whoop:fetch` scripts when credentials are configured. |
| Advanced/local developer | Use `crossfit-whoop-ad/`, edit `template.config.json`, configure WHOOP if needed, and run npm scripts. |

## Codex User Workflow

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

The skill/plugin guidance helps Codex make editing decisions: complete action shots, training arc, selective HUD windows, music/ambient balance, safety checks, and output verification. It also includes 10 built-in HUD presets such as `01`, `02`, and `04`, plus prompt-custom style rules. It is not a CapCut-style GUI and does not include private footage or real WHOOP credentials.

## Codex Skill Installation

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

This is useful when you expect to reuse the workflow often. After installing it, you can simply ask Codex to use `$crossfit-whoop-video` instead of restating the full editing rules each time.

## Codex Plugin Workflow

Use this only if your Codex build supports local plugin bundles.

```bash
mkdir -p ~/plugins
cp -R plugins/crossfit-whoop-video ~/plugins/
```

Then enable the plugin in Codex's plugin UI. The plugin packages the same skill and workflow guidance. If plugin support is unclear, use the Codex fast path or plain skill workflow instead.

## OpenClaw User Workflow

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

### WHOOP Data In OpenClaw

The skill can guide OpenClaw to use real WHOOP data through the repository's local scripts. OpenClaw does not fetch WHOOP data by itself; it needs the cloned repository, local environment variables, and the same OAuth flow used by the template project.

```bash
cd crossfit-whoop-ad
cp .env.example .env
npm run whoop:auth
npm run whoop:fetch
```

The generated `.env`, `.whoop-token.json`, `assets/whoop-data.json`, and `assets/whoop-data.js` files are private local files and must stay out of Git.

## Advanced: Local Template Workflow

Use this when you want to run the template yourself without relying on Codex to make editing decisions. Regular Codex users usually do not need to start here.

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

With real WHOOP data:

```text
Use $crossfit-whoop-video. Use the real WHOOP data already fetched into crossfit-whoop-ad/assets/whoop-data.js. If a requested metric is missing, omit it instead of inventing it.
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
