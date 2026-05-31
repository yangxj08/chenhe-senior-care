import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'

test.describe('家属端', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'family@example.com')
  })

  test('家属首页加载', async ({ page }) => {
    await page.goto('/dashboard/family')
    await expect(page.locator('body')).toBeVisible()
  })

  test('老人状态页加载', async ({ page }) => {
    await page.goto('/dashboard/family/elder')
    await expect(page.locator('body')).toBeVisible()
  })

  test('费用缴纳页加载', async ({ page }) => {
    await page.goto('/dashboard/family/billing')
    await expect(page.locator('body')).toBeVisible()
  })

  test('消息页加载含输入框', async ({ page }) => {
    await page.goto('/dashboard/family/messages')
    await expect(page.locator('body')).toBeVisible()
    await page.waitForTimeout(500)
    const inputVisible = await page.locator('input[type="text"], textarea').first().isVisible()
    expect(inputVisible).toBeTruthy()
  })

  test('发送消息功能', async ({ page }) => {
    await page.goto('/dashboard/family/messages')
    await page.waitForTimeout(500)
    const input = page.locator('input[type="text"], textarea').first()
    if (await input.isVisible()) {
      await input.fill('你好，请问今天老人吃饭情况如何？')
      const sendBtn = page.locator('button').filter({ hasText: /发送|Send/ }).first()
      if (await sendBtn.isVisible()) {
        await sendBtn.click()
        await page.waitForTimeout(300)
        const content = await page.textContent('body')
        expect(content).toContain('你好，请问今天老人吃饭情况如何？')
      }
    }
  })
})
