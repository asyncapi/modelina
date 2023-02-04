import { createContext } from 'react';

export interface PlaygroundGenerated {
  models: any[];
  language: string;
}

export const PlaygroundGeneratedContext =
  createContext<PlaygroundGenerated | null>(null);
