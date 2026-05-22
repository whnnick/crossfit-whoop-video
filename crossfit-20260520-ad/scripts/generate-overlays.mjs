import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { HEIGHT, hudWindows, WIDTH } from "./timeline.mjs";

const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const outDir = "assets/overlays";
mkdirSync(outDir, { recursive: true });

const data = JSON.parse(readFileSync("../crossfit-whoop-ad/assets/whoop-data.json", "utf8"));
const metrics = data.video_metrics || {};
const workout = metrics.workout || {};
const recovery = metrics.recovery || {};
const cycle = metrics.cycle || {};
const sleep = [...(data.sleeps || [])].find((item) => item.score_state === "SCORED" && item.score) || null;

const strain = Number(workout.strain || cycle.strain || 0).toFixed(1);
const dayStrain = Number(cycle.strain || workout.strain || 0).toFixed(1);
const maxHr = Math.round(workout.max_heart_rate || cycle.max_heart_rate || 0);
const avgHr = Math.round(workout.average_heart_rate || cycle.average_heart_rate || 0);
const recoveryScore = Math.round(recovery.recovery_score || 0);
const sleepScore = Math.round(sleep?.score?.sleep_performance_percentage || 0);
const kcal = Math.round((workout.kilojoule || 0) * 0.239006);
const durationMinutes = workout.start && workout.end ? Math.round((Date.parse(workout.end) - Date.parse(workout.start)) / 60000) : 0;
const durationText = `${Math.floor(durationMinutes / 60)}:${String(durationMinutes % 60).padStart(2, "0")}`;
const zones = workout.zone_durations || {};

