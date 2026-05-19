import fs from "node:fs";
import path from "node:path";

export const PROJECT_ROOT = path.resolve(new URL("..", import.meta.url).pathname);
export const TOKEN_PATH = path.join(PROJECT_ROOT, ".whoop-token.json");
export const DATA_PATH = path.join(PROJECT_ROOT, "assets", "whoop-data.json");
export const DATA_JS_PATH = path.join(PROJECT_ROOT, "assets", "whoop-data.js");

export function loadEnv() {
  const envPath = path.join(PROJECT_ROOT, ".env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      value = value.replace(/^["']|["']$/g, "");
      if (!(key in process.env)) process.env[key] = value;
    }
  }
  return process.env;
}

export function requiredEnv(names) {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}. Copy .env.example to .env and fill them in.`);
  }
}

export function readToken() {
  if (!fs.existsSync(TOKEN_PATH)) return null;
  return JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
}

export function writeToken(token) {
  const expiresAt = token.expires_in
    ? Date.now() + Number(token.expires_in) * 1000 - 60_000
    : token.expires_at;
  fs.writeFileSync(TOKEN_PATH, JSON.stringify({ ...token, expires_at: expiresAt }, null, 2));
}
