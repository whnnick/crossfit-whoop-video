import crypto from "node:crypto";
import http from "node:http";
import { spawn } from "node:child_process";
import { loadEnv, requiredEnv, writeToken } from "./whoop-env.mjs";

loadEnv();
requiredEnv(["WHOOP_CLIENT_ID", "WHOOP_CLIENT_SECRET"]);

const AUTH_URL = "https://api.prod.whoop.com/oauth/oauth2/auth";
const TOKEN_URL = "https://api.prod.whoop.com/oauth/oauth2/token";
const redirectUri = process.env.WHOOP_REDIRECT_URI || "http://localhost:8977/callback";
const scopes = process.env.WHOOP_SCOPES || "offline read:profile read:body_measurement read:cycles read:recovery read:workout read:sleep";
const state = crypto.randomBytes(4).toString("hex");
const redirect = new URL(redirectUri);
const port = Number(redirect.port || 80);

const authUrl = new URL(AUTH_URL);
authUrl.searchParams.set("client_id", process.env.WHOOP_CLIENT_ID);
authUrl.searchParams.set("redirect_uri", redirectUri);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("scope", scopes);
authUrl.searchParams.set("state", state);

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, redirectUri);
    if (url.pathname !== redirect.pathname) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    if (url.searchParams.get("state") !== state) {
      throw new Error("OAuth state did not match. Refusing token exchange.");
    }
    const code = url.searchParams.get("code");
    if (!code) throw new Error(`Missing authorization code: ${url.searchParams.get("error") || "unknown error"}`);

    const bodyParams = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: process.env.WHOOP_CLIENT_ID,
      client_secret: process.env.WHOOP_CLIENT_SECRET,
    });
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: bodyParams,
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(`Token exchange failed ${response.status}: ${JSON.stringify(body)}`);

    writeToken(body);
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>WHOOP authorized</h1><p>You can close this tab and return to Codex.</p>");
    console.log("WHOOP token saved to .whoop-token.json");
    server.close();
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(String(error.message || error));
    console.error(error);
    server.close();
    process.exitCode = 1;
  }
});

server.listen(port, () => {
  console.log(`OAuth callback listening on ${redirectUri}`);
  console.log("Open this URL and approve access:");
  console.log(authUrl.toString());
  if (process.env.WHOOP_OPEN_BROWSER !== "0" && process.platform === "darwin") {
    spawn("open", [authUrl.toString()], { detached: true, stdio: "ignore" }).unref();
  }
});
