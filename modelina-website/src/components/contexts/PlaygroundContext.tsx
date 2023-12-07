'use client';
import React, {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  useMemo
} from 'react';
import { defaultAsyncapiDocument } from '@/types';

interface ModelsGeneratorProps {
  code: string;
  name: string;
}

interface LoadedState {
  editorLoaded: boolean;
  hasReceivedCode: boolean;
}

interface PlaygroundContextProps {
  showOptions: boolean;
  setShowOptions: Dispatch<SetStateAction<boolean>>;
  showOutputNavigation: boolean;
  setShowOutputNavigation: Dispatch<SetStateAction<boolean>>;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  models: ModelsGeneratorProps[];
  setModels: Dispatch<SetStateAction<ModelsGeneratorProps[]>>;
  generatorCode: string;
  setGeneratorCode: Dispatch<SetStateAction<string>>;
  loaded: LoadedState;
  setLoaded: Dispatch<SetStateAction<LoadedState>>;
  showGeneratorCode: boolean;
  setShowGeneratorCode: Dispatch<SetStateAction<boolean>>;
  error: boolean;
  setError: Dispatch<SetStateAction<boolean>>;
  statusCode: number;
  setStatusCode: Dispatch<SetStateAction<number>>;
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  isLoaded: boolean;
  setIsLoaded: Dispatch<SetStateAction<boolean>>;
  hasLoadedQuery: boolean;
  setHasLoadedQuery: Dispatch<SetStateAction<boolean>>;
  renderModels: React.ReactNode | null;
  setRenderModels: (models: React.ReactNode) => void;
}

const PlaygroundContext = createContext<PlaygroundContextProps | undefined>(undefined);

export const PlaygroundContextProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
  const [showOptions, setShowOptions] = useState(true);
  const [showOutputNavigation, setShowOutputNavigation] = useState(true);
  const [input, setInput] = useState(JSON.stringify(defaultAsyncapiDocument, null, 4));
  const [models, setModels] = useState<ModelsGeneratorProps[]>([]);
  const [generatorCode, setGeneratorCode] = useState('');
  const [loaded, setLoaded] = useState({
    editorLoaded: false,
    hasReceivedCode: false,
  });
  const [showGeneratorCode, setShowGeneratorCode] = useState(false);
  const [error, setError] = useState(false);
  const [statusCode, setStatusCode] = useState(400);
  const [errorMessage, setErrorMessage] = useState('Bad Request');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasLoadedQuery, setHasLoadedQuery] = useState(false);
  const [renderModels, setRenderModels] = React.useState<React.ReactNode | null>(null);

  const contextValue = useMemo(() => ({
    showOptions,
    setShowOptions,
    showOutputNavigation,
    setShowOutputNavigation,
    input,
    setInput,
    models,
    setModels,
    generatorCode,
    setGeneratorCode,
    loaded,
    setLoaded,
    showGeneratorCode,
    setShowGeneratorCode,
    error,
    setError,
    statusCode,
    setStatusCode,
    errorMessage,
    setErrorMessage,
    isLoaded,
    setIsLoaded,
    hasLoadedQuery,
    setHasLoadedQuery,
    renderModels,
    setRenderModels
  }), [
    showOptions,
    setShowOptions,
    showOutputNavigation,
    setShowOutputNavigation,
    input,
    setInput,
    models,
    setModels,
    generatorCode,
    setGeneratorCode,
    loaded,
    setLoaded,
    showGeneratorCode,
    setShowGeneratorCode,
    error,
    setError,
    statusCode,
    setStatusCode,
    errorMessage,
    setErrorMessage,
    isLoaded,
    setIsLoaded,
    hasLoadedQuery,
    setHasLoadedQuery,
    renderModels,
    setRenderModels,
  ]);

  return (
    <PlaygroundContext.Provider value={contextValue}>
      {children}
    </PlaygroundContext.Provider>
  );
}

export const usePlaygroundContext = () => {
  const context = useContext(PlaygroundContext);
  if (!context) {
    throw new Error('usePlaygroundContext must be used within a PlaygroundContextProvider');
  }
  return context;
};