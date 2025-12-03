import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './CartPage.module.css';

function CartPage() {
  const { state, removeItem, setQuantity, total } = useCart();

  return (
    <div className={`container ${styles.wrapper}`}>
      <h2>Tu carrito</h2>
      {!state.items.length ? (
        <p>
          No hay productos aún. <Link to="/">Explora el catálogo</Link>
        </p>
      ) : (
        <div className={styles.grid}>
          <div className={styles.list}>
            {state.items.map((item) => (
              <div key={item.id} className={styles.row}>
                <div>
                  <p className={styles.name}>{item.name}</p>
                  <p className={styles.meta}>${item.price.toFixed(2)} c/u</p>
                </div>
                <div className={styles.controls}>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => setQuantity(item.id, Number(e.target.value))}
                  />
                  <button onClick={() => removeItem(item.id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
          <aside className={styles.summary}>
            <p className={styles.totalLabel}>Total</p>
            <p className={styles.total}>${total.toFixed(2)}</p>
            <Link to="/checkout" className={styles.cta}>
              Proceder al pago
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

export default CartPage;
