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
import Resizable from './Resizable';

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
    <div className={clsx('grid size-full', {
      'grid-cols-[1fr_1fr]': showOutputNavigation,
      'md:grid-cols-[minmax(200px,_25%)_1fr]': showOptions || showOutputNavigation
    })}>
      <div
        className={clsx('h-[90vh] w-full bg-[#1f2937] text-white', {
          hidden: !showOptions || showOutputNavigation
        })}
      >
        <OptionsNavigation setNewConfig={setNewConfig} />
      </div>
      <div
        className={clsx('', {
          hidden: !showOutputNavigation || showOptions
        })}
      >
        <OutputNavigation />
      </div>
      <div
        // className={clsx('grid grid-cols-[minmax(400px,_60%)_1fr]', {
        //   'hidden md:block': showInputEditor && !showOptions,
        //   'lg:col-start-4': showOptions,
        //   'lg:col-start-1': !showOptions,
        //   'md:col-span-4': !showOutputNavigation
        // })}
        className={clsx('', {
          'hidden md:block': showOptions
        })}
      >
          <Resizable
            leftComponent={<div className={clsx('h-full rounded-b bg-code-editor-dark font-bold text-white shadow-lg', {
              'hidden md:block': showInputEditor && !showOptions
            })}>
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
            </div>}
            rightComponent={<div className={clsx('size-full', {
              'hidden md:block': !showInputEditor && !showOptions
            })}>
            {error ? (
              <CustomError statusCode={statusCode} errorMessage={errorMessage} />
            ) : (
              <PlaygroundGeneratedContext.Provider value={PlaygroundGeneratedContextValue}>
                <GeneratedModelsComponent setNewQuery={setNewQuery} />
              </PlaygroundGeneratedContext.Provider>
            )}
          </div>} />

      </div>
      {/* <div
        className={clsx('col-span-2 h-full md:col-span-3 lg:col-auto', {
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
      </div> */}
    </div>
  );
};
