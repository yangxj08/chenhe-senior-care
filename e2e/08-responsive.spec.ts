import { test, expect } from '@playwright/test'

test.describe('响应式设计', () => {
  test('手机端首页正常显示', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toBeVisible()
    // 移动端页面有内容即可
    const content = await page.textContent('body')
    expect(content?.length).toBeGreaterThan(10)
  })

  test('平板端首页正常显示', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
  })

  test('桌面端首页正常显示', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
  })

  test('手机端登录页可用', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })
})
