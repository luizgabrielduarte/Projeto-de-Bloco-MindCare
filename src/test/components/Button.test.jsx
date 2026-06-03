import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from '../../components/Button'

describe('Button', () => {
  it('renderiza o texto filho', () => {
    render(<Button>Entrar</Button>)
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('fica desabilitado quando disabled=true', () => {
    render(<Button disabled>Entrar</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('fica desabilitado e exibe spinner quando loading=true', () => {
    render(<Button loading>Entrar</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('chama onClick ao ser clicado', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Clique</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('não chama onClick quando desabilitado', () => {
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Clique</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
