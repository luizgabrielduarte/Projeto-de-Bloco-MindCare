import styles from './Alert.module.css'

export default function Alert({ type = 'success', message }) {
  if (!message) return null
  return (
    <div className={`${styles.alert} ${styles[type]}`} role="alert">
      <p>{message}</p>
    </div>
  )
}