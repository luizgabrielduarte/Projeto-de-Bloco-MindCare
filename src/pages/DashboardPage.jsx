import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import Button from '../components/Button.jsx'
import styles from './Dashboard.module.css'

const rotuloRole = {
  paciente: 'Paciente',
  profissional: 'Profissional',
}

export default function DashboardPage() {
  const { perfil, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  const nomeCompleto = perfil
    ? `${perfil.nome ?? ''} ${perfil.sobrenome ?? ''}`.trim()
    : ''
  const iniciais = nomeCompleto
    ? nomeCompleto.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.avatarWrap}>
          {perfil?.foto ? (
            <img src={perfil.foto} alt={nomeCompleto} className={styles.avatar} />
          ) : (
            <div className={styles.avatarFallback}>{iniciais}</div>
          )}
        </div>

        <h1 className={styles.nome}>{nomeCompleto || 'Bem-vindo'}</h1>

        <span className={styles.badge}>
          {rotuloRole[perfil?.role] ?? 'Paciente'}
        </span>

        <p className={styles.texto}>
          Você está logado como{' '}
          <strong>{rotuloRole[perfil?.role] ?? 'paciente'}</strong>.
        </p>

        <div className={styles.acoes}>
          <Button variant="secondary" onClick={() => navigate('/perfil')}>Editar perfil</Button>
          <Button variant="primary" onClick={handleLogout}>Sair</Button>
        </div>
      </div>
    </main>
  )
}
