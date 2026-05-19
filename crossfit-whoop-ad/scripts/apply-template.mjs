import fs from "node:fs";
import path from "node:path";
import { PROJECT_ROOT } from "./whoop-env.mjs";

const CONFIG_PATH = path.join(PROJECT_ROOT, "template.config.json");
const CONFIG_JS_PATH = path.join(PROJECT_ROOT, "assets", "template-config.js");

function readConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`Missing template config: ${CONFIG_PATH}`);
  }
  return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
}

function ensureParent(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function resolveProjectPath(value) {
  if (!value) return "";
  return path.isAbsolute(value) ? value : path.join(PROJECT_ROOT, value);
}

function linkConfiguredSource(slot) {
  if (!slot?.source || !slot?.src) return;
  const source = resolveProjectPath(slot.source);
  const destination = resolveProjectPath(slot.src);
  if (!fs.existsSync(source)) throw new Error(`Media source not found: ${source}`);
  ensureParent(destination);
  if (fs.existsSync(destination) || fs.lstatSync(path.dirname(destination))) {
    try {
      if (fs.existsSync(destination)) fs.unlinkSync(destination);
      fs.symlinkSync(source, destination);
    } catch (error) {
      throw new Error(`Could not link ${source} -> ${destination}: ${error.message}`);
    }
  }
}

function validateConfig(config) {
  const width = Number(config.format?.width);
  const height = Number(config.format?.height);
  const duration = Number(config.format?.duration);
  if (!width || !height || !duration) {
    throw new Error("format.width, format.height, and format.duration must be set.");
  }
  for (const key of ["videoA", "videoB", "audio"]) {
    if (!config.media?.[key]?.src) throw new Error(`media.${key}.src must be set.`);
  }
}

const config = readConfig();
validateConfig(config);
for (const slot of Object.values(config.media || {})) linkConfiguredSource(slot);
ensureParent(CONFIG_JS_PATH);
fs.writeFileSync(CONFIG_JS_PATH, `window.__TEMPLATE_CONFIG__ = ${JSON.stringify(config, null, 2)};\n`);
console.log(`Template config written to ${CONFIG_JS_PATH}`);
console.log(`Output target: ${config.format.output}`);
