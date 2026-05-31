#!/usr/bin/env node
/**
 * 静态死链扫描器 — 扫描 app/ 和 components/ 中所有内部 href，
 * 对比 Next.js App Router 的实际页面文件，找出会 404 的链接。
 * 支持：路由组 (marketing)、动态段 [id]、模板字符串 ${...}。
 *
 * 用法: node scripts/check-deadlinks.mjs
 * CI 中 404 数 > 0 时以退出码 1 失败。
 */
import fs from 'node:fs'
import { execSync } from 'node:child_process'

const ROOTS = ['app', 'components']
const APP_DIR = 'app'

function collectLinks() {
  const out = execSync(
    `grep -rhoE 'href=[\`"](/[^\`"]*)[\`"]' ${ROOTS.join(' ')} --include="*.tsx" || true`,
    { encoding: 'utf8' }
  )
  return [
    ...new Set(
      out
        .split('\n')
        .map((l) => l.replace(/href=[`"]/, '').replace(/[`"]$/, ''))
        .filter((l) => l && l.startsWith('/'))
        .map((l) => l.replace(/\$\{[^}]+\}/g, 'X').split(/[?#]/)[0])
        .filter(Boolean)
    ),
  ].sort()
}

function routeGroups() {
  // 找出所有 (group) 路由组目录
  return fs.existsSync(APP_DIR)
    ? fs.readdirSync(APP_DIR).filter((e) => e.startsWith('(') && e.endsWith(')'))
    : []
}

function exists(route) {
  if (route === '/') return true
  const groups = ['', ...routeGroups().map((g) => `/${g}`)]
  for (const g of groups) {
    const parts = route.split('/').filter(Boolean)
    let dir = `${APP_DIR}${g}`
    let ok = fs.existsSync(dir)
    for (const p of parts) {
      if (!ok) break
      const seg = p === 'X' ? null : p
      if (seg && fs.existsSync(`${dir}/${seg}`)) {
        dir = `${dir}/${seg}`
      } else {
        // 尝试动态段 [xxx]
        const dyn = fs.existsSync(dir)
          ? fs.readdirSync(dir).find((e) => e.startsWith('['))
          : null
        if (dyn) dir = `${dir}/${dyn}`
        else { ok = false; break }
      }
    }
    if (ok && fs.existsSync(`${dir}/page.tsx`)) return true
  }
  return false
}

const links = collectLinks()
const dead = links.filter((l) => !exists(l))

if (dead.length === 0) {
  console.log(`✓ 死链检查通过：${links.length} 个内部链接全部有对应页面`)
  process.exit(0)
} else {
  console.error(`✗ 发现 ${dead.length} 个死链（会 404）：`)
  dead.forEach((l) => console.error(`  - ${l}`))
  process.exit(1)
}
