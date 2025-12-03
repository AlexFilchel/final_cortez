import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProduct } from '../api/products';
import { Product } from '../types/product';
import { useCart } from '../context/CartContext';
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProduct(id);
        setProduct(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="product-detail__card">Cargando producto...</div>;
  if (error) return <div className="product-detail__card error">{error}</div>;
  if (!product) return null;

  return (
    <div className="product-detail__card">
      <div className="product-detail__header">
        <div className="product-detail__image">🕹️</div>
        <div>
          <p className="product-detail__category">Categoría #{product.category_id ?? 'N/A'}</p>
          <h2>{product.name}</h2>
          <p className="product-detail__price">${product.price.toFixed(2)}</p>
          <p className="product-detail__stock">Disponibles: {product.stock}</p>
        </div>
      </div>
      <div className="product-detail__description">
        {product.description || 'Componentes de alto rendimiento optimizados para gaming y creadores.'}
      </div>
      <div className="product-detail__actions">
        <button className="primary" onClick={() => addToCart(product)} disabled={product.stock <= 0}>
          Añadir al carrito
        </button>
      </div>
    </div>
  );
}

export default ProductDetailPage;
