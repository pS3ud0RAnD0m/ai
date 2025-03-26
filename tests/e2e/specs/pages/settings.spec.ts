import { test, expect } from "@playwright/test";

test.describe("Settings Page", () => {
  test("should load and display site title", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveTitle(/AI/i);
    await expect(page.locator("h1")).toHaveText(
      /Hello, this is the settings page!/i,
    );
  });

  test("should have working nav links", async ({ page }) => {
    await page.goto("/settings");
    const links = page.locator("nav a");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});
