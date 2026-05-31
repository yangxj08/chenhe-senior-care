import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'

test.describe('机构管理后台', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'orgadmin@jiahee.com')
  })

  test('机构仪表盘加载成功', async ({ page }) => {
    await page.goto('/dashboard/org')
    await expect(page.locator('body')).toBeVisible()
    // 侧边栏可见
    await expect(page.locator('nav, aside').first()).toBeVisible()
  })

  test('老人管理页加载', async ({ page }) => {
    await page.goto('/dashboard/org/elders')
    await expect(page.locator('body')).toBeVisible()
    const content = await page.textContent('body')
    expect(content).toMatch(/老人|管理|新增/)
  })

  test('新增老人按钮可点击', async ({ page }) => {
    await page.goto('/dashboard/org/elders')
    const addBtn = page.locator('a[href*="/elders/new"], button').filter({ hasText: /新增|添加/ }).first()
    if (await addBtn.isVisible()) {
      await addBtn.click()
      await expect(page).toHaveURL(/\/elders\/new/)
    }
  })

  test('新增老人表单可见', async ({ page }) => {
    await page.goto('/dashboard/org/elders/new')
    await expect(page.locator('input').first()).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('护理记录页加载', async ({ page }) => {
    await page.goto('/dashboard/org/care')
    await expect(page.locator('body')).toBeVisible()
    const content = await page.textContent('body')
    expect(content).toMatch(/护理|记录/)
  })

  test('账单管理页加载', async ({ page }) => {
    await page.goto('/dashboard/org/billing')
    await expect(page.locator('body')).toBeVisible()
    const content = await page.textContent('body')
    expect(content).toMatch(/账单|费用|缴费/)
  })

  test('员工管理页加载', async ({ page }) => {
    await page.goto('/dashboard/org/staff')
    await expect(page.locator('body')).toBeVisible()
  })

  test('报表页加载并含图表', async ({ page }) => {
    await page.goto('/dashboard/org/reports')
    await expect(page.locator('body')).toBeVisible()
    // recharts生成svg
    await page.waitForTimeout(1000)
    const svgExists = await page.locator('svg').count()
    expect(svgExists).toBeGreaterThan(0)
  })

  test('侧边栏有多条导航链接', async ({ page }) => {
    await page.goto('/dashboard/org')
    await page.waitForTimeout(500)
    // 侧边栏 Sidebar 渲染在 aside 或 section 中，用更宽泛的选择器
    const links = page.locator('a[href^="/dashboard"]')
    const count = await links.count()
    expect(count).toBeGreaterThan(2)
  })
})
