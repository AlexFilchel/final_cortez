import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import LoginModal from './LoginModal';
import styles from './Header.module.css';
import { useState } from 'react';

function Header() {
  const { state } = useCart();
  const { user, logout } = useAuth();
  const { term, setTerm } = useSearch();
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.bar}>
          <Link to="/" className={styles.home} aria-label="Inicio">
            <span className={styles.house}>🏠</span>
            <span className={styles.brand}>ElectroGaming</span>
          </Link>

          <form className={styles.search} onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Buscar componentes, GPUs, periféricos..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            <button type="submit">Buscar</button>
          </form>

          <div className={styles.actions}>
            <Link to="/cart" className={styles.iconButton} aria-label="Carrito">
              <span className={styles.bubble}>{itemCount}</span>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M6 6h15l-1.5 9h-12z" />
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="18" cy="20" r="1.4" />
              </svg>
            </Link>

            {user ? (
              <button className={styles.profile} onClick={logout}>
                <span className={styles.avatar}>{user.name.charAt(0)}</span>
                <span className={styles.profileLabel}>Cerrar sesión</span>
              </button>
            ) : (
              <button className={styles.profile} onClick={() => setShowLogin(true)}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c1.5-3 4.5-5 8-5s6.5 2 8 5" />
                </svg>
                <span className={styles.profileLabel}>Iniciar sesión</span>
              </button>
            )}
          </div>
        </div>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </header>
  );
}

export default Header;
