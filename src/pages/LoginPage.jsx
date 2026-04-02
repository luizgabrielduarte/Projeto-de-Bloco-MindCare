import { useState } from 'react'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import Alert from '../components/Alert.jsx'
import styles from './LoginPage.module.css'

const USUARIOS = [
  { usuario: 'admin', senha: '123' },
]

export default function LoginPage() {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSucesso(false)

    if (!usuario.trim() || !senha.trim()) {
      setErro('Preencha todos os campos.')
      return
    }

    setLoading(true)

    setTimeout(() => {
      const encontrado = USUARIOS.find(
        u => u.usuario === usuario.trim() && u.senha === senha
      )

      if (encontrado) {
        setSucesso(true)
      } else {
        setErro('Usuário ou senha incorretos.')
      }

      setLoading(false)
    }, 800)
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>

        <div className={styles.header}>
          <h1>MindCare</h1>
          <p>Acesse sua conta para continuar</p>
        </div>

        {sucesso ? (
          <div className={styles.success}>
            <Alert type="success" message="Login realizado com sucesso! Bem-vindo(a) ao MindCare." />
            <p className={styles.hint}>Você está autenticado como <strong>{usuario}</strong>.</p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <Alert type="error" message={erro} />

            <Input
              id="usuario"
              label="Usuário"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              placeholder="Digite seu usuário"
              error={erro && !usuario.trim() ? 'Campo obrigatório' : ''}
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
          </form>
        )}
      </div>
    </main>
  )
}