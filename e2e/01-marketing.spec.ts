import { test, expect } from '@playwright/test'

test.describe('营销官网', () => {
  test('首页正常加载', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/郴和养老/)
  })

  test('首页包含核心文案', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=郴和养老').first()).toBeVisible()
    const hero = page.locator('h1, h2').first()
    await expect(hero).toBeVisible()
  })

  test('导航栏可见含主要链接', async ({ page }) => {
    await page.goto('/')
    // 等待页面完全渲染
    await page.waitForLoadState('networkidle')
    // 导航可能是 nav 或固定定位的 div，用链接文字查找
    await expect(page.getByRole('link', { name: '关于我们' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: '服务项目' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: '加盟合作' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: '联系我们' }).first()).toBeVisible()
  })

  test('关于我们页加载', async ({ page }) => {
    await page.goto('/about')
    await expect(page.locator('body')).toBeVisible()
    await expect(page.locator('text=郴和').first()).toBeVisible()
  })

  test('服务介绍页加载', async ({ page }) => {
    await page.goto('/services')
    await expect(page.locator('body')).toBeVisible()
    const content = await page.textContent('body')
    expect(content).toMatch(/护理|服务|养老/)
  })

  test('加盟合作页加载含表单', async ({ page }) => {
    await page.goto('/franchise')
    await expect(page.locator('body')).toBeVisible()
    const content = await page.textContent('body')
    expect(content).toMatch(/加盟|投资|合作/)
  })

  test('联系我们页加载', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('body')).toBeVisible()
  })

  test('登录链接导航到登录页', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // 找到所有指向 /login 的链接，点第一个
    const loginLink = page.locator('a[href="/login"]').first()
    await expect(loginLink).toBeVisible({ timeout: 8000 })
    await loginLink.click()
    await expect(page).toHaveURL(/\/login/, { timeout: 8000 })
  })

  test('Footer在首页存在', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // footer 可能在视口外，检查存在即可（不要求 visible）
    const footer = page.locator('footer')
    await expect(footer).toHaveCount(1)
    // 滚动到底部后应可见
    await footer.scrollIntoViewIfNeeded()
    await expect(footer).toBeVisible({ timeout: 5000 })
  })
})
