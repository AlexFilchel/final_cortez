import { createContext, useContext, useMemo, useReducer } from 'react';
import { Product } from '../types/product';

type CartItem = Product & { quantity: number };

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

type CartAction =
  | { type: 'add'; product: Product }
  | { type: 'remove'; id: number }
  | { type: 'update'; id: number; quantity: number }
  | { type: 'clear' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const exists = state.items.find((item) => item.id_key === action.product.id_key);
      if (exists) {
        return {
          items: state.items.map((item) =>
            item.id_key === action.product.id_key
              ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
              : item,
          ),
        };
      }
      return { items: [...state.items, { ...action.product, quantity: 1 }] };
    }
    case 'remove':
      return { items: state.items.filter((item) => item.id_key !== action.id) };
    case 'update':
      return {
        items: state.items.map((item) =>
          item.id_key === action.id ? { ...item, quantity: Math.min(action.quantity, item.stock) } : item,
        ),
      };
    case 'clear':
      return initialState;
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  total: number;
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const value = useMemo<CartContextValue>(() => {
    const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      items: state.items,
      total,
      addToCart: (product) => dispatch({ type: 'add', product }),
      removeFromCart: (id) => dispatch({ type: 'remove', id }),
      updateQuantity: (id, quantity) => dispatch({ type: 'update', id, quantity }),
      clear: () => dispatch({ type: 'clear' }),
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
