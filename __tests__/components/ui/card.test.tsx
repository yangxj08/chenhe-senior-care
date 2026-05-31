import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card'

describe('Card components', () => {
  it('renders Card with children', () => {
    render(<Card><p>content</p></Card>)
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('Card has rounded-xl class', () => {
    const { container } = render(<Card />)
    expect(container.firstChild).toHaveClass('rounded-xl')
  })

  it('Card has shadow and border styles', () => {
    const { container } = render(<Card />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('shadow-sm')
    expect(el.className).toContain('border')
  })

  it('merges custom className on Card', () => {
    const { container } = render(<Card className="extra" />)
    expect(container.firstChild).toHaveClass('extra')
  })

  it('CardTitle renders heading text', () => {
    render(<CardTitle>老人管理</CardTitle>)
    expect(screen.getByText('老人管理')).toBeInTheDocument()
  })

  it('CardTitle renders as h3', () => {
    render(<CardTitle>Title</CardTitle>)
    expect(screen.getByText('Title').tagName).toBe('H3')
  })

  it('CardDescription renders text', () => {
    render(<CardDescription>描述文字</CardDescription>)
    expect(screen.getByText('描述文字')).toBeInTheDocument()
  })

  it('CardContent renders children', () => {
    render(<CardContent>正文内容</CardContent>)
    expect(screen.getByText('正文内容')).toBeInTheDocument()
  })

  it('CardFooter renders children', () => {
    render(<CardFooter>底部操作区</CardFooter>)
    expect(screen.getByText('底部操作区')).toBeInTheDocument()
  })

  it('renders full composition', () => {
    render(
      <Card>
        <CardHeader><CardTitle>测试标题</CardTitle></CardHeader>
        <CardContent>测试内容</CardContent>
        <CardFooter>底部</CardFooter>
      </Card>
    )
    expect(screen.getByText('测试标题')).toBeInTheDocument()
    expect(screen.getByText('测试内容')).toBeInTheDocument()
    expect(screen.getByText('底部')).toBeInTheDocument()
  })

  it('CardHeader has padding classes', () => {
    const { container } = render(<CardHeader />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('p-6')
  })
})
