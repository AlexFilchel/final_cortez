import { get, post } from './client';
import { Client, ClientPayload } from '../types/client';

export async function fetchClients(): Promise<Client[]> {
  return get<Client[]>('/clients?skip=0&limit=200');
}

export async function createClient(payload: ClientPayload) {
  return post<Client>('/clients', payload);
}
