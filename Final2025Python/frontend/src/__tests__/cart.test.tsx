import { describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';

function setup() {
  const wrapper = ({ children }: { children: React.ReactNode }) => <CartProvider>{children}</CartProvider>;
  const { result } = renderHook(() => useCart(), { wrapper });
  return result;
}

describe('CartContext', () => {
  it('adds and updates products', () => {
    const result = setup();

    act(() => result.current.addItem({ id: 1, name: 'GPU', price: 100, quantity: 1 }));
    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.total).toBe(100);

    act(() => result.current.addItem({ id: 1, name: 'GPU', price: 100, quantity: 2 }));
    expect(result.current.state.items[0].quantity).toBe(3);
    expect(result.current.total).toBe(300);
  });
});
