import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from '../../pages/LandingPage'

function renderLanding() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <LandingPage />
    </MemoryRouter>
  )
}

describe('LandingPage', () => {
  it('exibe o título principal', () => {
    renderLanding()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('exibe o link para encontrar psicólogo', () => {
    renderLanding()
    expect(screen.getByRole('link', { name: /encontrar psicólogo/i })).toHaveAttribute('href', '/login')
  })

  it('exibe o link para cadastro de psicólogo', () => {
    renderLanding()
    expect(screen.getByRole('link', { name: /sou psicólogo/i })).toHaveAttribute('href', '/cadastro')
  })

  it('exibe a seção sobre nós', () => {
    renderLanding()
    expect(screen.getByText(/sobre nós/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('exibe o footer', () => {
    renderLanding()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByText(/MindCare/i, { selector: 'footer *' })).toBeInTheDocument()
  })
})
