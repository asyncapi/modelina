'use client';
import React, {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  useMemo
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

  const contextValue = useMemo(() => ({
    panel,
    setPanel
  }), [
    panel,
    setPanel
  ]);
  return (
    <PanelContext.Provider
      value={contextValue}
    >
      {children}
    </PanelContext.Provider>
  );
};

export const usePanelContext = (): PanelContextProps =>
  useContext(PanelContext);
