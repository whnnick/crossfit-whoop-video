import { writeFileSync } from "node:fs";

const sampleRate = 48000;
const channels = 2;
const duration = 60;
const samples = sampleRate * duration;
const data = new Int16Array(samples * channels);
const transitionHits = [0, 2.85, 9.25, 17.15, 24.0, 31.1, 39.55, 45.2, 52.0, 56.7];

function frac(value) {
  return value - Math.floor(value);
}

function noise(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return frac(x) * 2 - 1;
}

function env(time, start, length) {
  if (time < start || time > start + length) return 0;
  const x = (time - start) / length;
  return Math.pow(1 - x, 3);
}

function ramp(time, start, length) {
  if (time < start || time > start + length) return 0;
  return (time - start) / length;
}

function clip(value) {
  return Math.max(-1, Math.min(1, value));
}

for (let i = 0; i < samples; i += 1) {
  const t = i / sampleRate;
  const bar = t % 2;
  const half = t % 0.5;
  const quarter = t % 0.25;

  const kick = Math.sin(2 * Math.PI * (48 + 28 * env(t, t - half, 0.18)) * t) * Math.exp(-half * 18) * (half < 0.18 ? 0.95 : 0);
  const snareWindow = Math.abs(bar - 1.0) < 0.07 ? 1 - Math.abs(bar - 1.0) / 0.07 : 0;
  const snare = noise(i) * snareWindow * 0.34;
  const hat = noise(i * 2.1) * Math.exp(-quarter * 34) * (quarter < 0.055 ? 0.14 : 0);
  const bassStep = Math.floor(t * 2) % 8;
  const bassFreq = [55, 55, 65.4, 49, 55, 73.4, 65.4, 49][bassStep];
  const bass = Math.sin(2 * Math.PI * bassFreq * t) * 0.26;
  const pulse = Math.sin(2 * Math.PI * 110 * t) * 0.08 * (half < 0.09 ? 1 : 0);

  let riser = 0;
  for (const start of [0.0, 27.0, 43.0, 54.0]) {
    const r = ramp(t, start, 3.0);
    riser += noise(i * 0.57) * r * r * 0.12;
    riser += Math.sin(2 * Math.PI * (240 + r * 940) * t) * r * 0.06;
  }

  let impact = 0;
  for (const hit of transitionHits) {
    impact += Math.sin(2 * Math.PI * 58 * t) * env(t, hit, 0.38) * 1.1;
    impact += noise(i * 1.37) * env(t, hit, 0.18) * 0.28;
  }

  const arrangement = t < 3 ? 0.85 : t < 17 ? 0.92 : t < 39 ? 0.98 : t < 52 ? 1.08 : 0.92;
  const fadeIn = Math.min(1, t / 0.35);
  const fadeOut = Math.min(1, (duration - t) / 1.2);
  const master = 0.62 * fadeIn * fadeOut;
  const sample = clip((kick + snare + hat + bass + pulse + riser + impact) * arrangement * master);
  const side = Math.sin(2 * Math.PI * 0.17 * t) * 0.08;

  data[i * channels] = Math.round(clip(sample * (1 - side)) * 32767);
  data[i * channels + 1] = Math.round(clip(sample * (1 + side)) * 32767);
}

const byteRate = sampleRate * channels * 2;
const blockAlign = channels * 2;
const dataBytes = data.length * 2;
const buffer = Buffer.alloc(44 + dataBytes);

buffer.write("RIFF", 0);
buffer.writeUInt32LE(36 + dataBytes, 4);
buffer.write("WAVE", 8);
buffer.write("fmt ", 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(channels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(byteRate, 28);
buffer.writeUInt16LE(blockAlign, 32);
buffer.writeUInt16LE(16, 34);
buffer.write("data", 36);
buffer.writeUInt32LE(dataBytes, 40);

for (let i = 0; i < data.length; i += 1) {
  buffer.writeInt16LE(data[i], 44 + i * 2);
}

writeFileSync("assets/flow-sport-beat.wav", buffer);
console.log("Wrote assets/flow-sport-beat.wav");
