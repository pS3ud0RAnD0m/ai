import { spawn } from "child_process";
import { chromium } from "playwright";
import axios from "axios";
import * as dotenv from "dotenv";
import { setTimeout } from "timers/promises";

dotenv.config({ path: ".env.local" });

const BASE_URL = process.env.NEXT_PUBLIC_HOSTNAME;
const FULL_URL = `${BASE_URL}:3000/`;
const TIMEOUT_MS = 30000;

function startDevServer() {
  return spawn(
      "node",
      ["--inspect", "./node_modules/next/dist/bin/next", "dev"],
      {
        stdio: "inherit",
        env: { ...process.env },
      }
  );
}

function getErrorCode(err: unknown): string {
  if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      typeof (err as { code: unknown }).code === "string"
  ) {
    return (err as { code: string }).code;
  }
  return "UNKNOWN";
}

function getErrorMessage(err: unknown): string {
  if (
      typeof err === "object" &&
      err !== null &&
      "message" in err &&
      typeof (err as { message: unknown }).message === "string"
  ) {
    return (err as { message: string }).message;
  }
  return "Unknown error";
}

async function waitForServerReady() {
  const start = Date.now();
  while (Date.now() - start < TIMEOUT_MS) {
    try {
      console.log(`Checking if dev server is ready: ${FULL_URL}`);
      const res = await axios.get(FULL_URL, { timeout: 1000 });
      console.log(`Dev server response status: ${res.status}`);
      if (res.status === 200) {
        console.log("Dev server is ready.");
        return;
      }
    } catch (err) {
      process.stdout.write(`. (${getErrorCode(err)})`);
    }
    await setTimeout(1000);
  }
  throw new Error("Dev server did not respond in time.");
}

async function crawlSite(startPath: string) {
  const visited = new Set<string>();
  const queue = [startPath];

  const browser = await chromium.launch();
  const page = await browser.newPage();

  while (queue.length) {
    const path = queue.shift()!;
    if (visited.has(path)) continue;
    visited.add(path);

    const url = `${BASE_URL}:3000${path}`;
    console.log(url);

    try {
      await page.goto(url, { waitUntil: "networkidle" });

      const hrefs = await page.$$eval("a[href]", (elements) =>
          elements
              .map((el) => (el as HTMLAnchorElement).href)
              .filter((href) => href.startsWith(window.location.origin))
              .map((href) => new URL(href).pathname)
      );

      for (const href of hrefs) {
        if (!visited.has(href)) {
          queue.push(href);
        }
      }
    } catch (err) {
      console.error(`Error visiting ${url} – ${getErrorMessage(err)}`);
    }
  }

  await browser.close();
}

(async () => {
  const devServer = startDevServer();

  try {
    console.log("Waiting for dev server to be ready...");
    await waitForServerReady();

    console.log("Starting crawl from root...");
    await crawlSite("/");
  } catch (err) {
    console.error(err);
  } finally {
    devServer.kill();
    console.log("Dev server stopped.");
  }
})();
