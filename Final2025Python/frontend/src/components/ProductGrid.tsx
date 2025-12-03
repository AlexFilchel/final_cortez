import { Product } from '../types/product';
import ProductCard from './ProductCard';
import './ProductGrid.css';

interface Props {
  products: Product[];
}

function ProductGrid({ products }: Props) {
  if (!products.length) {
    return <div className="product-grid__empty">No encontramos productos para tu búsqueda.</div>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id_key} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
