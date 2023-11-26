'use client';
import React, {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState
} from 'react';

interface PanelContextProps {
  panel: string;
  setPanel: Dispatch<SetStateAction<string>>;
}

const PanelContext = createContext<PanelContextProps>({
  panel: '' || 'options' || 'output',
  setPanel: (): string => ''
});

export const PanelContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [panel, setPanel] = useState('');
  return (
    <PanelContext.Provider
      value={{
        panel,
        setPanel
      }}
    >
      {children}
    </PanelContext.Provider>
  );
};

export const usePanelContext = (): PanelContextProps =>
  useContext(PanelContext);
