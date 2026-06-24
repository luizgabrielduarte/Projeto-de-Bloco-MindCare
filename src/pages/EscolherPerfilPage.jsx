import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import styles from './EscolherPerfilPage.module.css'

export default function EscolherPerfilPage() {
  const navigate = useNavigate()
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)
  const touchStartTime = useRef(null)

  useEffect(() => {
    const onTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX
      touchStartY.current = e.touches[0].clientY
      touchStartTime.current = Date.now()
    }
    const onTouchEnd = (e) => {
      if (touchStartX.current === null) return
      const dx = e.changedTouches[0].clientX - touchStartX.current
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current)
      const dt = Date.now() - touchStartTime.current
      if (dx > 60 && dy < 80 && dt < 500) navigate('/')
      touchStartX.current = null
    }
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [navigate])

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1>Criar conta</h1>
          </div>

          <div className={styles.opcoes}>
            <Link to="/cadastro/paciente" className={styles.opcao}>
              <span className={styles.titulo}>Paciente</span>
              <span className={styles.desc}>Quero encontrar um psicólogo</span>
            </Link>

            <Link to="/cadastro/profissional" className={styles.opcao}>
              <span className={styles.titulo}>Profissional</span>
              <span className={styles.desc}>Quero oferecer meus serviços</span>
            </Link>
          </div>

          <p className={styles.hint}>
            Já tem conta?{' '}
            <Link to="/login" className={styles.link}>Entrar</Link>
          </p>
        </div>
      </main>
    </>
  )
}
