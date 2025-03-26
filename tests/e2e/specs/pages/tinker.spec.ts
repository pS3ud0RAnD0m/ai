import { test, expect } from "@playwright/test";

test.describe("Tinker Page", () => {
  test("should load and display site title", async ({ page }) => {
    await page.goto("/tinker");
    await expect(page).toHaveTitle(/AI/i);
    await expect(page.locator("h1")).toHaveText(
      /Hello, this is the tinker page!/i,
    );
  });

  test("should have working nav links", async ({ page }) => {
    await page.goto("/tinker");
    const links = page.locator("nav a");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});
