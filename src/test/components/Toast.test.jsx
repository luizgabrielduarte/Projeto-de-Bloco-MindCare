import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Toast from '../../components/Toast'

describe('Toast', () => {
  it('não renderiza quando message está vazio', () => {
    const { container } = render(<Toast message="" onClose={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('exibe a mensagem', () => {
    render(<Toast message="Salvo com sucesso!" onClose={vi.fn()} />)
    expect(screen.getByText('Salvo com sucesso!')).toBeInTheDocument()
  })

  it('exibe botão de fechar', () => {
    render(<Toast message="Mensagem" onClose={vi.fn()} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('chama onClose ao clicar em fechar', () => {
    vi.useFakeTimers()
    const onClose = vi.fn()
    render(<Toast message="Mensagem" onClose={onClose} />)
    fireEvent.click(screen.getByRole('button'))
    vi.advanceTimersByTime(500)
    expect(onClose).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })
})
