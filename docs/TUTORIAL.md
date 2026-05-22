# Tutorial: Create a New Training Ad

This guide explains how to use the template with your own video footage and your own WHOOP account.

## Is This a Codex Skill?

No. This is a normal HyperFrames project/template, not a Codex skill.

You use it by cloning the repo, editing `template.config.json`, adding your own video files, and running npm scripts. Codex can help you make those edits, but there is no skill installation step.

## 1. Clone and Enter the Project

```bash
git clone <repo-url>
cd crossfit-video/crossfit-whoop-ad
```

The project uses `npx hyperframes`, so there is no committed `node_modules/` folder.

## 2. Add Your WHOOP App Credentials

Create a local `.env` file:

```bash
cp .env.example .env
```

Fill in:

```text
WHOOP_CLIENT_ID=your_client_id
WHOOP_CLIENT_SECRET=your_client_secret
WHOOP_REDIRECT_URI=http://localhost:8977/callback
```

In the WHOOP Developer Dashboard, set the app redirect URL to:

```text
http://localhost:8977/callback
```

Never commit `.env`.

## 3. Authorize WHOOP

```bash
npm run whoop:auth
```

This starts a local callback server and opens the WHOOP authorization page. After you approve access, the project stores a local `.whoop-token.json` file.

Never commit `.whoop-token.json`.

## 4. Fetch Your WHOOP Data

```bash
npm run whoop:fetch
```

This writes:

```text
assets/whoop-data.json
assets/whoop-data.js
```

These files contain personal health/training data and are intentionally ignored by Git.

Important limitation: the WHOOP API provides processed workout, recovery, sleep, and cycle metrics. It does not provide a continuous raw real-time heart-rate stream. The template animates from real summary metrics.

## 5. Add New Video Footage

You can either put media directly in `assets/` or point the template to files elsewhere on your machine.

Example using files already copied into `assets/`:

```json
{
  "media": {
    "videoA": {
      "src": "assets/training-a.mov",
      "source": "",
      "mediaStart": 4
    },
    "videoB": {
      "src": "assets/training-b.mov",
      "source": "",
      "mediaStart": 22
    }
  }
}
```

Example linking from another local path:

```json
{
  "media": {
    "videoA": {
      "src": "assets/training-a.mov",
      "source": "/absolute/path/to/your/video.mov",
      "mediaStart": 4
    }
  }
}
```

When `source` is set, `npm run template:apply` creates a symlink at `src`.

## 6. Adjust the Template

Edit:

```text
template.config.json
```

Most useful fields:

```json
{
  "layout": {
    "subjectArea": "center",
    "hudPosition": "right",
    "dataDensity": "balanced"
  },
  "copy": {
    "heroHeadline": "Every rep has a signal",
    "scene2Headline": "Find the redline",
    "finalHeadline": "Train where the data says go"
  }
}
```

Use:

- `subjectArea: "left"` if the athlete is mostly on the left, so data moves away.
- `subjectArea: "right"` if the athlete is mostly on the right.
- `subjectArea: "center"` for balanced footage.
- `dataDensity: "minimal"` if you want almost no data panels.
- `dataDensity: "balanced"` for the current cinematic sports-video style.

## 7. Apply, Check, and Render

```bash
npm run template:apply
npm run check
npm run template:render
```

The default output is configured in `template.config.json`:

```text
renders/crossfit-whoop-video-template.mp4
```

Rendered videos are ignored by Git.

## 8. Open Source Safety Checklist

Before pushing to GitHub, verify:

```bash
git status --short --ignored
git ls-files --others --exclude-standard
```

Do not commit:

- `.env`
- `.whoop-token.json`
- `assets/whoop-data.json`
- `assets/whoop-data.js`
- training footage
- rendered videos

## 9. Common Edits

Change clip timing:

```json
"mediaStart": 12
```

Move the data away from the athlete:

```json
"subjectArea": "right",
"hudPosition": "left"
```

Use one source video for both halves:

```json
"videoA": { "src": "assets/session.mov", "mediaStart": 0 },
"videoB": { "src": "assets/session.mov", "mediaStart": 20 }
```

Disable the WHOOP screen-recording overlay:

```json
"whoopCapture": {
  "src": "assets/whoop-source.mp4",
  "enabled": false
}
```
