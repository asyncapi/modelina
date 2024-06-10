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
    <div className="grid h-full w-full grid-cols-4 md:grid-cols-8 lg:grid-cols-12 overflow-visible">
      <div
        className={clsx(
          'bg-[#1f2937] text-white h-[90vh] w-full col-span-full lg:col-span-3',
          {
            hidden: !showOptions
          }
        )}
      >
        <OptionsNavigation setNewConfig={setNewConfig} />
      </div>
      <div
        className={clsx('h-full col-span-2 lg:col-start-7 lg:col-end-9', {
          hidden: !showOutputNavigation
        })}
      >
        <OutputNavigation />
      </div>
      <div
        className={clsx(
          'h-full col-span-full md:col-span-3 lg:row-start-1 lg:col-end-7',
          {
            'hidden md:block': showInputEditor && !showOptions,
            'lg:col-start-4': showOptions,
            'lg:col-start-1': !showOptions,
            'md:col-span-4': !showOutputNavigation
          }
        )}
      >
        <div className="h-full w-full bg-code-editor-dark text-white rounded-b shadow-lg font-bold">
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
        className={clsx('h-full col-span-2 md:col-span-3 lg:col-end-13', {
          'hidden md:block': !showInputEditor && !showOptions,
          'col-span-full md:col-span-4 lg:col-start-7': !showOutputNavigation,
          'lg:col-span-4 lg:row-start-1 lg:col-start-9': showOutputNavigation
        })}
      >
        {error ? (
          <CustomError statusCode={statusCode} errorMessage={errorMessage} />
        ) : (
          <PlaygroundGeneratedContext.Provider
            value={PlaygroundGeneratedContextValue}
          >
            <GeneratedModelsComponent setNewQuery={setNewQuery} />
          </PlaygroundGeneratedContext.Provider>
        )}
      </div>
    </div>
  );
};
