import { spawnSync } from "node:child_process";

const clips = [
  ["shot-01.mp4", 88.0, 3.1],
  ["shot-02.mp4", 178.0, 7.0],
  ["shot-03.mp4", 515.0, 8.0],
  ["shot-04.mp4", 522.0, 7.4],
  ["shot-05.mp4", 89.0, 7.45],
  ["shot-06.mp4", 356.0, 8.95],
  ["shot-07.mp4", 517.0, 6.05],
  ["shot-08.mp4", 520.0, 7.2],
  ["shot-09.mp4", 704.0, 8.0]
];

for (const [file, start, duration] of clips) {
  console.log(`Rendering ${file} from ${start}s for ${duration}s`);
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-hide_banner",
      "-loglevel",
      "error",
      "-ss",
      String(start),
      "-i",
      "assets/flow-source.mov",
      "-t",
      String(duration),
      "-vf",
      "scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,setsar=1",
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "20",
      "-r",
      "30",
      "-pix_fmt",
      "yuv420p",
      `assets/${file}`
    ],
    { stdio: "inherit" }
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
