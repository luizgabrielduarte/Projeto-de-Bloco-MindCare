import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const close = () => setOpen(false)
  const isActive = (path) => location.pathname === path

  return (
    <>
      <nav className={styles.nav}>
        <Link to="/" className={styles.brand} onClick={close}>
          <span className={styles.brandName}>MindCare</span>
        </Link>

        {/*Links*/}
        <div className={styles.desktopLinks}>
          <Link to="/" className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`}>Início</Link>
          <Link to="/login" className={`${styles.navLink} ${isActive('/login') ? styles.navLinkActive : ''}`}>Entrar</Link>
          <Link to="/cadastro" className={styles.navBtn}>Cadastrar</Link>
        </div>

        {/*Hamburger*/}
        <button
          className={`${styles.hamburger} ${open ? styles.hamburgerOpen : ''}`}
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>
      </nav>

      {/*Mobile overlay*/}
      <div
        className={`${styles.overlay} ${open ? styles.overlayVisible : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      {/*Mobile drawer*/}
      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`} aria-hidden={!open}>
        <div className={styles.drawerHeader}>
          <img src="/mindcare-logo.png" alt="MindCare" className={styles.drawerLogo} />
          <span className={styles.drawerBrandName}>MindCare</span>
        </div>
        <nav className={styles.drawerNav}>
          <Link to="/" className={`${styles.drawerLink} ${isActive('/') ? styles.drawerLinkActive : ''}`} onClick={close}>
            Início
          </Link>
          <Link to="/login" className={`${styles.drawerLink} ${isActive('/login') ? styles.drawerLinkActive : ''}`} onClick={close}>
            Entrar
          </Link>
          <Link to="/cadastro" className={`${styles.drawerLink} ${isActive('/cadastro') ? styles.drawerLinkActive : ''}`} onClick={close}>
            Cadastrar
          </Link>
        </nav>
      </div>
    </>
  )
}
