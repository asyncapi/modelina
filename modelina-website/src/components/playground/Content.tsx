'use client';

import { FunctionComponent } from 'react';
import { usePanelContext } from '../contexts/PlaygroundPanelContext';
import { PlaygroundGeneratedContext } from '../contexts/PlaygroundGeneratedContext';
import { usePlaygroundContext } from '../contexts/PlaygroundContext';
import { Navigation } from './Navigation';
import GeneratedModelsComponent from './GeneratedModels';
import MonacoEditorWrapper from '../MonacoEditorWrapper';
import CustomError from '../CustomError';
import { ModelinaOptions } from '@/types';

interface ContentProps {
  config: ModelinaOptions;
  setNewQuery: (queryKey: string, queryValue: any) => void;
  generateNewCode: (input: string) => void;
}

export const Content: FunctionComponent<ContentProps> = ({ config, setNewQuery, generateNewCode }) => {
  const { panel } = usePanelContext();
  const {
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
  } = usePlaygroundContext();

  const panelEnabled = panel !== '';
  return (
    <div className="flex flex-1 flex-col sm:flex-row relative bg-orange-200">
      <div className="flex w-full h-full">
        {panelEnabled ? (
          <div className={`bg-[#1f2937] text-white flex h-full w-[100%] sm:w-[20%]`}>
            <Navigation />
          </div>
        ) : null}
        <div
          className={`flex flex-col sm:flex-row h-full ${panelEnabled ? 'w-0 sm:w-full' : 'w-full'
            }`}
        >
          <div className="max-xl:col-span-2 xl:grid-cols-1">
            <div
              className="h-full bg-code-editor-dark text-white rounded-b shadow-lg font-bold"
              style={{ height: '750px' }}
            >
              <MonacoEditorWrapper
                value={input}
                onChange={(_, change) => {
                  setInput(change);
                  generateNewCode(change);
                }}
                editorDidMount={() => {
                  setLoaded({ ...loaded, editorLoaded: true });
                }}
                language="json"
              />
            </div>
          </div>
          <div
            className="max-xl:col-span-2 xl:grid-cols-1"
            style={{ height: '750px' }}
          >
            {error ? (
              <CustomError statusCode={statusCode} errorMessage={errorMessage} />
            ) : (
              <PlaygroundGeneratedContext.Provider
                value={{
                  language: config.language,
                  models: models
                }}
              >
                <GeneratedModelsComponent setNewQuery={setNewQuery} />
              </PlaygroundGeneratedContext.Provider>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
