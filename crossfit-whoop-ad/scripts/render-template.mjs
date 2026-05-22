import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { PROJECT_ROOT } from "./whoop-env.mjs";

const configPath = path.join(PROJECT_ROOT, "template.config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const output = config.format?.output || "renders/crossfit-whoop-video-template.mp4";

await new Promise((resolve, reject) => {
  const apply = spawn(process.execPath, ["scripts/apply-template.mjs"], {
    cwd: PROJECT_ROOT,
    stdio: "inherit",
  });
  apply.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`template apply failed with ${code}`))));
});

await new Promise((resolve, reject) => {
  const render = spawn("npx", ["--yes", "hyperframes@0.6.22", "render", "--output", output, "--quality", "standard"], {
    cwd: PROJECT_ROOT,
    stdio: "inherit",
  });
  render.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`render failed with ${code}`))));
});
