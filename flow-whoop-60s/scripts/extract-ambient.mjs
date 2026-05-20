import { spawnSync } from "node:child_process";

const clips = [
  [88.0, 3.1, 0],
  [178.0, 7.0, 2.72],
  [515.0, 8.0, 9.25],
  [522.0, 7.4, 17.05],
  [89.0, 7.45, 23.85],
  [356.0, 8.95, 31.05],
  [517.0, 6.05, 39.45],
  [520.0, 7.2, 45.1],
  [704.0, 8.0, 52.0]
];

const filters = [];
for (let i = 0; i < clips.length; i += 1) {
  const [sourceStart, duration, timelineStart] = clips[i];
  const delay = Math.round(timelineStart * 1000);
  filters.push(
    `[0:a]atrim=start=${sourceStart}:duration=${duration},asetpts=PTS-STARTPTS,volume=0.34,afade=t=in:st=0:d=0.08,afade=t=out:st=${Math.max(
      0,
      duration - 0.18
    )}:d=0.18,adelay=${delay}|${delay}[a${i}]`
  );
}

filters.push(`${clips.map((_, i) => `[a${i}]`).join("")}amix=inputs=${clips.length}:duration=longest:normalize=0,atrim=duration=60[aout]`);

const result = spawnSync(
  "ffmpeg",
  [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-i",
    "assets/flow-source.mov",
    "-filter_complex",
    filters.join(";"),
    "-map",
    "[aout]",
    "-ar",
    "48000",
    "-ac",
    "2",
    "assets/flow-ambient.wav"
  ],
  { stdio: "inherit" }
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log("Wrote assets/flow-ambient.wav");
