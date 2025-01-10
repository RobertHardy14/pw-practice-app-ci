import { test, expect } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test.describe('Form layouts page', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async ({ page }) => {
        const usingTheGridEmail = page.locator('nb-card', { hasText: "Using the Grid" })
            .getByRole('textbox', { name: "Email" })

        await usingTheGridEmail.fill('test@test.com')
        await usingTheGridEmail.clear()
        await usingTheGridEmail.pressSequentially('test2@test.com')

        //Generic assertion of the input field
        //Grab the text
        const inputValue = await usingTheGridEmail.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //Locator assertion
        await expect(usingTheGridEmail).toHaveValue('test2@test.com')
    })

    test.only('radio button', async ({ page }) => {
        const usingTheGridEmail = page.locator('nb-card', { hasText: "Using the Grid" })
        // await usingTheGridEmail.getByLabel('Option 1').check({ force: true })
        await usingTheGridEmail.getByRole('radio', { name: "Option 2" }).check({ force: true })
        const radioStatus = await usingTheGridEmail.getByRole('radio', { name: "Option 1" })
            .isChecked()
        // await expect(usingTheGridEmail).toHaveScreenshot()
        expect(radioStatus).toBeTruthy()
        await expect(usingTheGridEmail.getByRole('radio', { name: "Option 1" })).toBeChecked()

        await usingTheGridEmail.getByRole('radio', { name: "Option 2" }).check({ force: true })
        expect(await usingTheGridEmail.getByRole('radio', { name: "Option 1" }).isChecked()).toBeFalsy()
        expect(await usingTheGridEmail.getByRole('radio', { name: "Option 2" }).isChecked()).toBeTruthy()
    })
})

test('checkboxes', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    await page.getByRole('checkbox', { name: "Hide on click" }).uncheck({ force: true })
    await page.getByRole('checkbox', { name: "Prevent arising of duplicate toast" }).check({ force: true })

    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()) {
        await box.uncheck({ force: true })
        expect(await box.isChecked()).toBeFalsy()
    }
})

test('lists and dropdowns', async ({ page }) => {
    const dropdownMenu = page.locator('ngx-header nb-select')
    await dropdownMenu.click()

    page.getByRole('list') //When the list has a UL tag
    page.getByRole('listitem') //When the list has LI tag

    // const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({ hasText: "Cosmic" }).click()
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    await dropdownMenu.click()
    for (const color in colors) {
        await optionList.filter({ hasText: color }).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if (color != "Corporate") {
            await dropdownMenu.click()
        }
    }
})

test('tooltips', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card', { hasText: "Tooltip Placements" })
    await toolTipCard.getByRole('button', { name: "Top" }).hover()

    // page.getByRole('tooltip') //Only works if role tooltip is created
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')
})

test('dialog boxes', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual("Are you sure you want to delete?")
        dialog.accept()
    })

    await page.getByRole('table').locator('tr', { hasText: "mdo@gmail.com" }).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test('web tables', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //Get row by any text in the row
    const targetRow = page.getByRole('row', { name: "twitter@outlook.com" })
    await targetRow.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill("35")
    await page.locator('.nb-checkmark').click()

    //Get row based on the value in the specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowID = page.getByRole('row', { name: "11" }).filter({ has: page.locator('td').nth(1).getByText('11') })
    await targetRowID.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-Mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-Mail').fill("test@test.com")
    await page.locator('.nb-checkmark').click()
    await expect(targetRowID.locator('td').nth(5)).toHaveText("test@test.com")

    //Test filter of the table

    const ages = ["20", "30", "40", "200"]

    for (let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')
        for (let row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent()

            if (age == "200") {
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            } else {
                expect(cellValue).toEqual(age)
            }
        }
    }
})

test('datepicker', async ({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const datePicker = page.getByPlaceholder('Form Picker')
    await datePicker.click()

    //Making date picker smarter
    let date = new Date() //Creating date variable
    date.setDate(date.getDate() + 1) //Telling it to add 1 to the current date
    const expectedDate = date.getDate() //Creating constant to store date
        .toString() //Inside it, getting the date and converting to string
    const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' })
    const expectedYear = date.getFullYear()
    const fullDate = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' })
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`
    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, { exact: true }).click()
    await expect(datePicker).toHaveValue(fullDate)
})

test('sliders', async ({ page }) => {
    // Update slider attribute
    // const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    // await tempGauge.evaluate(node => {
    //     node.setAttribute('cx', '242.92')
    //     node.setAttribute('cy', '60.25')
    // })
    // await tempGauge.click()

    //Simulate Mouse Movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2

    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x + 100, y + 100)
    await page.mouse.up()
    await expect(tempBox).toContainText('30')
})