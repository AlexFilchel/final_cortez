import { createContext, useContext, useMemo, useState } from 'react';
import { Client, ClientPayload } from '../types/client';
import { createClient, fetchClients } from '../api/clients';

interface AuthContextValue {
  client: Client | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginOrRegister: (payload: ClientPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);

  const value = useMemo<AuthContextValue>(() => ({
    client,
    isAuthenticated: Boolean(client),
    loading,
    loginOrRegister: async (payload: ClientPayload) => {
      setLoading(true);
      try {
        try {
          const created = await createClient(payload);
          setClient(created);
        } catch (err) {
          const clients = await fetchClients();
          const existing = clients.find((c) => c.email === payload.email);
          if (!existing) throw err;
          setClient(existing);
        }
      } finally {
        setLoading(false);
      }
    },
    logout: () => setClient(null),
  }), [client, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
