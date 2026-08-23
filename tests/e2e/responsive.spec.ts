import { expect, test } from "@playwright/test";

test("core screens fit the viewport without horizontal overflow", async ({ page }) => {
  for (const width of [360, 768, 1024, 1440]) { await page.setViewportSize({ width, height: 900 }); for (const path of ["today", "log?view=ideas", "train", "trends", "settings"]) { await page.goto(`#/${path}`); await expect(page.locator("main")).toBeVisible(); const widths = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth })); expect(widths.scroll, `${path} overflowed at ${width}px`).toBeLessThanOrEqual(widths.client + 1); } }
});
