import { spawn } from "child_process";
import { chromium, Response } from "playwright";
import axios from "axios";
import * as dotenv from "dotenv";
import { setTimeout } from "timers/promises";

dotenv.config({ path: ".env.local" });

const BASE_URL = process.env.NEXT_PUBLIC_HOSTNAME;
const FULL_URL = `${BASE_URL}:3000/`;
const TIMEOUT_MS = 30000;
const RETRIES = 3;

function startProdServer() {
  return spawn("node", ["--inspect", "./node_modules/next/dist/bin/next", "start"], {
    stdio: "inherit",
    env: { ...process.env },
  });
}

function getErrorCode(err: unknown): string {
  return typeof err === "object" && err !== null && "code" in err && typeof (err as { code: unknown }).code === "string"
      ? (err as { code: string }).code
      : "UNKNOWN";
}

function getErrorMessage(err: unknown): string {
  return typeof err === "object" && err !== null && "message" in err && typeof (err as { message: unknown }).message === "string"
      ? (err as { message: string }).message
      : "Unknown error";
}

async function waitForServerReady(): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < TIMEOUT_MS) {
    try {
      console.log(FULL_URL);
      const res = await axios.get(FULL_URL, { timeout: 1000 });
      if (res.status === 200) return;
    } catch (err) {
      process.stdout.write(`. (${getErrorCode(err)})`);
    }
    await setTimeout(1000);
  }
  throw new Error("Server did not respond in time.");
}

async function crawlSite(startPath: string): Promise<void> {
  const visited = new Set<string>();
  const queue = [startPath];

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const discoveredUrls = new Set<string>();

  page.on("response", (response: Response) => {
    const url = response.url();
    const status = response.status();
    if (url.startsWith(FULL_URL)) {
      discoveredUrls.add(`${url} [${status}]`);
    }
  });

  while (queue.length) {
    const path = queue.shift()!;
    if (visited.has(path)) continue;
    visited.add(path);

    const url = `${BASE_URL}:3000${path}`;
    const results: { status: number | string; time: number }[] = [];

    for (let i = 0; i < RETRIES; i++) {
      try {
        const start = Date.now();
        const response = await page.goto(url, { waitUntil: "networkidle" });
        const time = Date.now() - start;
        const status = response?.status() ?? "NO_RESPONSE";
        results.push({ status, time });
      } catch {
        results.push({ status: "ERROR", time: 0 });
      }
    }

    const avg = results.reduce((acc, r) => acc + r.time, 0) / RETRIES;
    const resultText = results.map(r => `[${r.status}, ${r.time}ms]`).join(" ");
    console.log(`${url} → ${resultText} avg: ${Math.round(avg)}ms`);

    try {
      const hrefs = await page.$$eval("a[href]", (elements: Element[]) =>
          elements
              .map((el) => (el as HTMLAnchorElement).href)
              .filter((href) => href.startsWith(window.location.origin))
              .map((href) => new URL(href).pathname)
      );

      for (const href of hrefs) {
        if (!visited.has(href)) queue.push(href);
      }
    } catch (err) {
      console.error(`Error extracting links from ${url} – ${getErrorMessage(err)}`);
    }
  }

  console.log("\nSubrequests (including dynamic API calls):");
  for (const url of Array.from(discoveredUrls)) {
    console.log(`  ↳ ${url}`);
  }

  await browser.close();
}

(async () => {
  const prodServer = startProdServer();

  try {
    console.log("Waiting for production server to be ready...");
    await waitForServerReady();

    console.log("Starting crawl from root...");
    await crawlSite("/");
  } catch (err) {
    console.error(err);
  } finally {
    prodServer.kill();
    console.log("Production server stopped.");
  }
})();
