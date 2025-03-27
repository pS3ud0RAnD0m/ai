import { test, expect } from "@playwright/test";

test.describe("404 Not Found Page", () => {
  test("should render default 404 page on unknown route", async ({ page }) => {
    await page.goto("/this-page-should-not-exist");

    // Expect the HTTP response code to be 404
    const response = await page.goto("/this-page-should-not-exist", {
      waitUntil: "load",
    });
    expect(response?.status()).toBe(404);

    // Next.js default 404 page contains this text
    await expect(page.locator("body")).toContainText(
      "This page could not be found",
    );
  });
});
