import styles from './Input.module.css'

export default function Input({ label, id, type = 'text', value, onChange, onBlur, placeholder, error }) {
  return (
    <div className={styles.group}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`${styles.field} ${error ? styles.fieldError : ''}`}
        autoComplete={type === 'password' ? 'current-password' : 'off'}
      />
      {error && <p className={styles.errorMsg} role="alert">{error}</p>}
    </div>
  )
}
