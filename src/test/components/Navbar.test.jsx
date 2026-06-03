import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../../components/Navbar'

function renderNavbar(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
    </MemoryRouter>
  )
}

describe('Navbar', () => {
  it('exibe o nome da marca', () => {
    renderNavbar()
    expect(screen.getAllByText('MindCare').length).toBeGreaterThan(0)
  })

  it('renderiza o botão hamburger', () => {
    renderNavbar()
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toBeInTheDocument()
  })

  it('abre o drawer ao clicar no hamburger', () => {
    renderNavbar()
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toBeInTheDocument()
  })

  it('fecha o drawer ao clicar no overlay', () => {
    renderNavbar()
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))
    const overlay = document.querySelector('[aria-hidden="true"]')
    fireEvent.click(overlay)
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toBeInTheDocument()
  })

  it('links do drawer apontam para as rotas corretas', () => {
    renderNavbar()
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))
    const links = screen.getAllByRole('link')
    const hrefs = links.map(l => l.getAttribute('href'))
    expect(hrefs).toContain('/')
    expect(hrefs).toContain('/login')
    expect(hrefs).toContain('/cadastro')
  })
})
