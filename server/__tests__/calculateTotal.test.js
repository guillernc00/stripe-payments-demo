import { describe, it, expect } from '@jest/globals';
import { calculateTotal } from '../utils/calculateTotal.js';

const mockProducts = [
  { id: 'wireless-headphones', name: 'Wireless Headphones', price: 14999 },
  { id: 'smart-watch', name: 'Smart Watch', price: 29999 },
  { id: 'laptop-stand', name: 'Laptop Stand', price: 7999 },
];

describe('calculateTotal', () => {
  it('returns correct total for a single item', () => {
    const items = [{ id: 'smart-watch', quantity: 1 }];
    expect(calculateTotal(items, mockProducts)).toBe(29999);
  });

  it('returns correct total for multiple items with quantities', () => {
    const items = [
      { id: 'wireless-headphones', quantity: 2 },
      { id: 'laptop-stand', quantity: 1 },
    ];
    expect(calculateTotal(items, mockProducts)).toBe(37997);
  });

  it('throws an error for unknown product id', () => {
    const items = [{ id: 'fake-product', quantity: 1 }];
    expect(() => calculateTotal(items, mockProducts)).toThrow('Product not found: fake-product');
  });

  it('returns 0 for empty items array', () => {
    expect(calculateTotal([], mockProducts)).toBe(0);
  });

  it('returns 0 when items is null', () => {
    expect(calculateTotal(null, mockProducts)).toBe(0);
  });
});