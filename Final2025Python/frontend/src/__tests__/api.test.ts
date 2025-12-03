import { describe, expect, it, vi } from 'vitest';
import { API_BASE_URL, get, post } from '../api/client';

const mockResponse = (data: unknown, ok = true, status = 200) =>
  Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(typeof data === 'string' ? data : JSON.stringify(data)),
  } as Response);

describe('api client', () => {
  it('calls GET with base url', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockImplementation(() => mockResponse({ hello: 'world' }));
    const data = await get('/products');
    expect(data).toEqual({ hello: 'world' });
    expect(spy).toHaveBeenCalledWith(`${API_BASE_URL}/products`, expect.any(Object));
    spy.mockRestore();
  });

  it('throws on http errors', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(() => mockResponse({ detail: 'fail' }, false, 400));
    await expect(post('/products', { name: 'gpu' })).rejects.toThrow();
    spy.mockRestore();
  });
});
