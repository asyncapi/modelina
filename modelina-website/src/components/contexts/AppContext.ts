import { createContext } from 'react';
export interface AppContext {
  path: string;
}
export default createContext<AppContext>({ path: '' });
