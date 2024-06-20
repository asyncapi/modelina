'use client';

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
    <div className='flex size-full'>
      {/* OPTIONS & EDITOR */}
      <div className='flex h-full w-[50%]'>
        {showOptions && (
          <div className={'size-full bg-[#1f2937] text-white md:w-2/5'}>
            <OptionsNavigation setNewConfig={setNewConfig} />
          </div>
        )}
        <div className={`h-full ${showOptions ? 'w-3/5' : 'w-full'}`}>
          <div className='h-full max-xl:col-span-2 xl:grid-cols-1'>
            <div className='h-full rounded-b bg-code-editor-dark font-bold text-white shadow-lg'>
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
        </div>
      </div>

      {/* OUTPUT NAVIGATION AND OUTPUTS */}
      <div className='flex h-full w-[50%]'>
        {showOutputNavigation && (
          <div className='size-full md:w-[30%]'>
            <OutputNavigation />
          </div>
        )}
        <div className={`h-full ${showOutputNavigation ? 'w-[70%]' : 'w-full'}`}>
          <div className={'h-full'}>
            {error ? (
              <CustomError statusCode={statusCode} errorMessage={errorMessage} />
            ) : (
              <PlaygroundGeneratedContext.Provider value={PlaygroundGeneratedContextValue}>
                <GeneratedModelsComponent setNewQuery={setNewQuery} />
              </PlaygroundGeneratedContext.Provider>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
