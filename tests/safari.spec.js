// @ts-check
const { test, expect } = require("@playwright/test");

test("homepage has title and links to intro page", async ({ page }) => {
  await page.goto("http://localhost:3000/");
});
