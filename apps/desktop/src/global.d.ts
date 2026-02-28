import type { GranolaAPI } from './shared/types';

declare global {
  interface Window {
    granola: GranolaAPI;
  }
}

export {};
