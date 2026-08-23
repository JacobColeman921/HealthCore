import { expect, test } from "@playwright/test";

test("core screens fit the viewport without horizontal overflow", async ({ page }) => {
  for (const path of ["today", "log?view=ideas", "train", "trends", "settings"]) {
    await page.goto(path);
    await expect(page.locator("main")).toBeVisible();
    const widths = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    expect(widths.scroll, `${path} overflowed horizontally`).toBeLessThanOrEqual(widths.client + 1);
  }
});
