import logo from '../logo.svg'
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Header({ loggedIn, handleLogout, userEmail }) {
  const currentUser = useContext(CurrentUserContext)
  const currentPath = useLocation().pathname
  const linkTo = currentPath === '/signup' ? '/singin' : '/signup'
  const linkText = currentPath === '/signin' ? 'Sign up' : 'Log in'
  return (
    <header className="header">
      <img src={logo} alt="Around the US Logo" className="header__logo" />
      {loggedIn ? (
        <div className="header__log-info">
          <div className="header__user-email">{userEmail}</div>
          <div className="header__logout" onClick={handleLogout}>
            Log out
          </div>
        </div>
      ) : (
        <Link to={linkTo} className="header___link">
          {linkText}
        </Link>
      )}
    </header>
  )
}
export default Header
