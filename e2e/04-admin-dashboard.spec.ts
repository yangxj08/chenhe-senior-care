import { test, expect, chromium } from '@playwright/test'
import { loginAs } from './helpers/auth'

test.describe('超管后台', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin@chenhe.com')
  })

  test('总部大屏加载', async ({ page }) => {
    await page.goto('/dashboard/admin')
    await expect(page.locator('body')).toBeVisible()
    const content = await page.textContent('body')
    expect(content).toMatch(/机构|管理|总部/)
  })

  test('机构管理页加载', async ({ page }) => {
    await page.goto('/dashboard/admin/organizations')
    await expect(page.locator('body')).toBeVisible()
  })

  test('用户管理页加载', async ({ page }) => {
    await page.goto('/dashboard/admin/users')
    await expect(page.locator('body')).toBeVisible()
  })

  test('数据分析页含recharts图表', async ({ page }) => {
    await page.goto('/dashboard/admin/analytics')
    await page.waitForTimeout(1500)
    await expect(page.locator('body')).toBeVisible()
    const svgCount = await page.locator('svg').count()
    expect(svgCount).toBeGreaterThanOrEqual(1)
  })

  // 使用独立 browser context 避免 session 残留干扰
  test('非超管无法访问admin路由', async ({ browser }) => {
    const ctx = await browser.newContext()
    const page = await ctx.newPage()
    try {
      await loginAs(page, 'orgadmin@jiahee.com')
      await page.goto('/dashboard/admin')
      await page.waitForLoadState('networkidle')
      // 应被重定向走，不能停在 /dashboard/admin
      expect(page.url()).not.toMatch(/\/dashboard\/admin$/)
    } finally {
      await ctx.close()
    }
  })
})
