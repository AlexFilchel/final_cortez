import { createContext, useContext, useEffect, useState } from 'react';
import { Client } from '../types';
import { fetchClientById, findClientByEmail, registerClient } from '../api/client';

interface AuthContextValue {
  user: Client | null;
  loginWithId: (id: number) => Promise<void>;
  loginWithEmail: (data: Omit<Client, 'id_key'>) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loginWithId: async () => {},
  loginWithEmail: async () => {},
  logout: () => {},
  loading: false,
  error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('client');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  async function loginWithId(id: number) {
    setLoading(true);
    setError(null);
    try {
      const client = await fetchClientById(id);
      setUser(client);
      localStorage.setItem('client', JSON.stringify(client));
    } catch (err) {
      setError('No pudimos encontrar tu cuenta.');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function loginWithEmail(data: Omit<Client, 'id_key'>) {
    setLoading(true);
    setError(null);
    try {
      const existing = await findClientByEmail(data.email);
      if (existing) {
        setUser(existing);
        localStorage.setItem('client', JSON.stringify(existing));
        return;
      }
      const created = await registerClient(data);
      setUser(created);
      localStorage.setItem('client', JSON.stringify(created));
    } catch (err) {
      setError('No pudimos validar tu cuenta.');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('client');
  }

  return (
    <AuthContext.Provider value={{ user, loginWithId, loginWithEmail, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
