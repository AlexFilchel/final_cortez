import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

function CartPage() {
  const { items, total, updateQuantity, removeFromCart, clear } = useCart();

  if (!items.length) {
    return (
      <div className="cart card">
        <p>Tu carrito está vacío.</p>
        <Link to="/" className="cart__link">
          Explorar productos
        </Link>
      </div>
    );
  }

  return (
    <div className="cart card">
      <h2>Carrito</h2>
      <div className="cart__list">
        {items.map((item) => (
          <div key={item.id_key} className="cart__row">
            <div className="cart__info">
              <span className="cart__thumb">🎧</span>
              <div>
                <p className="cart__name">{item.name}</p>
                <p className="cart__price">${item.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="cart__controls">
              <input
                type="number"
                min={1}
                max={item.stock}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id_key, Number(e.target.value))}
              />
              <button onClick={() => removeFromCart(item.id_key)} aria-label="Eliminar">✖️</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart__footer">
        <div>
          <p className="cart__label">Total</p>
          <strong className="cart__total">${total.toFixed(2)}</strong>
        </div>
        <div className="cart__actions">
          <button className="ghost" onClick={clear}>
            Vaciar
          </button>
          <button className="primary">Proceder al pago</button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
