import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Input from '../../components/Input'

describe('Input', () => {
  it('renderiza label e input associados', () => {
    render(<Input id="email" label="E-mail" value="" onChange={vi.fn()} />)
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  })

  it('exibe placeholder', () => {
    render(<Input id="x" label="X" value="" onChange={vi.fn()} placeholder="Digite aqui" />)
    expect(screen.getByPlaceholderText('Digite aqui')).toBeInTheDocument()
  })

  it('exibe mensagem de erro com role alert', () => {
    render(<Input id="x" label="X" value="" onChange={vi.fn()} error="Campo obrigatório" />)
    const erro = screen.getByRole('alert')
    expect(erro).toHaveTextContent('Campo obrigatório')
  })

  it('não exibe mensagem de erro quando error está vazio', () => {
    render(<Input id="x" label="X" value="" onChange={vi.fn()} error="" />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('chama onChange ao digitar', () => {
    const onChange = vi.fn()
    render(<Input id="x" label="X" value="" onChange={onChange} />)
    fireEvent.change(screen.getByLabelText('X'), { target: { value: 'teste' } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('chama onBlur ao perder foco', () => {
    const onBlur = vi.fn()
    render(<Input id="x" label="X" value="" onChange={vi.fn()} onBlur={onBlur} />)
    fireEvent.blur(screen.getByLabelText('X'))
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('usa type=text por padrão', () => {
    render(<Input id="x" label="X" value="" onChange={vi.fn()} />)
    expect(screen.getByLabelText('X')).toHaveAttribute('type', 'text')
  })

  it('usa o type informado', () => {
    render(<Input id="x" label="X" type="email" value="" onChange={vi.fn()} />)
    expect(screen.getByLabelText('X')).toHaveAttribute('type', 'email')
  })
})
