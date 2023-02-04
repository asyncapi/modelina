import { createContext } from 'react';

export interface PlaygroundGeneralConfigContext {
  language: string,
  showAllInOneFile?: boolean
}

export const PlaygroundGeneralConfigContextInstance = createContext<PlaygroundGeneralConfigContext | null>(null);
