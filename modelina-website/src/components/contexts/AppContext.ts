import { createContext } from 'react';

export interface IAppContext {
  path: string;
}
export default createContext<IAppContext>({ path: '' });
