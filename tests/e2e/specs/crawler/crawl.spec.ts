import { test, FullConfig } from "@playwright/test";
import { Response } from "playwright";

const RETRIES = 3;

test("Crawl site and log performance", async ({ page }, testInfo) => {
  const config = testInfo.project.use as FullConfig["projects"][number]["use"];
  const BASE_URL = config.baseURL;
  if (!BASE_URL) throw new Error("Missing baseURL in Playwright config");

  const FULL_URL = `${BASE_URL}/`;

  const visited = new Set<string>();
  const queue = ["/"];
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

    const url = `${BASE_URL}${path}`;
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
    const resultText = results
      .map((r) => `[${r.status}, ${r.time}ms]`)
      .join(" ");
    console.log(`${url} → ${resultText} avg: ${Math.round(avg)}ms`);

    const hrefs = await page.$$eval("a[href]", (elements: Element[]) =>
      elements
        .map((el) => (el as HTMLAnchorElement).href)
        .filter((href) => href.startsWith(window.location.origin))
        .map((href) => new URL(href).pathname),
    );

    for (const href of hrefs) {
      if (!visited.has(href)) queue.push(href);
    }
  }

  console.log("\nSubrequests (including dynamic API calls):");
  for (const url of Array.from(discoveredUrls)) {
    console.log(`  ↳ ${url}`);
  }
});
