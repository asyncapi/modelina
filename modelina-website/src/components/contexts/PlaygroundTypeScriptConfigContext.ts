import { ModelinaTypeScriptOptions } from '@/types';
import { createContext } from 'react';

export const PlaygroundTypeScriptConfigContextInstance = createContext<ModelinaTypeScriptOptions | null>(null);