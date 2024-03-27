'use client';

import { FunctionComponent, useMemo } from 'react';
import { PlaygroundGeneratedContext } from '../contexts/PlaygroundGeneratedContext';
import { usePlaygroundContext } from '../contexts/PlaygroundContext';
import MonacoEditorWrapper from '../MonacoEditorWrapper';
import CustomError from '../CustomError';
import OutputNavigation from './OutputNavigation';
import { OptionsNavigation } from './OptionsNavigation';
import GeneratedModelsComponent from './GeneratedModels';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

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
    showOutputNavigation,
  } = usePlaygroundContext();

  const PlaygroundGeneratedContextValue = useMemo(() => ({
    language: config.language,
    models: models
  }), [config.language, models]);

  return (
    <div className="h-full w-full flex">
      <PanelGroup direction="horizontal">
        {/* OPTIONS */}
        {
          showOptions && 
          <div className={`bg-[#1f2937] text-white h-full w-[20%]`}>
            <OptionsNavigation setNewConfig={setNewConfig} />
          </div>
        }
        {/* EDITOR */}
        <Panel className="flex flex-row" id="left-panel">
          <div className={`h-full w-full`}>
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
        </Panel>

        <PanelResizeHandle className="w-1.5 bg-blue-700" />

        {/* OUTPUT NAVIGATION */}
        {
          showOutputNavigation && 
          <div className='h-full w-[20%]'>
            <OutputNavigation />
          </div>
        }
        {/* OUTPUTS */}
        <Panel className="flex flex-row" id="right-panel">  
          <div className={`h-full w-full`}>
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
        </Panel>
      </PanelGroup>
    </div>
  );
};
