'use client';

import { FunctionComponent, useMemo } from 'react';
import { PlaygroundGeneratedContext } from '../contexts/PlaygroundGeneratedContext';
import { usePlaygroundContext } from '../contexts/PlaygroundContext';
import MonacoEditorWrapper from '../MonacoEditorWrapper';
import CustomError from '../CustomError';
import OutputNavigation from './OutputNavigation';
import { OptionsNavigation } from './OptionsNavigation';
import GeneratedModelsComponent from './GeneratedModels';
import clsx from 'clsx';

interface ContentProps {
  setNewConfig: (
    config: string,
    configValue: any,
    updateCode?: boolean
  ) => void;
  setNewQuery: (queryKey: string, queryValue: any) => void;
  generateNewCode: (input: string) => void;
}

export const Content: FunctionComponent<ContentProps> = ({
  setNewConfig,
  setNewQuery,
  generateNewCode
}) => {
  const {
    config,
    input,
    showInputEditor,
    setInput,
    models,
    loaded,
    setLoaded,
    error,
    statusCode,
    errorMessage,
    showOptions,
    showOutputNavigation
  } = usePlaygroundContext();

  const PlaygroundGeneratedContextValue = useMemo(
    () => ({
      language: config.language,
      models
    }),
    [config.language, models]
  );

  return (
    <div className="h-full w-full flex">
      {/* OPTIONS */}
      <div className="h-full w-[100%] flex">
        {showOptions && (
          <div className={`bg-[#1f2937] text-white h-full w-full md:w-[40%]`}>
            <OptionsNavigation setNewConfig={setNewConfig} />
          </div>
        )}
        {showOutputNavigation && (
          <div className="h-full w-[100%] md:w-[30%]">
            <OutputNavigation />
          </div>
        )}
        {/* Editor Input/Output */}
        {showInputEditor ? (
          <div
            className={clsx('h-full w-full md:w-full', {
              'hidden md:block md:w-[60%]': showOptions
            })}
          >
            <div className="max-xl:col-span-2 xl:grid-cols-1 h-full">
              <div className="h-full bg-code-editor-dark text-white rounded-b shadow-lg font-bold">
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
          </div>
        ) : (
          <div
            className={clsx('h-full w-[100%]', {
              'hidden md:block': showOptions
            })}
          >
            <div className={'h-full w-full'}>
              <div className={`h-full`}>
                {error ? (
                  <CustomError
                    statusCode={statusCode}
                    errorMessage={errorMessage}
                  />
                ) : (
                  <PlaygroundGeneratedContext.Provider
                    value={PlaygroundGeneratedContextValue}
                  >
                    <GeneratedModelsComponent setNewQuery={setNewQuery} />
                  </PlaygroundGeneratedContext.Provider>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
