import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Alert from '../../components/Alert'

describe('Alert', () => {
  it('não renderiza nada quando message está vazio', () => {
    const { container } = render(<Alert message="" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('não renderiza nada quando message é undefined', () => {
    const { container } = render(<Alert />)
    expect(container).toBeEmptyDOMElement()
  })

  it('exibe a mensagem com role alert', () => {
    render(<Alert message="Ocorreu um erro" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Ocorreu um erro')
  })

  it('usa type=success por padrão', () => {
    render(<Alert message="Tudo certo!" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
