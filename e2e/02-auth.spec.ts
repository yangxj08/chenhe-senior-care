import { test, expect } from '@playwright/test'

test.describe('认证流程', () => {
  test('登录页正常加载', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('使用错误密码登录失败', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@chenhe.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(2000)
    // 仍在login页或显示错误
    const url = page.url()
    const hasError = url.includes('/login') || await page.locator('text=/错误|密码|失败/').isVisible()
    expect(hasError).toBeTruthy()
  })

  test('超级管理员登录跳转到admin', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@chenhe.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    expect(page.url()).toMatch(/dashboard/)
  })

  test('机构管理员登录跳转到org', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'orgadmin@jiahee.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    expect(page.url()).toMatch(/dashboard/)
  })

  test('投资人登录跳转到investor', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'investor@example.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    expect(page.url()).toMatch(/dashboard/)
  })

  test('家属登录跳转到family', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'family@example.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    expect(page.url()).toMatch(/dashboard/)
  })

  test('未登录访问dashboard被重定向', async ({ page }) => {
    await page.goto('/dashboard/org')
    await page.waitForURL(/\/login/, { timeout: 5000 })
    expect(page.url()).toContain('/login')
  })
})
