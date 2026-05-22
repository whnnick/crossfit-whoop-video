import { spawnSync } from "node:child_process";
import { totalDuration } from "./timeline.mjs";

const source = "assets/source/music-source.mp4";
const duration = totalDuration();
console.log(`Selected music start 0.0s for ${duration}s`);
const extract = spawnSync(
  "ffmpeg",
  [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-i",
    source,
    "-t",
    String(duration),
    "-vn",
    "-af",
    `afade=t=in:st=0:d=0.25,afade=t=out:st=${Math.max(0, duration - 1.2).toFixed(3)}:d=1.2,volume=0.88`,
    "-ar",
    "48000",
    "-ac",
    "2",
    "assets/music-bed.wav"
  ],
  { stdio: "inherit" }
);
if (extract.status !== 0) process.exit(extract.status ?? 1);
