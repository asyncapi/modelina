import {
  ModelinaCplusplusOptions,
  ModelinaCSharpOptions,
  ModelinaDartOptions,
  ModelinaGoOptions,
  ModelinaJavaOptions,
  ModelinaJavaScriptOptions,
  ModelinaKotlinOptions,
  ModelinaPythonOptions,
  ModelinaRustOptions,
  ModelinaTypeScriptOptions
} from '@/types';
import { createContext } from 'react';

export const PlaygroundTypeScriptConfigContext =
  createContext<ModelinaTypeScriptOptions | null>(null);
export const PlaygroundJavaScriptConfigContext =
  createContext<ModelinaJavaScriptOptions | null>(null);
export const PlaygroundJavaConfigContext =
  createContext<ModelinaJavaOptions | null>(null);
export const PlaygroundGoConfigContext =
  createContext<ModelinaGoOptions | null>(null);
export const PlaygroundRustConfigContext =
  createContext<ModelinaRustOptions | null>(null);
export const PlaygroundKotlinConfigContext =
  createContext<ModelinaKotlinOptions | null>(null);
export const PlaygroundDartConfigContext =
  createContext<ModelinaDartOptions | null>(null);
export const PlaygroundCSharpConfigContext =
  createContext<ModelinaCSharpOptions | null>(null);
export const PlaygroundPythonConfigContext =
  createContext<ModelinaPythonOptions | null>(null);
  export const PlaygroundCplusplusConfigContext =
  createContext<ModelinaCplusplusOptions | null>(null);
