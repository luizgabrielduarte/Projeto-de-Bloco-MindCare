import { useEffect, useState } from 'react'
import styles from './Toast.module.css'

export default function Toast({ message, type = 'success', duration = 3500, onClose }) {
  const [saindo, setSaindo] = useState(false)

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setSaindo(true), duration)
    const timerClose = setTimeout(() => onClose?.(), duration + 400)
    return () => {
      clearTimeout(timer)
      clearTimeout(timerClose)
    }
  }, [message])

  if (!message) return null

  return (
    <div className={`${styles.toast} ${styles[type]} ${saindo ? styles.saindo : ''}`}>
      <span className={styles.texto}>{message}</span>
      <button className={styles.fechar} onClick={() => { setSaindo(true); setTimeout(() => onClose?.(), 400) }}>
        ✕
      </button>
    </div>
  )
}