import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should load and display site title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/AI/i);
    await expect(page.locator("h1")).toHaveText(
      /Hello, this is the home page!/i,
    );
  });

  test("should have working nav links", async ({ page }) => {
    await page.goto("/");
    const links = page.locator("nav a");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});
