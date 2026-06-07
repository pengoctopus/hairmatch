import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './NavBar.module.css'

const navItems = [
  { path: '/', label: '首页' },
  { path: '/privacy', label: '隐私设置' },
  { path: '/input', label: '信息录入' },
  { path: '/loading', label: '智能匹配' },
  { path: '/review', label: '评价' },
]

export default function NavBar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className={styles.navbar}>
      <div className={styles.navInner}>
        <Link to="/" className={styles.logo}>
          HairMatch
        </Link>

        <ul className={styles.navLinks}>
          {navItems.map(item => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.navRight}>
          <span className={styles.icon}>🔍</span>
          <span className={styles.icon}>👤</span>
          <div className={styles.moreMenu}>
            <button className={styles.moreBtn} onClick={() => setMenuOpen(!menuOpen)}>
              更多 ▾
            </button>
            {menuOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownItem}>关于我们</div>
                <div className={styles.dropdownItem}>帮助中心</div>
                <div className={styles.dropdownItem}>联系客服</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
