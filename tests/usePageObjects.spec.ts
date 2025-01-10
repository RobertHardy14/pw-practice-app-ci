import { test, expect } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import { faker } from '@faker-js/faker'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('navigate to form page', async ({ page }) => {
    const pm = new PageManager(page)

    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datePickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().toolTipPage()
})

test('parametrized methods', async ({ page }) => {
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`


    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWCredentialsAndOption('test@test.com', 'Welcome1', 'Option 2')
    await page.screenshot({ path: 'screenshots/formsLayoutsPage.png' })
    await pm.onFormLayoutsPage().submitInLineFormWNameEmailAndCheckbox(randomFullName, randomEmail, false)
    // await pm.navigateTo().datePickerPage()
    // await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(5)
    // await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(6, 15)
})

test.only('testing with argos CI', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datePickerPage()

})