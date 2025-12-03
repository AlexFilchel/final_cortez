import { Client } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || error.message || 'Error inesperado');
  }
  return res.json();
}

export async function fetchClients(): Promise<Client[]> {
  const res = await fetch(`${API_URL}/clients?skip=0&limit=200`);
  return handleResponse<Client[]>(res);
}

export async function fetchClientById(id: number): Promise<Client> {
  const res = await fetch(`${API_URL}/clients/${id}`);
  return handleResponse<Client>(res);
}

export async function registerClient(data: Omit<Client, 'id_key'>): Promise<Client> {
  const res = await fetch(`${API_URL}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Client>(res);
}

export async function findClientByEmail(email: string): Promise<Client | null> {
  const clients = await fetchClients();
  return clients.find((client) => client.email.toLowerCase() === email.toLowerCase()) || null;
}
