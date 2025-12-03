import { Category, OrderDetailPayload, OrderPayload, Product, BillPayload } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || error.message || 'Error inesperado');
  }
  return res.json();
}

export async function fetchProducts(search?: string): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products?skip=0&limit=100`);
  const products = await handleResponse<Product[]>(res);
  if (search) {
    return products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));
  }
  return products;
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`);
  return handleResponse<Product>(res);
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories?skip=0&limit=50`);
  return handleResponse<Category[]>(res);
}

export async function createBill(payload: BillPayload) {
  const res = await fetch(`${API_URL}/bills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<{ id_key: number }>(res);
}

export async function createOrder(payload: OrderPayload) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<{ id_key: number }>(res);
}

export async function createOrderDetail(payload: OrderDetailPayload) {
  const res = await fetch(`${API_URL}/order_details`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
