import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'

test.describe('投资人门户', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'investor@example.com')
  })

  test('投资概览页加载', async ({ page }) => {
    await page.goto('/dashboard/investor')
    await expect(page.locator('body')).toBeVisible()
    const content = await page.textContent('body')
    expect(content).toMatch(/投资|收益|分红/)
  })

  test('我的投资页加载', async ({ page }) => {
    await page.goto('/dashboard/investor/portfolio')
    await expect(page.locator('body')).toBeVisible()
  })

  test('分红记录页加载', async ({ page }) => {
    await page.goto('/dashboard/investor/returns')
    await expect(page.locator('body')).toBeVisible()
  })

  test('财务报告页加载', async ({ page }) => {
    await page.goto('/dashboard/investor/reports')
    await expect(page.locator('body')).toBeVisible()
  })

  test('非投资人无法访问investor路由', async ({ browser }) => {
    const ctx = await browser.newContext()
    const page = await ctx.newPage()
    try {
      await loginAs(page, 'orgadmin@jiahee.com')
      await page.goto('/dashboard/investor')
      await page.waitForLoadState('networkidle')
      // 应被重定向走，不能停在 /dashboard/investor
      expect(page.url()).not.toMatch(/\/dashboard\/investor$/)
    } finally {
      await ctx.close()
    }
  })
})
