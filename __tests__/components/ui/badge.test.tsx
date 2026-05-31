import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge component', () => {
  it('renders text content', () => {
    render(<Badge>在住</Badge>)
    expect(screen.getByText('在住')).toBeInTheDocument()
  })

  it('applies default variant (blue)', () => {
    render(<Badge>Default</Badge>)
    expect(screen.getByText('Default').className).toContain('blue')
  })

  it('applies success variant', () => {
    render(<Badge variant="success">已缴</Badge>)
    expect(screen.getByText('已缴').className).toContain('green')
  })

  it('applies danger variant', () => {
    render(<Badge variant="danger">异常</Badge>)
    expect(screen.getByText('异常').className).toContain('red')
  })

  it('applies warning variant', () => {
    render(<Badge variant="warning">待缴</Badge>)
    expect(screen.getByText('待缴').className).toContain('yellow')
  })

  it('applies info variant (purple)', () => {
    render(<Badge variant="info">日常护理</Badge>)
    expect(screen.getByText('日常护理').className).toContain('purple')
  })

  it('applies secondary variant (gray)', () => {
    render(<Badge variant="secondary">次要</Badge>)
    expect(screen.getByText('次要').className).toContain('gray')
  })

  it('merges extra className', () => {
    render(<Badge className="test-cls">X</Badge>)
    expect(screen.getByText('X').className).toContain('test-cls')
  })

  it('renders as a div element', () => {
    const { container } = render(<Badge>Tag</Badge>)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })
})
