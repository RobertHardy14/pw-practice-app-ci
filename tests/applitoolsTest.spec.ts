import { test, expect } from '@playwright/test'

test('Applitools Visual Test', async ({ page }) => {
    await page.goto('/')

    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})