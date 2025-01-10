import { Page, expect } from '@playwright/test'
import { HelperBase } from './helperBase'

export class DatePickerPage extends HelperBase {

    constructor(page: Page) {
        super(page)
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
        const datePicker = this.page.getByPlaceholder('Form Picker')
        await datePicker.click()
        const fullDate = await this.selectDateInTheCalendar(numberOfDaysFromToday)

        await expect(datePicker).toHaveValue(fullDate)
    }

    async selectDatePickerWithRangeFromToday(startDate: number, endDate: number) {
        const datePicker = this.page.getByPlaceholder('Range Picker')
        await datePicker.click()
        const dayToAssertStart = await this.selectDateInTheCalendar(startDate)
        const dayToAssertEnd = await this.selectDateInTheCalendar(endDate)
        const dateToAssert = `${dayToAssertStart} - ${dayToAssertEnd}`
        await expect(datePicker).toHaveValue(dateToAssert)
    }

    private async selectDateInTheCalendar(numberOfDaysFromToday: number) {
        //Making date picker smarter
        let date = new Date() //Creating date variable
        date.setDate(date.getDate() + numberOfDaysFromToday) //Telling it to add 1 to the current date
        const expectedDate = date.getDate() //Creating constant to store date
            .toString() //Inside it, getting the date and converting to string
        const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' })
        const expectedYear = date.getFullYear()
        const fullDate = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' })
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`
        while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }

        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, { exact: true }).click()
        return fullDate
    }
}