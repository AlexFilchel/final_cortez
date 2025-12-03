import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './auth/AuthModal';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [authOpen, setAuthOpen] = useState(false);
  const { items } = useCart();
  const { isAuthenticated, client, logout } = useAuth();

  useEffect(() => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (query) next.set('q', query);
      else next.delete('q');
      return next;
    });
  }, [query, setParams]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="header">
      <div className="header__content">
        <button className="header__home" onClick={() => navigate('/')}>🏠</button>
        <div className="header__search">
          <input
            type="search"
            placeholder="Buscar componentes para gaming"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="header__actions">
          <Link to="/cart" className="header__icon header__cart" aria-label="Carrito">
            🛒
            {totalItems > 0 && <span className="header__badge">{totalItems}</span>}
          </Link>
          <button className="header__icon" onClick={() => (isAuthenticated ? logout() : setAuthOpen(true))}>
            {isAuthenticated ? '🚪' : '👤'}
          </button>
        </div>
      </div>
      {isAuthenticated && (
        <div className="header__welcome">Hola, {client?.name}! Disfruta tus compras.</div>
      )}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}

export default Header;
