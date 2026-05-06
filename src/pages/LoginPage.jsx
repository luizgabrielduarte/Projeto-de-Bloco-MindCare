import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import Alert from '../components/Alert.jsx'
import Toast from '../components/Toast.jsx'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const location = useLocation()

  useEffect(() => {
    if (location.state?.cadastroSucesso) {
      setToast('Conta criada com sucesso! Faça login para continuar.')
      window.history.replaceState({}, '')
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!email.trim() || !senha.trim()) {
      setErro('Preencha todos os campos.')
      return
    }

    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha)
      setToast('Login realizado com sucesso!')
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setErro('E-mail ou senha incorretos.')
          break
        case 'auth/invalid-email':
          setErro('E-mail inválido.')
          break
        case 'auth/too-many-requests':
          setErro('Muitas tentativas. Tente novamente mais tarde.')
          break
        default:
          setErro('Erro ao entrar. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>

        <div className={styles.header}>
          <h1>MindCare</h1>
          <p>Acesse sua conta para continuar</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Alert type="error" message={erro} />

          <Input
            id="email"
            label="E-mail"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            error={erro && !email.trim() ? 'Campo obrigatório' : ''}
          />

          <Input
            id="senha"
            label="Senha"
            type="password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            placeholder="Digite sua senha"
            error={erro && !senha.trim() ? 'Campo obrigatório' : ''}
          />

          <Button type="submit" loading={loading} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          <p className={styles.hint}>
            Não tem conta?{' '}
            <Link to="/cadastro" className={styles.link}>Cadastre-se</Link>
          </p>
        </form>
      </div>

      <Toast
        message={toast}
        type="success"
        onClose={() => setToast('')}
      />
    </main>
  )
}