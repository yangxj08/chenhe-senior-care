# Senior Platform — 多角色多租户 SaaS 模板

一套生产就绪的 Next.js SaaS 脚手架,作为**模板仓库**复用于快速搭建新网站(中英文均可)。

> 这是一个 GitHub **Template Repository**。点右上角 **"Use this template" → Create a new repository** 即可一键起新站。

## 技术栈

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **Prisma 7** + **Neon** (serverless Postgres)
- **NextAuth.js** — 凭证登录 + JWT 会话
- **多角色 RBAC + 多租户隔离**(每条查询按 `organizationId` 隔离)
- **Recharts** 图表 · **lucide-react** 图标
- **Jest** 单元测试 · **Playwright** E2E
- **GitHub Actions** CI/CD + **Claude** 自动 PR 审查

## 内置角色(可按业务改)

| 角色 | 看到什么 |
|------|---------|
| `SUPER_ADMIN` | 总部:全平台机构/用户/数据分析 + 下钻任意机构 |
| `ORG_ADMIN` | 本机构全部运营(老人/护理/客户/员工/供应链/费用/报表) |
| `NURSE` | 仅护理相关(无财务) |
| `FAMILY` | 仅关联对象的状态/账单/消息 |
| `INVESTOR` | 仅投资概览/分红/报告 |

## 用这个模板起新站

### 1. 创建仓库
GitHub → "Use this template",或:
```bash
gh repo create my-new-site --template yangxj08/senior-platform --private --clone
cd my-new-site && npm install
```

### 2. 建数据库(Neon)
在 https://neon.tech 建项目,拿到 **pooled** 和 **direct** 两个连接串。

### 3. 配置环境变量 `.env`
```
DATABASE_URL="<pooled-url>"          # 带 -pooler,运行时用
DIRECT_URL="<direct-url>"            # 不带 -pooler,迁移/seed 用
NEXTAUTH_SECRET="<openssl rand -base64 32>"
NEXTAUTH_URL="https://your-domain.com"
```

### 4. 初始化数据库
```bash
npx prisma generate
npx prisma db push
SEED_PASSWORD=<你的密码> npx ts-node prisma/seed.ts
```

### 5. 本地跑
```bash
npm run dev               # http://localhost:3000
npm test                  # 单元测试
npm run check:deadlinks   # 死链扫描
```

### 6. 部署
见 `ship-nextjs-vercel` skill,或:
```bash
npx vercel link --yes
# 在 Vercel 设置 4 个 env(production + preview)
npx vercel --prod
```

## 换品牌的关键改动点

| 改什么 | 在哪 |
|--------|------|
| 品牌色 | 全局搜 `#2E75B6`(主)`#E8A838`(辅)替换 |
| 站名/Slogan | `app/(marketing)/layout.tsx`、`app/login/page.tsx` |
| 数据模型 | `prisma/schema.prisma` → `npx prisma db push` |
| 角色与权限 | `components/layout/Sidebar.tsx` 的 `NAV_BY_ROLE`、各 `dashboard/*/layout.tsx` |
| 营销页文案 | `app/(marketing)/*` |
| 种子数据 | `prisma/seed.ts` |

## CI/CD

- 每个 PR 自动跑:单元测试 → 死链扫描 → 生产构建(`.github/workflows/ci.yml`)
- PR 自动 Claude 审查 + 评论里 `@claude` 交互(`.github/workflows/claude-review.yml`)
- **需配置**:仓库 Settings → Secrets → `ANTHROPIC_API_KEY`(或 CLI 跑 `/install-github-app`)

## 配套 Claude Code Skills

起新站时可直接调用(已装在 `~/.claude/skills/`):

| Skill | 用途 |
|-------|------|
| `ship-nextjs-vercel` | 部署全流程(含所有踩坑) |
| `setup-cicd` | CI/CD + Claude PR 审查 |
| `scan-deadlinks` | 死链扫描 |
| `web-security-audit` | 多维安全审计 |
| `cn-web-compliance` | 中文站合规(招商/理财措辞、广告法) |

## 安全基线(已内置)

- 多租户隔离:所有查询按 session 的 `organizationId` 过滤
- 登录:constant-time bcrypt,防用户枚举
- 安全响应头:CSP / HSTS / X-Frame-Options 等 6 项
- 输入白名单:API 写操作显式字段校验,防 mass-assignment
- 种子脚本生产环境禁跑,无硬编码弱密码
