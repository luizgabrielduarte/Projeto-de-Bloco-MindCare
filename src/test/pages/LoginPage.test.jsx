import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import LoginPage from '../../pages/LoginPage'

vi.mock('../../firebase', () => ({ auth: {} }))
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  getAuth: vi.fn(),
}))

function renderLogin(state = {}) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/login', state }]}>
      <LoginPage />
    </MemoryRouter>
  )
}

describe('LoginPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renderiza os campos de e-mail e senha', () => {
    renderLogin()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('renderiza o botão de entrar', () => {
    renderLogin()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('exibe erro ao submeter com campos vazios', async () => {
    renderLogin()
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => {
      const alerts = screen.getAllByRole('alert')
      const textos = alerts.map(a => a.textContent)
      expect(textos.some(t => t.includes('Preencha todos os campos.'))).toBe(true)
    })
  })

  it('não chama firebase com campos vazios', async () => {
    renderLogin()
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => screen.getAllByRole('alert'))
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled()
  })

  it('chama firebase com e-mail e senha preenchidos', async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({})
    renderLogin()
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'test@mail.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, 'test@mail.com', '123456')
    })
  })

  it('exibe erro de credencial inválida', async () => {
    signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/invalid-credential' })
    renderLogin()
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'x@x.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'errada' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('E-mail ou senha incorretos.')
    })
  })

  it('exibe erro de muitas tentativas', async () => {
    signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/too-many-requests' })
    renderLogin()
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'x@x.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Muitas tentativas.')
    })
  })

  it('exibe link para cadastro', () => {
    renderLogin()
    expect(screen.getByRole('link', { name: /cadastre-se/i })).toHaveAttribute('href', '/cadastro')
  })
})
