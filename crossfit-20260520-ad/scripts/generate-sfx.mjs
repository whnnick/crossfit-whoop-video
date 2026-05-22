import { writeFileSync } from "node:fs";
import { totalDuration, transitionTimes } from "./timeline.mjs";

const sampleRate = 48000;
const channels = 2;
const duration = totalDuration();
const samples = Math.ceil(sampleRate * duration);
const data = new Int16Array(samples * channels);
const fallHit = 39.5;
const hits = [...transitionTimes, fallHit, 49.2, 55.4];

function frac(value) {
  return value - Math.floor(value);
}

function noise(seed) {
  return frac(Math.sin(seed * 12.9898) * 43758.5453) * 2 - 1;
}

function env(t, start, length, power = 3) {
  if (t < start || t > start + length) return 0;
  return Math.pow(1 - (t - start) / length, power);
}

function rise(t, start, length) {
  if (t < start || t > start + length) return 0;
  const x = (t - start) / length;
  return x * x;
}

function clip(value) {
  return Math.max(-1, Math.min(1, value));
}

for (let i = 0; i < samples; i += 1) {
  const t = i / sampleRate;
  let sample = 0;
  for (const hit of hits) {
    sample += Math.sin(2 * Math.PI * 52 * t) * env(t, hit, 0.34, 3) * 0.42;
    sample += noise(i * 0.83) * env(t, hit - 0.18, 0.2, 2) * 0.075;
  }
  for (const start of [13.9, 22.6, 35.8, 44.0, 48.0]) {
    const r = rise(t, start, 1.0);
    sample += noise(i * 0.24) * r * 0.045;
    sample += Math.sin(2 * Math.PI * (160 + 420 * r) * t) * r * 0.035;
  }
  sample += Math.sin(2 * Math.PI * 92 * t) * env(t, fallHit, 0.42, 2) * 0.16;
  sample += noise(i * 2.4) * env(t, fallHit, 0.18, 5) * 0.075;

  data[i * channels] = Math.round(clip(sample) * 32767);
  data[i * channels + 1] = Math.round(clip(sample * 0.95) * 32767);
}

const byteRate = sampleRate * channels * 2;
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
buffer.writeUInt16LE(channels * 2, 32);
buffer.writeUInt16LE(16, 34);
buffer.write("data", 36);
buffer.writeUInt32LE(dataBytes, 40);
for (let i = 0; i < data.length; i += 1) buffer.writeInt16LE(data[i], 44 + i * 2);
writeFileSync("assets/sfx.wav", buffer);
