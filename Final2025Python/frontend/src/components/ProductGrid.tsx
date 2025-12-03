import { Product } from '../types';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

interface Props {
  products: Product[];
}

function ProductGrid({ products }: Props) {
  if (!products.length) {
    return <p className={styles.empty}>No encontramos productos con ese criterio.</p>;
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id_key} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
