import { expect, test } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('https://logs.jerma.io/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Jerma Logs/)
})

test('has latest messages', async ({ page }) => {
  await page.goto('https://logs.jerma.io/latest')

  await expect(page.getByTestId('message').nth(0)).toBeVisible()
})
