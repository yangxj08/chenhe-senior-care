import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '@/components/ui/input'

describe('Input component', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="请输入姓名" />)
    expect(screen.getByPlaceholderText('请输入姓名')).toBeInTheDocument()
  })

  it('accepts typed value', () => {
    render(<Input defaultValue="" />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '李奶奶' } })
    expect((input as HTMLInputElement).value).toBe('李奶奶')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('fires onChange callback', () => {
    const onChange = jest.fn()
    render(<Input onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('applies type=email', () => {
    render(<Input type="email" />)
    expect(document.querySelector('input[type="email"]')).toBeInTheDocument()
  })

  it('applies type=password', () => {
    render(<Input type="password" />)
    expect(document.querySelector('input[type="password"]')).toBeInTheDocument()
  })

  it('applies type=number', () => {
    render(<Input type="number" />)
    expect(document.querySelector('input[type="number"]')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    render(<Input className="custom-input" />)
    const input = document.querySelector('input')
    expect(input?.className).toContain('custom-input')
  })

  it('defaults to type=text', () => {
    render(<Input />)
    const input = document.querySelector('input')
    // When no type is specified the browser/jsdom defaults to "text"
    expect(input?.type).toBe('text')
  })
})
