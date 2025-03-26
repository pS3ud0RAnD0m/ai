import { test, expect } from "@playwright/test";

test.describe("References Page", () => {
  test("should load and display site title", async ({ page }) => {
    await page.goto("/references");
    await expect(page).toHaveTitle(/AI/i);
    await expect(page.locator("h1")).toHaveText(/References/i);
  });

  test("should have working nav links", async ({ page }) => {
    await page.goto("/references");
    const links = page.locator("nav a");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});
