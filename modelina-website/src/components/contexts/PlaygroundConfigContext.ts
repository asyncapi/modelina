import { createContext } from 'react';

import type {
  ModelinaCplusplusOptions,
  ModelinaCSharpOptions,
  ModelinaDartOptions,
  ModelinaGeneralOptions,
  ModelinaGoOptions,
  ModelinaJavaOptions,
  ModelinaJavaScriptOptions,
  ModelinaKotlinOptions,
  ModelinaPhpOptions,
  ModelinaPythonOptions,
  ModelinaRustOptions,
  ModelinaScalaOptions,
  ModelinaTypeScriptOptions
} from '@/types';

export const PlaygroundTypeScriptConfigContext = createContext<ModelinaTypeScriptOptions | null>(null);
export const PlaygroundJavaScriptConfigContext = createContext<ModelinaJavaScriptOptions | null>(null);
export const PlaygroundJavaConfigContext = createContext<ModelinaJavaOptions | null>(null);
export const PlaygroundGoConfigContext = createContext<ModelinaGoOptions | null>(null);
export const PlaygroundRustConfigContext = createContext<ModelinaRustOptions | null>(null);
export const PlaygroundScalaConfigContext = createContext<ModelinaScalaOptions | null>(null);
export const PlaygroundKotlinConfigContext = createContext<ModelinaKotlinOptions | null>(null);
export const PlaygroundDartConfigContext = createContext<ModelinaDartOptions | null>(null);
export const PlaygroundCSharpConfigContext = createContext<ModelinaCSharpOptions | null>(null);
export const PlaygroundPythonConfigContext = createContext<ModelinaPythonOptions | null>(null);
export const PlaygroundCplusplusConfigContext = createContext<ModelinaCplusplusOptions | null>(null);
export const PlaygroundGeneralConfigContext = createContext<ModelinaGeneralOptions | null>(null);
export const PlaygroundPhpConfigContext = createContext<ModelinaPhpOptions | null>(null);
