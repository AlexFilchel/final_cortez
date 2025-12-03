import { createContext, useContext, useMemo, useReducer } from 'react';

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: 'ADD'; payload: CartItem }
  | { type: 'REMOVE'; payload: { id: number } }
  | { type: 'CLEAR' }
  | { type: 'SET_QUANTITY'; payload: { id: number; quantity: number } };

const CartContext = createContext<{
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  clear: () => void;
  setQuantity: (id: number, quantity: number) => void;
  total: number;
}>({
  state: { items: [] },
  addItem: () => {},
  removeItem: () => {},
  clear: () => {},
  setQuantity: () => {},
  total: 0,
});

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        return {
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item,
          ),
        };
      }
      return { items: [...state.items, action.payload] };
    }
    case 'REMOVE':
      return { items: state.items.filter((item) => item.id !== action.payload.id) };
    case 'SET_QUANTITY':
      return {
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
        ),
      };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  const total = useMemo(
    () => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.items],
  );

  const value = useMemo(
    () => ({
      state,
      addItem: (item: CartItem) => dispatch({ type: 'ADD', payload: item }),
      removeItem: (id: number) => dispatch({ type: 'REMOVE', payload: { id } }),
      clear: () => dispatch({ type: 'CLEAR' }),
      setQuantity: (id: number, quantity: number) =>
        dispatch({ type: 'SET_QUANTITY', payload: { id, quantity } }),
      total,
    }),
    [total, state],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
