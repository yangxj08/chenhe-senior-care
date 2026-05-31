import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export const CARE_LEVELS = {
  A: { label: '自理', color: 'success', description: '生活完全自理' },
  B: { label: '半自理', color: 'warning', description: '需要部分协助' },
  C: { label: '不自理', color: 'danger', description: '需要全面护理' },
  D: { label: '特护', color: 'info', description: '需要专业医疗护理' },
} as const

export const ROLES = {
  SUPER_ADMIN: { label: '超级管理员', description: '平台最高权限' },
  ORG_ADMIN: { label: '机构管理员', description: '机构管理权限' },
  NURSE: { label: '护理人员', description: '日常护理操作' },
  FAMILY: { label: '家属', description: '查看长辈信息' },
  INVESTOR: { label: '投资人', description: '查看投资收益' },
} as const

export type CareLevelKey = keyof typeof CARE_LEVELS
export type RoleKey = keyof typeof ROLES

export const BILLING_STATUS = {
  UNPAID: { label: '未付款', color: 'danger' },
  PAID: { label: '已付款', color: 'success' },
  OVERDUE: { label: '逾期', color: 'warning' },
} as const

export const INVESTMENT_PRODUCTS = {
  A: { label: '稳健型', annualRate: 0.08, minAmount: 100000 },
  B: { label: '成长型', annualRate: 0.12, minAmount: 200000 },
  C: { label: '进取型', annualRate: 0.16, minAmount: 500000 },
} as const
