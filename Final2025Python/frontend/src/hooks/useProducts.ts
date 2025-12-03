import { useEffect, useState } from 'react';
import { fetchCategories, fetchProducts } from '../api/product';
import { Category, Product } from '../types';

export function useProducts(search?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [prodData, catData] = await Promise.all([fetchProducts(search), fetchCategories()]);
        setProducts(prodData);
        setCategories(catData);
      } catch (err) {
        setError('No pudimos obtener los productos.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search]);

  return { products, categories, loading, error };
}
