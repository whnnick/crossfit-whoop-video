import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { hudWindows, OUTPUT_DURATION, timelineClips, totalDuration, transitionTimes } from "./timeline.mjs";

mkdirSync("renders", { recursive: true });

const listPath = join(tmpdir(), "crossfit-20260520-concat.txt");
writeFileSync(listPath, timelineClips().map((clip) => `file '${process.cwd()}/assets/clips/${clip.id}.mp4'`).join("\n"));

const base = "assets/base-cut.mp4";
let result = spawnSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", listPath, "-c", "copy", base], {
  stdio: "inherit"
});
if (result.status !== 0) process.exit(result.status ?? 1);

const overlayNames = [
  ...hudWindows.startup.map((_, i) => `startup-${i + 1}`),
  ...hudWindows.heartRate.map((_, i) => `hr-${i + 1}`),
  ...hudWindows.fatigue.map((_, i) => (i === 0 ? "fatigue" : `fatigue-${i + 1}`)),
  ...hudWindows.summary.map((_, i) => `summary-${i + 1}`)
];
const overlayWindows = [...hudWindows.startup, ...hudWindows.heartRate, ...hudWindows.fatigue, ...hudWindows.summary];

const duration = Math.min(OUTPUT_DURATION, totalDuration());
const inputs = [
  "-i",
  base,
  "-i",
  "assets/music-bed.wav",
  "-i",
  "assets/ambient.wav",
  "-i",
  "assets/sfx.wav"
];
for (const name of overlayNames) inputs.push("-i", `assets/overlays/${name}.png`);

let videoChain = "[0:v]eq=contrast=1.12:saturation=1.05:brightness=0.02,vignette=PI/8,noise=alls=2:allf=t+u,";
for (const t of transitionTimes) {
  videoChain += `drawbox=x=0:y=0:w=iw:h=ih:color=white@0.20:t=fill:enable='between(t,${t.toFixed(3)},${(t + 0.055).toFixed(3)})',`;
  videoChain += `drawbox=x=0:y=0:w=iw:h=ih:color=0xff3b1f@0.14:t=fill:enable='between(t,${t.toFixed(3)},${(t + 0.16).toFixed(3)})',`;
  videoChain += `drawbox=x=0:y=0:w=iw:h=ih*0.10:color=black@0.30:t=fill:enable='between(t,${t.toFixed(3)},${(t + 0.22).toFixed(3)})',`;
  videoChain += `drawbox=x=0:y=ih*0.90:w=iw:h=ih*0.10:color=black@0.30:t=fill:enable='between(t,${t.toFixed(3)},${(t + 0.22).toFixed(3)})',`;
}
videoChain = `${videoChain.replace(/,$/, "")}[vflash]`;

let previous = "[vflash]";
const overlayFilters = [];
for (let i = 0; i < overlayNames.length; i += 1) {
  const inputIndex = 4 + i;
  const [start, end] = overlayWindows[i];
  const output = i === overlayNames.length - 1 ? "[vover]" : `[v${i}]`;
  overlayFilters.push(`${previous}[${inputIndex}:v]overlay=0:0:enable='between(t,${start},${end})'${output}`);
  previous = output;
}

const filter = [
  videoChain,
  ...overlayFilters,
  `[vover]fade=t=in:st=0:d=1.1,fade=t=out:st=${Math.max(0, duration - 1.45).toFixed(3)}:d=1.45[vout]`,
  "[1:a]volume=0.82[a1]",
  "[2:a]volume=0.58[a2]",
  "[3:a]volume=0.85[a3]",
  `[a1][a2][a3]amix=inputs=3:duration=first:normalize=0,atrim=duration=${duration},afade=t=in:st=0:d=1.1,afade=t=out:st=${Math.max(0, duration - 1.6).toFixed(3)}:d=1.6[aout]`
].join(";");

result = spawnSync(
  "ffmpeg",
  [
    "-y",
    "-hide_banner",
    ...inputs,
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
    "-t",
    String(duration),
    "renders/crossfit-20260520-ad-vertical-4k-whoop-v2-airbike-50s.mp4"
  ],
  { stdio: "inherit" }
);
if (result.status !== 0) process.exit(result.status ?? 1);
