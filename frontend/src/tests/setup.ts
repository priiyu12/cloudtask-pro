import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
});

global.fetch = vi.fn().mockResolvedValue({
  json: () => Promise.resolve({}),
  ok: true,
});

afterEach(() => {
  cleanup();
});
