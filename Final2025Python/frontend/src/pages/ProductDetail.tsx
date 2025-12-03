import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProduct } from '../api/product';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import styles from './ProductDetail.module.css';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading');
  const { addItem } = useCart();

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await fetchProduct(Number(id));
        setProduct(data);
        setStatus('ready');
      } catch (err) {
        setStatus('error');
      }
    }
    load();
  }, [id]);

  if (status === 'loading') return <p className={styles.state}>Cargando producto...</p>;
  if (status === 'error' || !product) return <p className={styles.state}>No encontramos este producto.</p>;

  return (
    <div className={`container ${styles.layout}`}>
      <div className={styles.visual}>
        <div className={styles.mockImage}>🎧</div>
      </div>
      <div className={styles.info}>
        <p className={styles.category}>{product.category?.name}</p>
        <h2>{product.name}</h2>
        <p className={styles.price}>${product.price.toFixed(2)}</p>
        <p className={styles.stock}>{product.stock} unidades disponibles</p>
        <p className={styles.description}>
          Rendimiento de siguiente nivel para gamers exigentes. Compatible con las principales marcas y
          listo para configuraciones overclock.
        </p>
        <div className={styles.actions}>
          <button
            onClick={() =>
              addItem({ id: product.id_key, name: product.name, price: product.price, quantity: 1 })
            }
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
