import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('http://uitestingplayground.com/ajax');
    await page.getByText('Button Triggering AJAX Request').click()
})

test('auto waiting', async ({ page }) => {
    const dataLoad = page.locator('.bg-success')
    // await dataLoad.click()

    // const text = await dataLoad.textContent()
    await dataLoad.waitFor({ state: "attached" })
    const text = await dataLoad.allTextContents()
    expect(text).toContain("Data loaded with AJAX get request.")
    // expect(dataLoad).toBeVisible()
})

test('alternative waits', async ({page}) =>{
    const dataLoad = page.locator('.bg-success')

    // Wait for element
    // await page.waitForSelector('.bg-success')

    //Wait for particular response
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    const text = await dataLoad.allTextContents()
    expect(text).toContain("Data loaded with AJAX get request.")
})

test('timeouts', async ({page})=>{
    const dataLoad = page.locator('.bg-success')
    await dataLoad.click()
})