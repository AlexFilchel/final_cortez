import { useMemo, useState } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import { useProducts } from '../hooks/useProducts';
import { useSearch } from '../context/SearchContext';
import styles from './Home.module.css';

function Home() {
  const { term } = useSearch();
  const [category, setCategory] = useState<number | null>(null);
  const { products, categories, loading, error } = useProducts(term);

  const filtered = useMemo(() => {
    if (!category) return products;
    return products.filter((product) => product.category_id === category);
  }, [products, category]);

  return (
    <div className="container">
      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Gaming Pro</p>
          <h1>Componentes de alto desempeño listos para competir</h1>
          <p className={styles.lead}>
            GPUs, motherboards, teclados y audio optimizados para esports. Envíos express y stock
            actualizado en tiempo real.
          </p>
          <div className={styles.tags}>
            <span>Stock en vivo</span>
            <span>Soporte 24/7</span>
            <span>Pagos seguros</span>
          </div>
        </div>
        <div className={styles.panel}>
          <p className={styles.panelTitle}>Resultados</p>
          <p className={styles.panelSubtitle}>Encuentra el equipo que necesitas hoy</p>
          <div className={styles.stats}>
            <div>
              <p className={styles.statNumber}>{products.length}</p>
              <p className={styles.statLabel}>Productos activos</p>
            </div>
            <div>
              <p className={styles.statNumber}>{categories.length}</p>
              <p className={styles.statLabel}>Categorías</p>
            </div>
          </div>
        </div>
      </section>

      <CategoryFilter categories={categories} active={category} onSelect={setCategory} />

      {loading && <p className={styles.status}>Cargando productos...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && <ProductGrid products={filtered} />}
    </div>
  );
}

export default Home;
