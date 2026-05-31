import { Page } from '@playwright/test'

export async function loginAs(page: Page, email: string, password = 'admin123') {
  await page.goto('/login')
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/)
}

export const TEST_ACCOUNTS = {
  superAdmin: 'admin@chenhe.com',
  orgAdmin: 'orgadmin@jiahee.com',
  nurse: 'nurse@jiahee.com',
  family: 'family@example.com',
  investor: 'investor@example.com',
} as const
