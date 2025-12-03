import { Link } from 'react-router-dom';
import { Product } from '../types/product';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

interface Props {
  product: Product;
}

function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  return (
    <article className="product-card">
      <div className="product-card__thumb" aria-hidden>
        <span>🎮</span>
      </div>
      <div className="product-card__body">
        <h3>{product.name}</h3>
        <p className="product-card__price">${product.price.toFixed(2)}</p>
        <p className="product-card__stock">Stock: {product.stock}</p>
        <div className="product-card__actions">
          <Link to={`/products/${product.id_key}`} className="product-card__link">
            Ver detalle
          </Link>
          <button onClick={() => addToCart(product)} disabled={product.stock <= 0}>
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
