import { test, expect } from '@playwright/test'

test.describe('API接口', () => {
  test('GET /api/elders 未认证返回401', async ({ request }) => {
    const res = await request.get('/api/elders')
    expect([401, 302, 307]).toContain(res.status())
  })

  test('GET /api/care-records 未认证返回401', async ({ request }) => {
    const res = await request.get('/api/care-records')
    expect([401, 302, 307]).toContain(res.status())
  })

  test('GET /api/billing 未认证返回401', async ({ request }) => {
    const res = await request.get('/api/billing')
    expect([401, 302, 307]).toContain(res.status())
  })

  test('GET /api/investments 未认证返回401', async ({ request }) => {
    const res = await request.get('/api/investments')
    expect([401, 302, 307]).toContain(res.status())
  })

  test('POST /api/elders 无body返回错误', async ({ request }) => {
    const res = await request.post('/api/elders', { data: {} })
    expect([400, 401, 302, 307]).toContain(res.status())
  })
})
