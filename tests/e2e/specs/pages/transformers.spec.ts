import { test, expect } from "@playwright/test";

test.describe("Transformers Page", () => {
  test("should load and display site title", async ({ page }) => {
    await page.goto("/transformers");
    await expect(page).toHaveTitle(/AI/i);
    await expect(page.locator("h2")).toHaveText(/Configuration/i);
  });

  test("should have working nav links", async ({ page }) => {
    await page.goto("/transformers");
    const links = page.locator("nav a");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});
