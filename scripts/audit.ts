import { prisma as p } from '../lib/db'

async function main() {
  const [orgs, elders, users, billing, careRecords, investments, staff] = await Promise.all([
    p.organization.findMany({ include: { _count: { select: { elders: true, users: true } } } }),
    p.elder.findMany({ include: { billings: true, careRecords: true } }),
    p.user.findMany({ select: { id: true, name: true, email: true, role: true, organizationId: true } }),
    p.billingRecord.findMany({ include: { elder: { select: { name: true } } } }),
    p.careRecord.findMany({ include: { elder: { select: { name: true } }, nurse: { select: { name: true } } } }),
    p.investment.findMany({ include: { investor: { select: { name: true } }, organization: { select: { name: true } } } }),
    p.staffMember.findMany({ include: { user: { select: { name: true } } } }),
  ])

  console.log('\n=== ORGANIZATIONS ===')
  orgs.forEach(o => console.log(`  ${o.name} (${o.code}) | elders:${o._count.elders} users:${o._count.users} | plan:${o.plan}`))

  console.log('\n=== USERS ===')
  users.forEach(u => console.log(`  ${u.name} | ${u.role} | orgId:${u.organizationId?.slice(-6) || 'none'}`))

  console.log('\n=== ELDERS ===')
  elders.forEach(e => console.log(`  ${e.name} | ${e.gender} ${e.age}岁 | level:${e.careLevel} | room:${e.roomNumber} | billings:${e.billings.length} | care:${e.careRecords.length} | family:${e.familyUserId?.slice(-6) || 'NONE'}`))

  console.log('\n=== BILLING ===')
  billing.forEach(b => console.log(`  ${b.elder.name} | ${b.month} | total:¥${b.total} | ${b.status}`))
  const totalAll = billing.reduce((s, b) => s + b.total, 0)
  const totalPaid = billing.filter(b => b.status === 'PAID').reduce((s, b) => s + b.total, 0)
  const totalUnpaid = billing.filter(b => b.status === 'UNPAID').reduce((s, b) => s + b.total, 0)
  console.log(`  ► ALL:¥${totalAll}  PAID:¥${totalPaid}  UNPAID:¥${totalUnpaid}`)

  console.log('\n=== CARE RECORDS ===')
  careRecords.forEach(r => console.log(`  ${r.elder.name} | ${r.type} | nurse:${r.nurse.name} | ${r.createdAt.toISOString().slice(0, 10)}`))

  console.log('\n=== INVESTMENTS ===')
  investments.forEach(i => console.log(`  ${i.investor.name} → ${i.organization.name} | ¥${i.amount} | ${i.sharePercent}% | monthly:¥${i.monthlyReturn}`))

  console.log('\n=== STAFF ===')
  if (staff.length === 0) console.log('  (none)')
  staff.forEach(s => console.log(`  ${s.user.name} | ${s.position} | ${s.department}`))

  console.log('\n=== FAMILY LINKS ===')
  const familyElders = elders.filter(e => e.familyUserId)
  if (familyElders.length === 0) console.log('  WARNING: no elder has familyUserId set!')
  familyElders.forEach(e => {
    const fam = users.find(u => u.id === e.familyUserId)
    console.log(`  ${e.name} ↔ ${fam?.name || 'NOT FOUND'} (${fam?.role || 'N/A'})`)
  })

  console.log('\n=== CONSISTENCY CHECKS ===')
  // Check 1: every elder has an org
  const eldersNoOrg = elders.filter(e => !orgs.find(o => o.id === e.organizationId))
  console.log(`  Elders without valid org: ${eldersNoOrg.length === 0 ? '✓ OK' : eldersNoOrg.map(e => e.name).join(', ')}`)
  // Check 2: family users have linked elders
  const familyUsers = users.filter(u => u.role === 'FAMILY')
  familyUsers.forEach(u => {
    const linked = elders.find(e => e.familyUserId === u.id)
    console.log(`  Family user ${u.name}: ${linked ? `✓ linked to ${linked.name}` : '✗ NO ELDER LINKED'}`)
  })
  // Check 3: investor has investment record
  const investorUsers = users.filter(u => u.role === 'INVESTOR')
  investorUsers.forEach(u => {
    const inv = investments.find(i => i.investorId === u.id)
    console.log(`  Investor ${u.name}: ${inv ? `✓ ¥${inv.amount}` : '✗ NO INVESTMENT RECORD'}`)
  })
  // Check 4: billing totals match
  billing.forEach(b => {
    const expected = b.baseFee + b.careFee + b.medicineFee + b.otherFee
    if (Math.abs(expected - b.total) > 0.01) {
      console.log(`  ✗ Billing mismatch for ${b.elder.name} ${b.month}: stored=${b.total}, computed=${expected}`)
    }
  })
  if (billing.every(b => Math.abs((b.baseFee + b.careFee + b.medicineFee + b.otherFee) - b.total) <= 0.01)) {
    console.log('  Billing totals: ✓ all match')
  }
}

main().catch(console.error).finally(() => p.$disconnect())
