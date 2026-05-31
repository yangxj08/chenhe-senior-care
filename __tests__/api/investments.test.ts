describe('Investment return calculations', () => {
  it('calculates annual return at 28% rate', () => {
    const principal = 1000000
    const annualRate = 0.28
    const annualReturn = principal * annualRate
    expect(annualReturn).toBe(280000)
  })

  it('calculates monthly return from annual', () => {
    const annual = 280000
    const monthly = annual / 12
    expect(monthly).toBeCloseTo(23333.33, 2)
  })

  it('share percent calculation', () => {
    const invested = 1000000
    const totalValuation = 32000000
    const sharePercent = (invested / totalValuation) * 100
    expect(sharePercent).toBeCloseTo(3.125, 2)
  })

  it('5-year cumulative with 15% annual growth exceeds 2x', () => {
    let value = 1000000
    for (let i = 0; i < 5; i++) value *= 1.15
    expect(value).toBeGreaterThan(2000000)
  })

  it('calculates stable-type annual return at 8%', () => {
    const principal = 100000
    const annualReturn = principal * 0.08
    expect(annualReturn).toBe(8000)
  })

  it('calculates growth-type annual return at 12%', () => {
    const principal = 200000
    const annualReturn = principal * 0.12
    expect(annualReturn).toBe(24000)
  })

  it('calculates aggressive-type annual return at 16%', () => {
    const principal = 500000
    const annualReturn = principal * 0.16
    expect(annualReturn).toBe(80000)
  })

  it('total shares across all investors sums to 100%', () => {
    const investors = [
      { invested: 1000000 },
      { invested: 2000000 },
      { invested: 3000000 },
    ]
    const totalValuation = investors.reduce((sum, inv) => sum + inv.invested, 0)
    const shares = investors.map(inv => (inv.invested / totalValuation) * 100)
    const totalShares = shares.reduce((a, b) => a + b, 0)
    expect(totalShares).toBeCloseTo(100, 5)
  })

  it('3-year cumulative at 8% per year', () => {
    const initial = 1000000
    const result = initial * Math.pow(1.08, 3)
    expect(result).toBeCloseTo(1259712, 0)
  })
})
