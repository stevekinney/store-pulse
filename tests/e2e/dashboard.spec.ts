import { expect, test } from "@playwright/test";

test("dashboard loads with metrics and low-stock items", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);

  await expect(
    page.getByRole("heading", { name: "Operations dashboard" }),
  ).toBeVisible();

  // Four metric cards visible by accessible text, scoped to the headline
  // metrics region to avoid colliding with the nav links.
  const metrics = page.getByLabel("Headline metrics");
  await expect(metrics.getByText("Stores", { exact: true })).toBeVisible();
  await expect(metrics.getByText("Active products", { exact: true })).toBeVisible();
  await expect(metrics.getByText("Low stock", { exact: true })).toBeVisible();
  await expect(metrics.getByText("Active tasks", { exact: true })).toBeVisible();

  // Urgent low stock section has at least one item.
  const lowStockHeading = page.getByRole("heading", {
    name: "Most urgent low stock",
  });
  await expect(lowStockHeading).toBeVisible();
  const lowStockSection = lowStockHeading.locator("xpath=ancestor::div[1]");
  const items = lowStockSection.locator("li");
  await expect(items.first()).toBeVisible();
});
