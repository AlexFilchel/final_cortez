import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../api/products';
import ProductGrid from '../components/ProductGrid';
import { Product } from '../types/product';
import './HomePage.css';

function HomePage() {
  const [params] = useSearchParams();
  const query = params.get('q') ?? '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!query) return products;
    return products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  }, [products, query]);

  return (
    <div className="home">
      <div className="home__hero">
        <div>
          <p className="home__eyebrow">Componentes pro</p>
          <h1>Construye tu setup gamer soñado</h1>
          <p className="home__subtitle">GPUs, teclados mecánicos, fuentes de poder y más.</p>
        </div>
        <div className="home__stats">
          <div>
            <strong>+200</strong>
            <span>Productos</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>Soporte</span>
          </div>
          <div>
            <strong>48h</strong>
            <span>Envíos</span>
          </div>
        </div>
      </div>
      {error && <div className="home__error">{error}</div>}
      {loading ? <div className="home__loading">Cargando catálogo...</div> : <ProductGrid products={filtered} />}
    </div>
  );
}

export default HomePage;
