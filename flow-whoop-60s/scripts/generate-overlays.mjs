import { mkdirSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const dir = "assets/overlays";
mkdirSync(dir, { recursive: true });

const css = `
  html, body {
    width: 2160px;
    height: 3840px;
    margin: 0;
    overflow: hidden;
    background: transparent;
    font-family: Arial, Helvetica, sans-serif;
  }
  .card {
    position: absolute;
    width: 620px;
    min-height: 278px;
    padding: 36px 40px 34px 54px;
    background: rgba(5, 7, 6, 0.92);
    border: 2px solid rgba(244, 241, 232, 0.2);
    border-left: 12px solid #c7ff00;
    box-shadow: 0 28px 80px rgba(0, 0, 0, 0.48);
    box-sizing: border-box;
  }
  .kicker {
    color: #c7ff00;
    font-family: Menlo, Consolas, monospace;
    font-size: 34px;
    font-weight: 700;
  }
  .value {
    margin-top: 20px;
    color: #f4f1e8;
    font-family: Impact, Arial Black, sans-serif;
    font-size: 128px;
    line-height: 0.82;
  }
  .label {
    margin-top: 16px;
    color: rgba(244, 241, 232, 0.84);
    font-family: Menlo, Consolas, monospace;
    font-size: 30px;
    font-weight: 700;
  }
  .main {
    position: absolute;
    left: 1210px;
    top: 1120px;
    width: 880px;
    height: 1030px;
    padding: 54px 54px 46px 68px;
    background: rgba(5, 7, 6, 0.97);
    border: 2px solid rgba(199, 255, 0, 0.72);
    border-left: 14px solid #c7ff00;
    box-shadow: 0 34px 110px rgba(0, 0, 0, 0.62), 0 0 76px rgba(199, 255, 0, 0.24);
    box-sizing: border-box;
  }
  .main .kicker { font-size: 36px; }
  .strain {
    margin-top: 34px;
    color: #f4f1e8;
    font-family: Impact, Arial Black, sans-serif;
    font-size: 204px;
    line-height: 0.72;
  }
  .subtitle {
    margin-top: 28px;
    color: #c7ff00;
    font-family: Impact, Arial Black, sans-serif;
    font-size: 58px;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 34px 44px;
    margin-top: 70px;
  }
  .metric b {
    display: block;
    color: #f4f1e8;
    font-family: Impact, Arial Black, sans-serif;
    font-size: 74px;
    line-height: 0.9;
  }
  .metric span {
    display: block;
    margin-top: 14px;
    color: rgba(244, 241, 232, 0.78);
    font-family: Menlo, Consolas, monospace;
    font-size: 28px;
    font-weight: 700;
  }
  .strip {
    position: absolute;
    left: 92px;
    top: 3460px;
    width: 1976px;
    height: 154px;
    display: grid;
    grid-template-columns: 280px 1fr 240px;
    align-items: center;
    gap: 32px;
    padding: 0 40px;
    background: rgba(5, 7, 6, 0.92);
    border-top: 5px solid #c7ff00;
    box-sizing: border-box;
    color: #f4f1e8;
    font-family: Menlo, Consolas, monospace;
    font-size: 34px;
    font-weight: 700;
  }
  .bar {
    display: grid;
    grid-template-columns: 240fr 380fr 300fr 190fr;
    height: 26px;
  }
  .bar i:nth-child(1) { background: #16d7ff; }
  .bar i:nth-child(2) { background: #c7ff00; }
  .bar i:nth-child(3) { background: #ffb000; }
  .bar i:nth-child(4) { background: #ff3b1f; }
`;

const pages = {
  "whoop-hr.html": `<div class="card" style="left:1450px;top:2660px"><div class="kicker">WHOOP LIVE</div><div class="value">170</div><div class="label">MAX HR CAPTURED</div></div>`,
  "whoop-recovery.html": `<div class="card" style="left:96px;top:690px"><div class="kicker">BODY STATUS</div><div class="value">38%</div><div class="label">RECOVERY BEFORE SESSION</div></div>`,
  "whoop-sleep.html": `<div class="card" style="left:1450px;top:900px"><div class="kicker">SLEEP LOAD</div><div class="value">49%</div><div class="label">SLEEP PERFORMANCE</div></div>`,
  "whoop-main.html": `
    <div class="main">
      <div class="kicker">WHOOP DATA DROP / MAY 06</div>
      <div class="strain">14.6</div>
      <div class="subtitle">STRAIN SCORE</div>
      <div class="grid">
        <div class="metric"><b>170</b><span>MAX HR</span></div>
        <div class="metric"><b>126</b><span>AVG HR</span></div>
        <div class="metric"><b>504</b><span>KCAL</span></div>
        <div class="metric"><b>64:28</b><span>DURATION</span></div>
        <div class="metric"><b>38%</b><span>RECOVERY</span></div>
        <div class="metric"><b>49%</b><span>SLEEP</span></div>
      </div>
    </div>
    <div class="strip"><div>HR ZONES</div><div class="bar"><i></i><i></i><i></i><i></i></div><div>Z4 05:04</div></div>`
};

for (const [name, body] of Object.entries(pages)) {
  const htmlPath = `${dir}/${name}`;
  const pngPath = `${dir}/${name.replace(".html", ".png")}`;
  writeFileSync(htmlPath, `<!doctype html><html><head><style>${css}</style></head><body>${body}</body></html>`);
  const result = spawnSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-sandbox",
      "--default-background-color=00000000",
      "--window-size=2160,3840",
      `--screenshot=${pngPath}`,
      pathToFileURL(`${process.cwd()}/${htmlPath}`).href
    ],
    { stdio: "inherit" }
  );
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("Wrote overlay PNGs");
