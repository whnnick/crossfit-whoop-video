import { writeFileSync } from "node:fs";

const sampleRate = 48000;
const channels = 2;
const duration = 60;
const samples = sampleRate * duration;
const data = new Int16Array(samples * channels);
const bpm = 96;
const beatLength = 60 / bpm;
const transitionHits = [0, 2.85, 9.25, 17.15, 24.0, 31.1, 39.55, 45.2, 52.0, 56.7];

function frac(value) {
  return value - Math.floor(value);
}

function noise(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return frac(x) * 2 - 1;
}

function decay(time, start, length, power = 3) {
  if (time < start || time > start + length) return 0;
  return Math.pow(1 - (time - start) / length, power);
}

function attackRelease(time, start, length) {
  if (time < start || time > start + length) return 0;
  const x = (time - start) / length;
  return Math.sin(Math.PI * x);
}

function clip(value) {
  return Math.max(-1, Math.min(1, value));
}

for (let i = 0; i < samples; i += 1) {
  const t = i / sampleRate;
  const beat = t % beatLength;
  const twoBeat = t % (beatLength * 2);
  const eightBeat = t % (beatLength * 8);

  const sectionLift = t < 9 ? 0.64 : t < 24 ? 0.76 : t < 39 ? 0.82 : t < 52 ? 0.92 : 0.74;
  const kickEnv = decay(t, t - beat, 0.28, 4);
  const kickFreq = 42 + 34 * kickEnv;
  const kick = Math.sin(2 * Math.PI * kickFreq * t) * kickEnv * 0.72;

  const lowPulseEnv = twoBeat < 0.18 ? Math.exp(-twoBeat * 6.5) : 0;
  const lowPulse = Math.sin(2 * Math.PI * 64 * t) * lowPulseEnv * 0.2;

  const tomA = Math.sin(2 * Math.PI * 87 * t) * decay(t, t - (eightBeat - beatLength * 3), 0.36, 3) * 0.2;
  const tomB = Math.sin(2 * Math.PI * 73 * t) * decay(t, t - (eightBeat - beatLength * 7), 0.4, 3) * 0.22;

  const clapWindow = Math.abs(twoBeat - beatLength) < 0.035 ? 1 - Math.abs(twoBeat - beatLength) / 0.035 : 0;
  const clap = noise(i * 1.7) * clapWindow * 0.12;

  const hatWindow = beat < 0.035 ? Math.exp(-beat * 30) : 0;
  const hat = noise(i * 2.3) * hatWindow * 0.035;

  const drone = Math.sin(2 * Math.PI * 55 * t) * 0.08 + Math.sin(2 * Math.PI * 110 * t) * 0.035;
  const pad = Math.sin(2 * Math.PI * 146.83 * t) * 0.025 * attackRelease(t, 0, duration);

  let impact = 0;
  for (const hit of transitionHits) {
    impact += Math.sin(2 * Math.PI * 48 * t) * decay(t, hit, 0.42, 3) * 0.54;
    impact += noise(i * 0.91) * decay(t, hit, 0.22, 4) * 0.11;
  }

  let riser = 0;
  for (const start of [36.8, 52.8]) {
    const r = attackRelease(t, start, 2.6);
    riser += noise(i * 0.31) * r * 0.045;
    riser += Math.sin(2 * Math.PI * (180 + 280 * r) * t) * r * 0.035;
  }

  const fadeIn = Math.min(1, t / 0.55);
  const fadeOut = Math.min(1, (duration - t) / 1.4);
  const master = 0.58 * sectionLift * fadeIn * fadeOut;
  const sample = clip((kick + lowPulse + tomA + tomB + clap + hat + drone + pad + impact + riser) * master);
  const pan = Math.sin(2 * Math.PI * 0.09 * t) * 0.05;

  data[i * channels] = Math.round(clip(sample * (1 - pan)) * 32767);
  data[i * channels + 1] = Math.round(clip(sample * (1 + pan)) * 32767);
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

writeFileSync("assets/flow-sport-bed.wav", buffer);
console.log("Wrote assets/flow-sport-bed.wav");
