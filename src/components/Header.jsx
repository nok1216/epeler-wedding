import { Link, useLocation } from 'react-router-dom'
import styles from './Header.module.css'

export default function Header() {
  const { pathname } = useLocation()
  const isAdmin = pathname === '/admin'

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        <span className={styles.brandSerif}>epeler</span>
        <span className={styles.brandSans}> wedding</span>
      </Link>
      {isAdmin && <span className={styles.adminBadge}>管理者</span>}
    </header>
  )
}
