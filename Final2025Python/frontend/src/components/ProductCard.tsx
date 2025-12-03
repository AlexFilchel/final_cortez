import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import styles from './ProductCard.module.css';

interface Props {
  product: Product;
}

function ProductCard({ product }: Props) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      id: product.id_key,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.thumb}>
        <span className={styles.badge}>{product.category?.name ?? 'Gaming'}</span>
        <div className={styles.imagePlaceholder} aria-hidden>
          <span>🎮</span>
        </div>
      </div>
      <div className={styles.body}>
        <Link to={`/products/${product.id_key}`} className={styles.title}>
          {product.name}
        </Link>
        <p className={styles.price}>${product.price.toFixed(2)}</p>
        <p className={styles.meta}>{product.stock} en stock</p>
      </div>
      <div className={styles.actions}>
        <button onClick={handleAdd}>Agregar al carrito</button>
        <Link to={`/products/${product.id_key}`} className={styles.secondary}>
          Ver detalles
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
