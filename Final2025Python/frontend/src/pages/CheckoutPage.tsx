import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createBill, createOrder, createOrderDetail } from '../api/product';
import { registerClient } from '../api/client';
import styles from './CheckoutPage.module.css';

function CheckoutPage() {
  const { state, total, clear } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name ?? '',
    lastname: user?.lastname ?? '',
    email: user?.email ?? '',
    telephone: user?.telephone ?? '',
    delivery_method: 'HOME_DELIVERY',
    payment_type: 'CARD',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const disabled = !state.items.length || !form.name || !form.lastname || !form.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const clientId =
        user?.id_key ||
        (await registerClient({
          name: form.name,
          lastname: form.lastname,
          email: form.email,
          telephone: form.telephone,
        })).id_key;

      const bill = await createBill({
        bill_number: `B-${Date.now()}`,
        date: new Date().toISOString(),
        total,
        payment_type: form.payment_type,
        client_id: clientId,
      });

      const order = await createOrder({
        total,
        delivery_method: form.delivery_method,
        status: 'PENDING',
        client_id: clientId,
        bill_id: bill.id_key,
      });

      await Promise.all(
        state.items.map((item) =>
          createOrderDetail({
            quantity: item.quantity,
            price: item.price,
            order_id: order.id_key,
            product_id: item.id,
          }),
        ),
      );

      setStatus('success');
      setMessage('Pedido registrado y en preparación. ¡Gracias por tu compra!');
      clear();
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setStatus('error');
      setMessage('No pudimos completar tu pedido. Intenta de nuevo.');
    }
  };

  return (
    <div className={`container ${styles.wrapper}`}>
      <h2>Checkout</h2>
      <div className={styles.grid}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3>Datos del cliente</h3>
          <div className={styles.inline}>
            <input
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              placeholder="Apellido"
              value={form.lastname}
              onChange={(e) => setForm({ ...form, lastname: e.target.value })}
              required
            />
          </div>
          <input
            type="email"
            placeholder="Correo"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            placeholder="Teléfono"
            value={form.telephone}
            onChange={(e) => setForm({ ...form, telephone: e.target.value })}
          />

          <div className={styles.inline}>
            <label className={styles.field}>
              <span>Método de entrega</span>
              <select
                value={form.delivery_method}
                onChange={(e) => setForm({ ...form, delivery_method: e.target.value })}
              >
                <option value="DRIVE_THRU">Drive-thru</option>
                <option value="ON_HAND">En tienda</option>
                <option value="HOME_DELIVERY">Domicilio</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>Pago</span>
              <select
                value={form.payment_type}
                onChange={(e) => setForm({ ...form, payment_type: e.target.value })}
              >
                <option value="CARD">Tarjeta</option>
                <option value="CASH">Efectivo</option>
                <option value="DEBIT">Débito</option>
                <option value="CREDIT">Crédito</option>
                <option value="BANK_TRANSFER">Transferencia</option>
              </select>
            </label>
          </div>

          {message && <p className={status === 'error' ? styles.error : styles.success}>{message}</p>}

          <button className={styles.submit} type="submit" disabled={disabled || status === 'loading'}>
            {status === 'loading' ? 'Procesando...' : 'Confirmar pedido'}
          </button>
        </form>

        <aside className={styles.summary}>
          <h3>Resumen</h3>
          <div className={styles.lines}>
            {state.items.map((item) => (
              <div key={item.id} className={styles.line}>
                <p>
                  {item.name} x{item.quantity}
                </p>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className={styles.lineTotal}>
            <p>Total</p>
            <p>${total.toFixed(2)}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CheckoutPage;
