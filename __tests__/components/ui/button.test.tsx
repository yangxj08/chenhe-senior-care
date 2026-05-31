import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button component', () => {
  it('renders children text', () => {
    render(<Button>点击我</Button>)
    expect(screen.getByText('点击我')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Click</Button>)
    fireEvent.click(screen.getByText('Click'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies default variant styles (bg-blue-600)', () => {
    render(<Button>Default</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-blue-600')
  })

  it('applies outline variant styles', () => {
    render(<Button variant="outline">Outline</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('border')
  })

  it('applies destructive variant styles', () => {
    render(<Button variant="destructive">Delete</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('red')
  })

  it('applies ghost variant styles', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('hover:bg-gray-100')
  })

  it('applies accent variant styles', () => {
    render(<Button variant="accent">Accent</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('teal')
  })

  it('applies sm size', () => {
    render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button').className).toContain('h-8')
  })

  it('applies lg size', () => {
    render(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button').className).toContain('h-12')
  })

  it('applies icon size', () => {
    render(<Button size="icon">I</Button>)
    expect(screen.getByRole('button').className).toContain('w-10')
  })

  it('merges custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    expect(screen.getByRole('button').className).toContain('custom-class')
  })

  it('does not fire onClick when disabled', () => {
    const onClick = jest.fn()
    render(<Button disabled onClick={onClick}>Disabled</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
