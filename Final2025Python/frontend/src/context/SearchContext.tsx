import { createContext, useContext, useState } from 'react';

const SearchContext = createContext<{
  term: string;
  setTerm: (term: string) => void;
}>({ term: '', setTerm: () => {} });

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [term, setTerm] = useState('');
  return <SearchContext.Provider value={{ term, setTerm }}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  return useContext(SearchContext);
}
