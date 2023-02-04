import { createContext } from 'react';

export interface PlaygroundGeneralConfig {
  language: string;
  showAllInOneFile?: boolean;
}

export const PlaygroundGeneralConfigContext =
  createContext<PlaygroundGeneralConfig | null>(null);