function minutes(ms = 0) {
  const total = Math.round(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function zoneRows(active = 4) {
  const rows = [
    ["ZONE 5", "172+ BPM", zones.zone_five_milli || 0, "#ff3b1f"],
    ["ZONE 4", "160-171 BPM", zones.zone_four_milli || 0, "#d98935"],
    ["ZONE 3", "147-159 BPM", zones.zone_three_milli || 0, "#46b57a"],
    ["ZONE 2", "135-146 BPM", zones.zone_two_milli || 0, "#3e94a8"],
    ["ZONE 1", "108-134 BPM", zones.zone_one_milli || 0, "#a8b5b9"]
  ];
  const total = rows.reduce((sum, row) => sum + row[2], 0) || 1;
  return rows
    .map(([name, range, ms, color], index) => {
      const pct = Math.round((ms / total) * 100);
      const width = Math.max(7, pct);
      const on = index <= active;
      return `<div class="zone ${on ? "on" : ""}">
        <div><b>${name}</b><span>${range}</span></div>
        <div class="zbar"><i style="width:${width}%;background:${color}"></i></div>
        <strong>${minutes(ms)}</strong>
      </div>`;
    })
    .join("");
}

function css() {
  return `
    html, body {
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      margin: 0;
      overflow: hidden;
      background: transparent;
      color: #f4f1e8;
      font-family: Arial, Helvetica, sans-serif;
    }
    .mono { font-family: Menlo, Consolas, monospace; font-weight: 800; letter-spacing: 0; }
    .scan {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, rgba(94,234,255,0.08), transparent 22%, transparent 78%, rgba(199,255,0,0.10)),
        repeating-linear-gradient(104deg, rgba(199,255,0,0.08) 0 2px, transparent 2px 42px),
        repeating-linear-gradient(0deg, rgba(244,241,232,0.035) 0 1px, transparent 1px 10px),
        radial-gradient(circle at 82% 56%, rgba(199,255,0,0.10), transparent 34%);
      mix-blend-mode: screen;
      opacity: 0.48;
      pointer-events: none;
    }
    .gridlines {
      position: absolute;
      inset: 94px;
      border: 2px solid rgba(199,255,0,0.18);
      background:
        linear-gradient(rgba(94,234,255,0.18), rgba(94,234,255,0.18)) 0 22% / 100% 2px no-repeat,
        linear-gradient(rgba(199,255,0,0.16), rgba(199,255,0,0.16)) 0 78% / 100% 2px no-repeat,
        linear-gradient(90deg, rgba(244,241,232,0.12), transparent 18%, transparent 82%, rgba(244,241,232,0.12));
      opacity: 0.52;
      pointer-events: none;
    }
    .gridlines::before,
    .gridlines::after {
      content: "";
      position: absolute;
      width: 150px;
      height: 150px;
      border-color: #c7ff00;
      border-style: solid;
      opacity: 0.86;
    }
    .gridlines::before { left: -2px; top: -2px; border-width: 10px 0 0 10px; }
    .gridlines::after { right: -2px; bottom: -2px; border-width: 0 10px 10px 0; }
    .tag {
      position: absolute;
      left: 150px;
      top: 300px;
      padding: 28px 42px;
      background: rgba(5, 7, 6, 0.62);
      border-left: 12px solid #c7ff00;
      border-top: 1px solid rgba(94,234,255,0.38);
      border-bottom: 1px solid rgba(244,241,232,0.18);
      color: #f4f1e8;
      font-size: 48px;
      line-height: 1;
      box-sizing: border-box;
    }
    .headline {
      position: absolute;
      left: 150px;
      top: 440px;
      width: 1750px;
      color: #f4f1e8;
      font-family: Arial Black, Impact, sans-serif;
      font-size: 190px;
      line-height: 0.92;
      text-transform: uppercase;
      text-shadow: 0 28px 90px rgba(0,0,0,0.42);
    }
    .glass {
      position: absolute;
      background: linear-gradient(135deg, rgba(238, 255, 249, 0.17), rgba(9, 18, 14, 0.40));
      border: 2px solid rgba(232, 255, 246, 0.28);
      box-shadow: 0 24px 74px rgba(0, 0, 0, 0.22), 0 0 62px rgba(199,255,0,0.16), inset 0 1px 0 rgba(244,241,232,0.24);
      box-sizing: border-box;
      backdrop-filter: blur(16px);
    }
    .glass::before {
      content: "";
      position: absolute;
      inset: 18px;
      border: 1px solid rgba(94,234,255,0.20);
      pointer-events: none;
    }
    .glass b, .value {
      display: block;
      font-family: Impact, Arial Black, sans-serif;
      font-weight: 900;
      letter-spacing: 0;
    }
    .label {
      color: rgba(244,241,232,0.76);
      font-size: 36px;
      margin-bottom: 18px;
    }
    .green { color: #c7ff00; }
    .cyan { color: #5eeaff; }
    .mini-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 32px;
      font-family: Menlo, Consolas, monospace;
      font-size: 29px;
      color: rgba(244,241,232,0.82);
    }
    .mini-row span {
      padding: 18px 20px;
      background: rgba(244,241,232,0.07);
      border: 1px solid rgba(94,234,255,0.20);
    }
    .left-card {
      left: 150px;
      width: 1110px;
      min-height: 310px;
      padding: 48px 58px;
      border-radius: 10px;
    }
    .left-card .value { font-size: 144px; line-height: 0.9; }
    .zones {
      right: 150px;
      top: 760px;
      width: 820px;
      min-height: 1130px;
      padding: 42px;
      border-radius: 10px;
    }
    .zones .top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 1px solid rgba(244,241,232,0.18);
      padding-bottom: 24px;
      margin-bottom: 26px;
    }
    .zones .top b { font-size: 46px; }
    .zone {
      display: grid;
      grid-template-columns: 210px 1fr 92px;
      gap: 20px;
      align-items: center;
      min-height: 120px;
      margin: 18px 0;
      padding: 20px 22px;
      background: rgba(244,241,232,0.06);
      border-radius: 24px;
      color: rgba(244,241,232,0.52);
    }
    .zone.on { color: rgba(244,241,232,0.92); }
    .zone b { font-family: Menlo, Consolas, monospace; font-size: 28px; }
    .zone span { display: block; margin-top: 9px; font-family: Menlo, Consolas, monospace; font-size: 21px; }
    .zone strong { font-family: Menlo, Consolas, monospace; font-size: 29px; text-align: right; }
    .zbar {
      height: 34px;
      background: repeating-linear-gradient(125deg, rgba(244,241,232,0.13) 0 10px, rgba(244,241,232,0.04) 10px 20px);
      border-radius: 8px;
      overflow: hidden;
    }
    .zbar i { display: block; height: 100%; border-radius: 8px; }
    .ticker {
      position: absolute;
      left: 92px;
      right: 92px;
      bottom: 92px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border-top: 2px solid rgba(244,241,232,0.24);
      border-bottom: 2px solid rgba(244,241,232,0.18);
      background: rgba(5,7,6,0.48);
    }
    .ticker div {
      padding: 34px 42px;
      border-right: 1px solid rgba(244,241,232,0.15);
      font-size: 34px;
    }
    .ticker b { color: #c7ff00; margin-left: 18px; }
    .compact {
      right: 110px;
      top: 2020px;
      width: 800px;
      padding: 40px 48px;
      border-left: 10px solid #c7ff00;
      border-radius: 8px;
    }
    .compact .value { font-size: 126px; line-height: 0.9; }
    .summary {
      left: 132px;
      right: 132px;
      bottom: 268px;
      min-height: 1000px;
      padding: 56px 64px;
      border-radius: 10px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: 42px;
      margin-top: 40px;
    }
    .summary .metric {
      min-height: 250px;
      padding: 36px 42px;
      background: rgba(244,241,232,0.055);
      border: 1px solid rgba(244,241,232,0.13);
      border-radius: 18px;
    }
    .summary .metric b { font-size: 118px; line-height: 0.88; }
    .summary .metric span { display: block; margin-top: 20px; font-size: 31px; color: rgba(244,241,232,0.72); }
    .broadcast-title {
      position: absolute;
      left: 118px;
      bottom: 650px;
      width: 1620px;
      font-family: Arial Black, Impact, sans-serif;
      font-size: 150px;
      line-height: 0.92;
      color: #fff;
      text-transform: uppercase;
      text-shadow: 0 22px 72px rgba(0,0,0,0.26);
    }
    .broadcast-copy {
      position: absolute;
      left: 126px;
      bottom: 545px;
      width: 1100px;
      font-size: 42px;
      line-height: 1.22;
      color: rgba(255,255,255,0.86);
    }
    .broadcast-card {
      left: 116px;
      right: 116px;
      bottom: 222px;
      min-height: 280px;
      padding: 44px 54px;
      border-radius: 8px;
      border-top: 10px solid #c7ff00;
    }
    .broadcast-card .metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 46px;
    }
    .broadcast-card span,
    .sidehud span,
    .summary-card span {
      display: block;
      color: rgba(244,241,232,0.76);
      font-family: Menlo, Consolas, monospace;
      font-size: 32px;
      margin-bottom: 14px;
    }
    .broadcast-card b {
      font-family: Impact, Arial Black, sans-serif;
      font-size: 96px;
      line-height: 0.9;
    }
    .livebar {
      height: 14px;
      margin-top: 34px;
      background: rgba(255,255,255,0.22);
      overflow: hidden;
    }
    .livebar i {
      display: block;
      height: 100%;
      background: linear-gradient(90deg, #c7ff00, #5eeaff);
      box-shadow: 0 0 28px rgba(199,255,0,0.68);
    }
    .sidehud {
      right: 110px;
      top: 560px;
      width: 760px;
      min-height: 1320px;
      padding: 58px 58px;
      border-radius: 26px;
    }
    .sidehud h1 {
      margin: 0 0 38px;
      font-size: 58px;
      line-height: 1;
      color: #fff;
      font-family: Arial Black, Impact, sans-serif;
    }
    .sidehud .hr {
      font-family: Impact, Arial Black, sans-serif;
      color: #5eeaff;
      font-size: 168px;
      line-height: 0.9;
      margin: 28px 0 22px;
      text-shadow: 0 0 40px rgba(94,234,255,0.34);
    }
    .sidehud .block {
      margin-top: 48px;
      padding-top: 42px;
      border-top: 2px solid rgba(255,255,255,0.18);
    }
    .sidehud .big {
      font-family: Impact, Arial Black, sans-serif;
      font-size: 88px;
      line-height: 0.92;
      color: #fff;
    }
    .side-title {
      position: absolute;
      left: 126px;
      bottom: 270px;
      color: #fff;
      font-family: Arial Black, Impact, sans-serif;
      font-size: 132px;
      line-height: 0.95;
      text-transform: uppercase;
      text-shadow: 0 18px 64px rgba(0,0,0,0.28);
    }
    .summary-card {
      left: 132px;
      right: 132px;
      bottom: 340px;
      min-height: 930px;
      padding: 62px 68px;
      border-radius: 18px;
      background: linear-gradient(135deg, rgba(238,255,249,0.18), rgba(5,10,8,0.50));
      border-top: 28px solid rgba(199,255,0,0.82);
    }
    .summary-card h1 {
      margin: 0 0 42px;
      font-family: Arial Black, Impact, sans-serif;
      color: #fff;
      font-size: 94px;
      line-height: 0.96;
      text-transform: uppercase;
    }
    .summary-card .summary-metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
      margin-top: 36px;
    }
    .summary-card .tile {
      min-height: 220px;
      padding: 34px 32px;
      border: 1px solid rgba(255,255,255,0.16);
      background: rgba(255,255,255,0.07);
      box-sizing: border-box;
    }
    .summary-card b {
      font-family: Impact, Arial Black, sans-serif;
      font-size: 106px;
      line-height: 0.88;
    }
  `;
}

function page(body) {
  const ticker = `<div class="ticker mono">
    <div>WHOOP LIVE <b>ON</b></div>
    <div>HR <b>${avgHr}</b></div>
    <div>STRAIN <b>${strain}</b></div>
    <div>RECOVERY <b>${recoveryScore}%</b></div>
  </div>`;
  return `<!doctype html><html><head><style>${css()}</style></head><body><div class="scan"></div><div class="gridlines"></div>${body}${ticker}</body></html>`;
}

const pages = {
  "startup-1": page(`<div class="tag mono">WHOOP LIVE TRAINING BROADCAST</div><div class="broadcast-title">EVERY REP<br>HAS A SIGNAL</div><div class="broadcast-copy">Heart rate, strain, recovery and output move with the athlete in real time.</div><div class="glass broadcast-card"><div class="metrics"><div><span>HR</span><b class="green">${Math.max(100, avgHr - 6)}</b></div><div><span>STRAIN</span><b>${strain}</b></div><div><span>RECOVERY</span><b class="green">${recoveryScore}%</b></div></div><div class="livebar"><i style="width:42%"></i></div></div>`),
  "startup-2": page(`<div class="tag mono">WHOOP LIVE TRAINING BROADCAST</div><div class="broadcast-title">EVERY REP<br>HAS A SIGNAL</div><div class="broadcast-copy">Live output locks onto the session as the pace rises.</div><div class="glass broadcast-card"><div class="metrics"><div><span>HR</span><b class="green">${avgHr}</b></div><div><span>SLEEP</span><b>${sleepScore || "--"}%</b></div><div><span>CAL</span><b class="green">${kcal}</b></div></div><div class="livebar"><i style="width:67%"></i></div></div>`),
  "startup-3": page(`<div class="tag mono">WHOOP LIVE TRAINING BROADCAST</div><div class="broadcast-title">OUTPUT<br>YOU CAN FEEL</div><div class="broadcast-copy">A brighter cinematic HUD, built for short data hits instead of full-screen darkness.</div><div class="glass broadcast-card"><div class="metrics"><div><span>HR</span><b class="green">${Math.max(avgHr, maxHr - 30)}</b></div><div><span>DAY STRAIN</span><b>${dayStrain}</b></div><div><span>DURATION</span><b class="green">${durationText}</b></div></div><div class="livebar"><i style="width:88%"></i></div></div>`),
  "hr-1": page(`<div class="glass sidehud"><h1>LIVE OUTPUT</h1><span>HEART RATE</span><div class="hr">${Math.max(100, maxHr - 35)}<small style="font-size:44px;color:#fff"> BPM</small></div><div class="livebar"><i style="width:42%"></i></div><div class="block"><span>LOAD</span><div class="big green">RAMP</div></div><div class="block"><span>CALORIES</span><div class="big">${kcal}</div></div></div><div class="side-title">DATA<br>RIDES WITH<br>THE FRAME</div>`),
  "hr-2": page(`<div class="glass sidehud"><h1>LIVE OUTPUT</h1><span>HEART RATE</span><div class="hr">${Math.max(110, maxHr - 21)}<small style="font-size:44px;color:#fff"> BPM</small></div><div class="livebar"><i style="width:62%"></i></div><div class="block"><span>LOAD</span><div class="big green">HIGH</div></div><div class="block"><span>STRAIN</span><div class="big">${strain}</div></div></div><div class="side-title">DATA<br>RIDES WITH<br>THE FRAME</div>`),
  "hr-3": page(`<div class="glass sidehud"><h1>LIVE OUTPUT</h1><span>REDLINE NEAR</span><div class="hr">${Math.max(120, maxHr - 9)}<small style="font-size:44px;color:#fff"> BPM</small></div><div class="livebar"><i style="width:82%"></i></div><div class="block"><span>ZONE</span><div class="big green">4</div></div><div class="block"><span>RECOVERY</span><div class="big">${recoveryScore}%</div></div></div><div class="side-title">DATA<br>RIDES WITH<br>THE FRAME</div>`),
  "hr-4": page(`<div class="glass sidehud"><h1>LIVE OUTPUT</h1><span>MAX HR CAPTURED</span><div class="hr">${maxHr}<small style="font-size:44px;color:#fff"> BPM</small></div><div class="livebar"><i style="width:96%"></i></div><div class="block"><span>PEAK</span><div class="big green">LOCKED</div></div><div class="block"><span>DURATION</span><div class="big">${durationText}</div></div></div><div class="side-title">DATA<br>RIDES WITH<br>THE FRAME</div>`),
  "fatigue": page(`<div class="tag mono">FATIGUE DETECTED</div>`),
  "summary-1": page(`<div class="glass summary-card"><span>SESSION SUMMARY</span><h1>TRAIN WHERE<br>THE DATA SAYS GO</h1><div class="summary-metrics"><div class="tile"><span>STRAIN</span><b class="green">${strain}</b></div></div></div>`),
  "summary-2": page(`<div class="glass summary-card"><span>SESSION SUMMARY</span><h1>TRAIN WHERE<br>THE DATA SAYS GO</h1><div class="summary-metrics"><div class="tile"><span>STRAIN</span><b class="green">${strain}</b></div><div class="tile"><span>MAX HR</span><b>${maxHr}</b></div></div></div>`),
  "summary-3": page(`<div class="glass summary-card"><span>SESSION SUMMARY</span><h1>TRAIN WHERE<br>THE DATA SAYS GO</h1><div class="summary-metrics"><div class="tile"><span>STRAIN</span><b class="green">${strain}</b></div><div class="tile"><span>MAX HR</span><b>${maxHr}</b></div><div class="tile"><span>CAL</span><b>${kcal}</b></div></div></div>`),
  "summary-4": page(`<div class="glass summary-card"><span>SESSION SUMMARY</span><h1>TRAIN WHERE<br>THE DATA SAYS GO</h1><div class="summary-metrics"><div class="tile"><span>DURATION</span><b class="green">${durationText}</b></div><div class="tile"><span>CAL</span><b>${kcal}</b></div><div class="tile"><span>AVG HR</span><b>${avgHr}</b></div><div class="tile"><span>MAX HR</span><b class="green">${maxHr}</b></div><div class="tile"><span>RECOVERY</span><b>${recoveryScore}%</b></div><div class="tile"><span>SLEEP</span><b>${sleepScore || "--"}%</b></div></div></div>`)
};

for (const [name, html] of Object.entries(pages)) {
  const htmlPath = `${outDir}/${name}.html`;
  const pngPath = `${outDir}/${name}.png`;
  writeFileSync(htmlPath, html);
  const result = spawnSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--disable-extensions",
      "--hide-scrollbars",
      "--no-sandbox",
      "--user-data-dir=/private/tmp/crossfit-20260520-chrome-overlay-profile",
      "--default-background-color=00000000",
      `--window-size=${WIDTH},${HEIGHT}`,
      `--screenshot=${pngPath}`,
      pathToFileURL(`${process.cwd()}/${htmlPath}`).href
    ],
    { stdio: "inherit" }
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
}

writeFileSync(`${outDir}/windows.json`, JSON.stringify(hudWindows, null, 2));
console.log("Wrote WHOOP overlay PNGs");
