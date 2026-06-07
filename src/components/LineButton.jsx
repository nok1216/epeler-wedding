import styles from './LineButton.module.css'

const LINE_URL = 'https://lin.ee/RW8v8Ma'

export default function LineButton({ label = 'この日程で相談する', selectedDate }) {
  return (
    <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className={styles.btn}>
      <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.145 2 11.243c0 3.131 1.635 5.91 4.196 7.695-.182.682-.659 2.473-.755 2.857-.12.475.174.469.365.34.151-.1 2.403-1.596 3.376-2.246.585.082 1.18.124 1.818.124 5.523 0 10-4.145 10-9.243S17.523 2 12 2z"/>
      </svg>
      {label}
    </a>
  )
}
