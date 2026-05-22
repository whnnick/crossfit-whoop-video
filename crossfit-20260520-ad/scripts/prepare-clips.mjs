import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { clips, FPS, HEIGHT, WIDTH } from "./timeline.mjs";

mkdirSync("assets/clips", { recursive: true });

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

for (const clip of clips) {
  const zoom = clip.zoom || 1;
  const scaledW = Math.round(WIDTH * zoom);
  const scaledH = Math.round(HEIGHT * zoom);
  const maxCropX = Math.max(0, scaledW - WIDTH);
  const maxCropY = Math.max(0, scaledH - HEIGHT);
  const cropX = clamp(Math.round((scaledW - WIDTH) / 2 + (clip.panX || 0)), 0, maxCropX);
  const cropY = clamp(Math.round((scaledH - HEIGHT) / 2 + (clip.panY || 0)), 0, maxCropY);
  const cropXEnd = clamp(Math.round((scaledW - WIDTH) / 2 + (clip.panXEnd ?? clip.panX ?? 0)), 0, maxCropX);
  const cropYEnd = clamp(Math.round((scaledH - HEIGHT) / 2 + (clip.panYEnd ?? clip.panY ?? 0)), 0, maxCropY);
  const cropXExpr = cropX === cropXEnd ? String(cropX) : `${cropX}+(${cropXEnd - cropX})*t/${clip.duration}`;
  const cropYExpr = cropY === cropYEnd ? String(cropY) : `${cropY}+(${cropYEnd - cropY})*t/${clip.duration}`;
  const speed = clip.speed || 1;
  const inputDuration = Number((clip.duration * speed).toFixed(3));
  const setptsFactor = Number((1 / speed).toFixed(6));
  const filter = [
    `scale=${scaledW}:${scaledH}`,
    `crop=${WIDTH}:${HEIGHT}:${cropXExpr}:${cropYExpr}`,
    `setpts=${setptsFactor}*PTS`,
    `fps=${FPS}`,
    "eq=contrast=1.08:saturation=1.02:brightness=0.015",
    "unsharp=5:5:0.42",
    "setsar=1",
    "format=yuv420p"
  ].join(",");

  const output = `assets/clips/${clip.id}.mp4`;
  console.log(`Rendering ${output}`);
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-hide_banner",
      "-loglevel",
      "error",
      "-ss",
      String(clip.start),
      "-t",
      String(inputDuration),
      "-i",
      `assets/source/${clip.source}`,
      "-vf",
      filter,
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "20",
      "-r",
      String(FPS),
      "-g",
      String(FPS),
      "-keyint_min",
      String(FPS),
      "-sc_threshold",
      "0",
      "-movflags",
      "+faststart",
      output
    ],
    { stdio: "inherit" }
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
