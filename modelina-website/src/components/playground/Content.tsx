'use client';

import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import { useMemo } from 'react';

import { usePlaygroundContext } from '../contexts/PlaygroundContext';
import { PlaygroundGeneratedContext } from '../contexts/PlaygroundGeneratedContext';
import CustomError from '../CustomError';
import MonacoEditorWrapper from '../MonacoEditorWrapper';
import GeneratedModelsComponent from './GeneratedModels';
import { OptionsNavigation } from './OptionsNavigation';
import OutputNavigation from './OutputNavigation';

interface ContentProps {
  setNewConfig: (config: string, configValue: any, updateCode?: boolean) => void;
  setNewQuery: (queryKey: string, queryValue: any) => void;
  generateNewCode: (input: string) => void;
}

export const Content: FunctionComponent<ContentProps> = ({ setNewConfig, setNewQuery, generateNewCode }) => {
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
    <div className='grid size-full grid-cols-4 md:grid-cols-8 lg:grid-cols-12'>
      <div
        className={clsx('col-span-full h-[90vh] w-full bg-[#1f2937] text-white lg:col-span-3', {
          hidden: !showOptions
        })}
      >
        <OptionsNavigation setNewConfig={setNewConfig} />
      </div>
      <div
        className={clsx('col-span-2 h-full lg:col-start-8 lg:col-end-10', {
          hidden: !showOutputNavigation
        })}
      >
        <OutputNavigation />
      </div>
      <div
        className={clsx('col-span-full h-full md:col-span-3 lg:col-end-8 lg:row-start-1', {
          'hidden md:block': showInputEditor && !showOptions,
          'lg:col-start-4': showOptions,
          'lg:col-start-1': !showOptions,
          'md:col-span-4': !showOutputNavigation
        })}
      >
        <div className='size-full rounded-b bg-code-editor-dark font-bold text-white shadow-lg'>
          <MonacoEditorWrapper
            value={input}
            onChange={(_, change) => {
              setInput(change);
              generateNewCode(change);
            }}
            editorDidMount={() => {
              setLoaded({ ...loaded, editorLoaded: true });
            }}
            language='json'
          />
        </div>
      </div>
      <div
        className={clsx('col-span-2 h-full md:col-span-3 lg:col-end-13 lg:row-start-1', {
          'hidden md:block': !showInputEditor && !showOptions,
          'col-span-full md:col-span-4 lg:col-start-8': !showOutputNavigation,
          'lg:col-span-4 lg:col-start-10': showOutputNavigation
        })}
      >
        {error ? (
          <CustomError statusCode={statusCode} errorMessage={errorMessage} />
        ) : (
          <PlaygroundGeneratedContext.Provider value={PlaygroundGeneratedContextValue}>
            <GeneratedModelsComponent setNewQuery={setNewQuery} />
          </PlaygroundGeneratedContext.Provider>
        )}
      </div>
    </div>
  );
};
