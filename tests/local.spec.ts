import { expect, test } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Jerma Logs/)
})

test('has latest messages', async ({ page }) => {
  await page.goto('/latest')

  await expect(page.getByTestId('message').nth(0)).toBeVisible()
})
