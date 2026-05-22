# Codex, OpenClaw, and Local Usage

This guide explains how a user should use the project after cloning it.

## Quick Decision

- Use `crossfit-whoop-ad/` locally when you want a normal template project and will edit `template.config.json` yourself.
- Install `skills/crossfit-whoop-video/` when you want Codex to plan and execute the edit from your prompt.
- Install `plugins/crossfit-whoop-video/` when your Codex/OpenClaw environment supports plugin bundles.

For most users, the plain Codex skill is the most reliable agent workflow.

## Local Template Workflow

Use this when you do not need Codex to make editing decisions.

```bash
git clone https://github.com/whnnick/crossfit-whoop-video.git
cd crossfit-whoop-video/crossfit-whoop-ad
npm run dry-run
cp .env.example .env
```

Fill `.env` with your own WHOOP Developer credentials, then authorize and fetch data:

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

## Codex Skill Workflow

Install the skill:

```bash
mkdir -p ~/.codex/skills
cp -R skills/crossfit-whoop-video ~/.codex/skills/
```

Restart Codex or open a new conversation if the skill does not appear immediately.

In Codex Desktop, provide videos in one of two ways:

- Attach video files in the chat.
- Paste absolute local paths, such as `/path/to/workout.mov`.

Then prompt Codex with the skill name:

```text
Use $crossfit-whoop-video to edit the attached workout footage into a 50 second vertical 4K sports ad with selective WHOOP-style HUD overlays.
```

Codex should inspect the footage, plan the edit, generate or update project files, render or dry-run when possible, and verify output with `ffprobe`.

## Codex Plugin Workflow

If your Codex build supports local plugin bundles:

```bash
mkdir -p ~/plugins
cp -R plugins/crossfit-whoop-video ~/plugins/
```

Then enable the plugin in Codex's plugin UI. The plugin packages the same skill, so use the plain skill workflow if plugin support is unclear.

## OpenClaw Workflow

For maximum compatibility, install the plain skill into the OpenClaw skills directory used by your setup:

```bash
cp -R skills/crossfit-whoop-video <openclaw-skills-directory>/
```

If your OpenClaw version supports Codex-compatible plugin bundles:

```bash
openclaw plugins install ./plugins/crossfit-whoop-video
openclaw plugins list
openclaw plugins inspect crossfit-whoop-video
openclaw gateway restart
```

The useful payload is the bundled skill under:

```text
plugins/crossfit-whoop-video/skills/crossfit-whoop-video/
```

## Prompt Examples

Minimal:

```text
Use $crossfit-whoop-video to cut these workout clips into a 50 second vertical 4K CrossFit ad. Keep it cinematic and energetic. Show WHOOP-style data only in the opening, peak effort, and ending summary.
```

With required shots:

```text
Use $crossfit-whoop-video. Make a 55 second vertical sports ad from these clips. Include the wall ball rep where the ball clears the target line, the close pull-up effort, and the funny fatigue moment near the end. At least 80% of action shots should show complete movements.
```

With music:

```text
Use $crossfit-whoop-video. Use this MP4's audio as the music bed, preserve some gym ambience from the training videos, and cut the video to match the beat. WHOOP HUD should appear only 3-4 times.
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

After Codex creates an edit, ask:

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
