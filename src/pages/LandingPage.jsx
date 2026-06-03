import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import styles from './LandingPage.module.css'

export default function LandingPage() {
  const navigate = useNavigate()
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)
  const touchStartTime = useRef(null)

  // Gesto celular
  useEffect(() => {
    const onTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX
      touchStartY.current = e.touches[0].clientY
      touchStartTime.current = Date.now()
    }

    const onTouchEnd = (e) => {
      if (touchStartX.current === null) return

      const dx = touchStartX.current - e.changedTouches[0].clientX
      const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY)
      const dt = Date.now() - touchStartTime.current

      // Horizontal swipe: fast enough, far enough, not mostly vertical
      const isSwipeLeft  = dx > 60 && dy < 80 && dt < 500
      const isSwipeRight = dx < -60 && dy < 80 && dt < 500

      if (isSwipeLeft)  navigate('/login')
      if (isSwipeRight) { /* already on home, nothing */ }

      touchStartX.current = null
      touchStartY.current = null
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend',   onTouchEnd,   { passive: true })
    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend',   onTouchEnd)
    }
  }, [navigate])

  return (
    <div className={styles.page}>
      <Navbar />

      {/*Hero*/}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />

        <div className={styles.heroContent}>
          <img
            src="/mindcare-logo.png"
            alt="MindCare"
            className={styles.heroLogo}
          />

          <h1 className={styles.heroTitle}>
            Cuide da sua mente<br />
            <em>com quem entende.</em>
          </h1>

          <p className={styles.heroSub}>
            Encontre psicólogos qualificados ou anuncie sua prática.
          </p>

          <div className={styles.heroCtas}>
            <Link to="/login"    className={styles.ctaPrimary}>Encontrar Psicólogo</Link>
            <Link to="/cadastro" className={styles.ctaSecondary}>Sou Psicólogo</Link>
          </div>

          <span className={styles.swipeHint} aria-hidden="true">
            deslize ← para entrar
          </span>
        </div>
      </section>

      {/*Sobre*/}
      <section className={styles.about}>
        <div className={styles.aboutInner}>
          <span className={styles.tag}>Sobre nós</span>

          <h2 className={styles.aboutTitle}>
            Respeito e responsabilidade em cada conexão
          </h2>

          <p className={styles.aboutText}>
            O MindCare nasceu da crença de que o acesso à saúde mental deve ser
            simples, humano e seguro. Conectamos pacientes a psicólogos com
            total transparência — sem intermediários desnecessários.
          </p>

          <p className={styles.aboutText}>
            Psicólogos destacam suas especialidades com ética. Pacientes
            encontram o profissional certo com clareza.
          </p>

        </div>
      </section>

      {/*Footer*/}
      <footer className={styles.footer}>
        <p className={styles.footerText}>© 2026 MindCare · Todos os direitos reservados</p>
      </footer>
    </div>
  )
}
