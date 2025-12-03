import { get } from './client';
import { Product } from '../types/product';

export async function fetchProducts(search?: string): Promise<Product[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '?skip=0&limit=50';
  return get<Product[]>(`/products${query}`);
}

export async function fetchProduct(id: string) {
  return get<Product>(`/products/${id}`);
}
