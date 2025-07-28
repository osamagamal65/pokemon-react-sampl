// src/setupTests.ts
import '@testing-library/jest-dom/vitest';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { vi } from 'vitest';

// Extend Vitest's expect with jest-dom matchers
expect.extend({
  // Add any custom matchers here if needed
});

// Mock browser APIs if needed
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Clean up after each test
// This ensures that tests are isolated from each other
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});