'use client';

import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import { useMemo } from 'react';

import { usePlaygroundContext } from '../contexts/PlaygroundContext';
import { PlaygroundGeneratedContext } from '../contexts/PlaygroundGeneratedContext';
import { usePlaygroundLayout } from '../contexts/PlaygroundLayoutContext';
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
    setInput,
    models,
    loaded,
    setLoaded,
    error,
    statusCode,
    errorMessage
  } = usePlaygroundContext();
  const { state } = usePlaygroundLayout();

  const hasInputOptionsOpen = state.sidebarItems.get('general-options')?.isOpen;
  const hasOutputOptionsOpen = state.sidebarItems.get('output-options')?.isOpen;
  const hasInputEditorOpen = state.sidebarItems.get('input-editor')?.isOpen;
  const hasOutputEditorOpen = state.sidebarItems.get('output-editor')?.isOpen;

  const PlaygroundGeneratedContextValue = useMemo(
    () => ({
      language: config.language,
      models
    }),
    [config.language, models]
  );

  return (
    <div className={clsx('grid size-full', {
      'grid-cols-[1fr_1fr]': hasOutputOptionsOpen,
      'md:grid-cols-[minmax(200px,_25%)_1fr]': hasInputOptionsOpen || hasOutputOptionsOpen
    })}>
      <div
        className={clsx('h-[90vh] w-full bg-[#1f2937] text-white', {
          hidden: !hasInputOptionsOpen
        })}
      >
        <OptionsNavigation setNewConfig={setNewConfig} />
      </div>
      <div
        className={clsx({
          hidden: !hasOutputOptionsOpen
        })}
      >
        <OutputNavigation />
      </div>
      <div
        className={clsx({
          'hidden md:block': hasInputOptionsOpen
        })}
      >
          <Resizable
            leftComponent={
              <div className={clsx('size-full rounded-b bg-code-editor-dark font-bold text-white shadow-lg', {
                'hidden md:block': !hasInputEditorOpen && !hasInputOptionsOpen
              })}>
                  <MonacoEditorWrapper
                    value={input}
                    onChange={(_: any, change: any) => {
                      setInput(change);
                      generateNewCode(change);
                    }}
                    editorDidMount={() => {
                      setLoaded({ ...loaded, editorLoaded: true });
                    }}
                    language='json'
                  />
              </div>
            }
            rightComponent={
              <div className={clsx('size-full', {
                'hidden md:block': !hasOutputEditorOpen && !hasInputOptionsOpen
              })}>
                {error ? (
                  <CustomError statusCode={statusCode} errorMessage={errorMessage} />
                ) : (
                  <PlaygroundGeneratedContext.Provider value={PlaygroundGeneratedContextValue}>
                    <GeneratedModelsComponent setNewQuery={setNewQuery} />
                  </PlaygroundGeneratedContext.Provider>
                )}
              </div>
            } />

      </div>
    </div>
  );
};
