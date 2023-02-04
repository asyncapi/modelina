import { createContext } from 'react';

export interface PlaygroundGeneratedContext {
  models: any[],
  language: string
}

export const PlaygroundGeneratedContextInstance = createContext<PlaygroundGeneratedContext | null>(null);
