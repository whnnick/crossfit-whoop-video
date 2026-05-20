import { spawnSync } from "node:child_process";

const input = "renders/flow-whoop-60s-vertical-4k.mp4";
const output = "renders/flow-whoop-60s-vertical-4k-v2.mp4";

const filter = [
  "[0:v][3:v]overlay=0:0:enable='between(t,12.1,14.9)'[v1]",
  "[v1][4:v]overlay=0:0:enable='between(t,25.7,28.5)'[v2]",
  "[v2][5:v]overlay=0:0:enable='between(t,33.5,36.15)'[v3]",
  "[v3][6:v]overlay=0:0:enable='between(t,39.75,45.6)'[vout]",
  "[1:a]volume=0.66[a1]",
  "[2:a]volume=0.72[a2]",
  "[a1][a2]amix=inputs=2:duration=first:normalize=0[aout]"
].join(";");

const result = spawnSync(
  "ffmpeg",
  [
    "-y",
    "-hide_banner",
    "-i",
    input,
    "-i",
    "assets/flow-sport-bed.wav",
    "-i",
    "assets/flow-ambient.wav",
    "-i",
    "assets/overlays/whoop-hr.png",
    "-i",
    "assets/overlays/whoop-recovery.png",
    "-i",
    "assets/overlays/whoop-sleep.png",
    "-i",
    "assets/overlays/whoop-main.png",
    "-filter_complex",
    filter,
    "-map",
    "[vout]",
    "-map",
    "[aout]",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "18",
    "-r",
    "30",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-movflags",
    "+faststart",
    output
  ],
  { stdio: "inherit" }
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(`Wrote ${output}`);
