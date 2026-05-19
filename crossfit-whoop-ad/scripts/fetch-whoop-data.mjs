import fs from "node:fs";
import { DATA_JS_PATH, DATA_PATH, loadEnv, readToken, requiredEnv, writeToken } from "./whoop-env.mjs";

loadEnv();

const API_BASE = "https://api.prod.whoop.com/developer";
const TOKEN_URL = "https://api.prod.whoop.com/oauth/oauth2/token";
const lookbackDays = Number(process.env.WHOOP_LOOKBACK_DAYS || 30);
const end = new Date();
const start = new Date(end.getTime() - lookbackDays * 24 * 60 * 60 * 1000);

async function refreshTokenIfNeeded(token) {
  if (!token) throw new Error("No .whoop-token.json found. Run `npm run whoop:auth` first.");
  if (token.expires_at && token.expires_at > Date.now()) return token;
  if (!token.refresh_token) throw new Error("Token expired and no refresh_token is available. Run `npm run whoop:auth` again.");

  requiredEnv(["WHOOP_CLIENT_ID", "WHOOP_CLIENT_SECRET"]);
  const bodyParams = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: token.refresh_token,
    client_id: process.env.WHOOP_CLIENT_ID,
    client_secret: process.env.WHOOP_CLIENT_SECRET,
    scope: process.env.WHOOP_SCOPES || "offline",
  });
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: bodyParams,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Token refresh failed ${response.status}: ${JSON.stringify(body)}`);
  writeToken(body);
  return body;
}

async function api(path, token, params = {}) {
  const url = new URL(`${API_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value);
  }
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    return { error: true, status: response.status, body };
  }
  return body;
}

async function collection(path, token) {
  const records = [];
  let nextToken;
  do {
    const page = await api(path, token, {
      limit: 25,
      start: start.toISOString(),
      end: end.toISOString(),
      nextToken,
    });
    if (page?.error) return page;
    records.push(...(page.records || []));
    nextToken = page.next_token || page.nextToken;
  } while (nextToken);
  return records;
}

function latestScored(records) {
  return (Array.isArray(records) ? records : [])
    .filter((item) => item.score_state === "SCORED" || item.score)
    .sort((a, b) => Date.parse(b.start || b.created_at || 0) - Date.parse(a.start || a.created_at || 0))[0] || null;
}

function videoMetrics({ workouts, recoveries, cycles, body }) {
  const workout = latestScored(workouts);
  const recovery = latestScored(recoveries);
  const cycle = latestScored(cycles);
  const workoutScore = workout?.score || {};
  const recoveryScore = recovery?.score || {};
  const cycleScore = cycle?.score || {};
  return {
    generated_at: new Date().toISOString(),
    source_note: "WHOOP API exposes processed workout/recovery/cycle metrics, not continuous raw real-time heart-rate samples.",
    workout: workout
      ? {
          id: workout.id,
          sport_name: workout.sport_name,
          start: workout.start,
          end: workout.end,
          strain: workoutScore.strain,
          average_heart_rate: workoutScore.average_heart_rate,
          max_heart_rate: workoutScore.max_heart_rate,
          kilojoule: workoutScore.kilojoule,
          percent_recorded: workoutScore.percent_recorded,
          zone_durations: workoutScore.zone_durations,
        }
      : null,
    recovery: recovery
      ? {
          recovery_score: recoveryScore.recovery_score,
          resting_heart_rate: recoveryScore.resting_heart_rate,
          hrv_rmssd_milli: recoveryScore.hrv_rmssd_milli,
          spo2_percentage: recoveryScore.spo2_percentage,
          skin_temp_celsius: recoveryScore.skin_temp_celsius,
        }
      : null,
    cycle: cycle
      ? {
          start: cycle.start,
          end: cycle.end,
          strain: cycleScore.strain,
          average_heart_rate: cycleScore.average_heart_rate,
          max_heart_rate: cycleScore.max_heart_rate,
        }
      : null,
    body_measurement: body?.error ? null : body,
  };
}

const token = await refreshTokenIfNeeded(readToken());
const [profile, body, cycles, recoveries, workouts, sleeps] = await Promise.all([
  api("/v2/user/profile/basic", token),
  api("/v2/user/measurement/body", token),
  collection("/v2/cycle", token),
  collection("/v2/recovery", token),
  collection("/v2/activity/workout", token),
  collection("/v2/activity/sleep", token),
]);

const output = {
  fetched_at: new Date().toISOString(),
  range: { start: start.toISOString(), end: end.toISOString(), lookback_days: lookbackDays },
  profile,
  body_measurement: body,
  cycles,
  recoveries,
  workouts,
  sleeps,
  video_metrics: videoMetrics({ workouts, recoveries, cycles, body }),
};

fs.mkdirSync(new URL("../assets/", import.meta.url), { recursive: true });
fs.writeFileSync(DATA_PATH, JSON.stringify(output, null, 2));
fs.writeFileSync(DATA_JS_PATH, `window.__WHOOP_DATA__ = ${JSON.stringify(output, null, 2)};\n`);
console.log(`WHOOP data written to ${DATA_PATH}`);
console.log(`WHOOP data script written to ${DATA_JS_PATH}`);
console.log(JSON.stringify(output.video_metrics, null, 2));
