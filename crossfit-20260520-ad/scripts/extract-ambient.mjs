import { spawnSync } from "node:child_process";
import { timelineClips, totalDuration } from "./timeline.mjs";

const inputs = [];
const sourceIndex = new Map();
for (const clip of timelineClips()) {
  const source = `assets/source/${clip.source}`;
  if (!sourceIndex.has(source)) {
    sourceIndex.set(source, sourceIndex.size);
    inputs.push("-i", source);
  }
}

const filters = [];
for (const [i, clip] of timelineClips().entries()) {
  const input = sourceIndex.get(`assets/source/${clip.source}`);
  const inputDuration = Number((clip.duration * clip.speed).toFixed(3));
  const delay = Math.round(clip.timelineStart * 1000);
  const atempo = clip.speed === 1 ? "" : `,atempo=${clip.speed}`;
  filters.push(
    `[${input}:a]atrim=start=${clip.start}:duration=${inputDuration},asetpts=PTS-STARTPTS${atempo},volume=0.34,afade=t=in:st=0:d=0.06,afade=t=out:st=${Math.max(
      0,
      clip.duration - 0.16
    ).toFixed(3)}:d=0.16,adelay=${delay}|${delay}[a${i}]`
  );
}
filters.push(`${timelineClips().map((_, i) => `[a${i}]`).join("")}amix=inputs=${timelineClips().length}:duration=longest:normalize=0,atrim=duration=${totalDuration()}[aout]`);

const result = spawnSync(
  "ffmpeg",
  ["-y", "-hide_banner", "-loglevel", "error", ...inputs, "-filter_complex", filters.join(";"), "-map", "[aout]", "-ar", "48000", "-ac", "2", "assets/ambient.wav"],
  { stdio: "inherit" }
);
if (result.status !== 0) process.exit(result.status ?? 1);
