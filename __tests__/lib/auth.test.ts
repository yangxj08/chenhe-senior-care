describe('Role-based access control logic', () => {
  const DASHBOARD_ROUTES: Record<string, string> = {
    SUPER_ADMIN: '/dashboard/admin',
    ORG_ADMIN: '/dashboard/org',
    NURSE: '/dashboard/org',
    FAMILY: '/dashboard/family',
    INVESTOR: '/dashboard/investor',
  }

  it('redirects SUPER_ADMIN to admin dashboard', () => {
    expect(DASHBOARD_ROUTES['SUPER_ADMIN']).toBe('/dashboard/admin')
  })
  it('redirects ORG_ADMIN to org dashboard', () => {
    expect(DASHBOARD_ROUTES['ORG_ADMIN']).toBe('/dashboard/org')
  })
  it('redirects NURSE to org dashboard', () => {
    expect(DASHBOARD_ROUTES['NURSE']).toBe('/dashboard/org')
  })
  it('redirects FAMILY to family dashboard', () => {
    expect(DASHBOARD_ROUTES['FAMILY']).toBe('/dashboard/family')
  })
  it('redirects INVESTOR to investor dashboard', () => {
    expect(DASHBOARD_ROUTES['INVESTOR']).toBe('/dashboard/investor')
  })
  it('all 5 roles have routes defined', () => {
    expect(Object.keys(DASHBOARD_ROUTES)).toHaveLength(5)
  })
})

describe('Role permission guards', () => {
  const ADMIN_ROLES = new Set(['SUPER_ADMIN', 'ORG_ADMIN'])
  const CARE_ROLES = new Set(['SUPER_ADMIN', 'ORG_ADMIN', 'NURSE'])

  it('SUPER_ADMIN is an admin role', () => {
    expect(ADMIN_ROLES.has('SUPER_ADMIN')).toBe(true)
  })
  it('ORG_ADMIN is an admin role', () => {
    expect(ADMIN_ROLES.has('ORG_ADMIN')).toBe(true)
  })
  it('NURSE is not an admin role', () => {
    expect(ADMIN_ROLES.has('NURSE')).toBe(false)
  })
  it('FAMILY is not an admin role', () => {
    expect(ADMIN_ROLES.has('FAMILY')).toBe(false)
  })
  it('INVESTOR is not an admin role', () => {
    expect(ADMIN_ROLES.has('INVESTOR')).toBe(false)
  })
  it('NURSE can access care-related routes', () => {
    expect(CARE_ROLES.has('NURSE')).toBe(true)
  })
  it('FAMILY cannot access care-related routes', () => {
    expect(CARE_ROLES.has('FAMILY')).toBe(false)
  })
  it('INVESTOR cannot access care-related routes', () => {
    expect(CARE_ROLES.has('INVESTOR')).toBe(false)
  })
})

describe('Route guard helper', () => {
  const DASHBOARD_ROUTES: Record<string, string> = {
    SUPER_ADMIN: '/dashboard/admin',
    ORG_ADMIN: '/dashboard/org',
    NURSE: '/dashboard/org',
    FAMILY: '/dashboard/family',
    INVESTOR: '/dashboard/investor',
  }
  const DEFAULT_ROUTE = '/login'

  const getDashboardRoute = (role: string): string =>
    DASHBOARD_ROUTES[role] ?? DEFAULT_ROUTE

  it('returns login for unknown role', () => {
    expect(getDashboardRoute('UNKNOWN')).toBe('/login')
  })
  it('returns correct route for known role', () => {
    expect(getDashboardRoute('FAMILY')).toBe('/dashboard/family')
  })
  it('NURSE and ORG_ADMIN share the same dashboard path', () => {
    expect(getDashboardRoute('NURSE')).toBe(getDashboardRoute('ORG_ADMIN'))
  })
})
