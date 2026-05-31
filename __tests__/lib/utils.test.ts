import { cn, formatCurrency, formatDate, CARE_LEVELS, ROLES } from '@/lib/utils'

describe('cn()', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })
  it('handles conditional classes', () => {
    expect(cn('base', false && 'skip', 'keep')).toBe('base keep')
  })
  it('deduplicates conflicting tailwind classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
  it('handles undefined/null', () => {
    expect(cn(undefined, null, 'valid')).toBe('valid')
  })
})

describe('formatCurrency()', () => {
  it('formats positive numbers as CNY', () => {
    const result = formatCurrency(4500)
    expect(result).toContain('4,500')
    expect(result).toContain('¥')
  })
  it('formats zero', () => {
    expect(formatCurrency(0)).toContain('0')
  })
  it('formats large numbers', () => {
    const result = formatCurrency(1234567.89)
    expect(result).toContain('1,234,567')
  })
})

describe('formatDate()', () => {
  it('formats a Date object', () => {
    const d = new Date('2026-05-30T00:00:00.000Z')
    const result = formatDate(d)
    expect(result).toMatch(/2026/)
  })
  it('formats a date string', () => {
    const result = formatDate('2026-01-15')
    expect(result).toMatch(/2026/)
  })
})

describe('CARE_LEVELS', () => {
  it('has correct label for level A', () => {
    expect(CARE_LEVELS.A.label).toBe('自理')
  })
  it('has correct label for level B', () => {
    expect(CARE_LEVELS.B.label).toBe('半自理')
  })
  it('has correct label for level C', () => {
    expect(CARE_LEVELS.C.label).toBe('不自理')
  })
  it('has correct label for level D', () => {
    expect(CARE_LEVELS.D.label).toBe('特护')
  })
  it('has color fields', () => {
    expect(CARE_LEVELS.A.color).toBe('success')
    expect(CARE_LEVELS.B.color).toBe('warning')
    expect(CARE_LEVELS.C.color).toBe('danger')
    expect(CARE_LEVELS.D.color).toBe('info')
  })
})

describe('ROLES', () => {
  it('has all 5 roles', () => {
    expect(ROLES.SUPER_ADMIN).toBeDefined()
    expect(ROLES.ORG_ADMIN).toBeDefined()
    expect(ROLES.NURSE).toBeDefined()
    expect(ROLES.FAMILY).toBeDefined()
    expect(ROLES.INVESTOR).toBeDefined()
  })
  it('each role has a label', () => {
    expect(ROLES.SUPER_ADMIN.label).toBe('超级管理员')
    expect(ROLES.ORG_ADMIN.label).toBe('机构管理员')
    expect(ROLES.NURSE.label).toBe('护理人员')
    expect(ROLES.FAMILY.label).toBe('家属')
    expect(ROLES.INVESTOR.label).toBe('投资人')
  })
})
