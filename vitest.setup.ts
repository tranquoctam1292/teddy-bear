/**
 * Vitest Setup File
 * Configure testing environment for React components
 */

import '@testing-library/jest-dom';
import React from 'react';

// Make React available globally for JSX
global.React = React;

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

