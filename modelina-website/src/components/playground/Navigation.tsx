import React from "react";
import Router, { withRouter, NextRouter } from 'next/router';
import { usePanelContext } from "../contexts/PlaygroundPanelContext";
import PlaygroundOptions from './PlaygroundOptions';
import MonacoEditorWrapper from '../MonacoEditorWrapper';
import {
  PlaygroundTypeScriptConfigContext,
  PlaygroundCSharpConfigContext,
  PlaygroundDartConfigContext,
  PlaygroundGoConfigContext,
  PlaygroundJavaConfigContext,
  PlaygroundJavaScriptConfigContext,
  PlaygroundKotlinConfigContext,
  PlaygroundPythonConfigContext,
  PlaygroundRustConfigContext,
  PlaygroundCplusplusConfigContext,
  PlaygroundGeneralConfigContext,
  PlaygroundPhpConfigContext
} from '../contexts/PlaygroundConfigContext';
import { getTypeScriptGeneratorCode } from '@/helpers/GeneratorCode/TypeScriptGenerator';
import { getJavaScriptGeneratorCode } from '@/helpers/GeneratorCode/JavaScriptGenerator';
import { getJavaGeneratorCode } from '@/helpers/GeneratorCode/JavaGenerator';
import { getGoGeneratorCode } from '@/helpers/GeneratorCode/GoGenerator';
import { getCSharpGeneratorCode } from '@/helpers/GeneratorCode/CSharpGenerator';
import { getRustGeneratorCode } from '@/helpers/GeneratorCode/RustGenerator';
import { getPythonGeneratorCode } from '@/helpers/GeneratorCode/PythonGenerator';
import { getDartGeneratorCode } from '@/helpers/GeneratorCode/DartGenerator';
import { getCplusplusGeneratorCode } from '@/helpers/GeneratorCode/CplusplusGenerator';
import CustomError from '../CustomError';
import { getKotlinGeneratorCode } from '@/helpers/GeneratorCode/KotlinGenerator';
import { getPhpGeneratorCode } from '@/helpers/GeneratorCode/PhpGenerator';
import { encode } from 'js-base64';
import GeneratedModelsComponent from './GeneratedModels';
import Heading from '../typography/Heading';
import Paragraph from '../typography/Paragraph';
import { PlaygroundGeneratedContext } from '../contexts/PlaygroundGeneratedContext';
import {
  defaultAsyncapiDocument,
  ModelinaOptions,
  ModelinaQueryOptions,
  GenerateMessage,
  UpdateMessage
} from '@/types';
import { usePlaygroundContext } from "../contexts/PlaygroundContext";
import InfoModal from "../InfoModal";

interface OptionsProps {
  config: ModelinaOptions;
  setNewConfig: (config: string, configValue: any, updateCode?: boolean) => void;
}
interface OutputProps { }
interface NavigationProps {
  config: ModelinaOptions;
  setNewConfig: (config: string, configValue: any, updateCode?: boolean) => void;
}

const Output: React.FunctionComponent<OutputProps> = () => {
  const { renderModels, showGeneratorCode, setShowGeneratorCode } = usePlaygroundContext();
  return (
    <div className="px-1 h-full w-full flex flex-col">
      <div className={`px-2 py-2 w-full text-left hover:bg-[#4b5563] text-xs ${showGeneratorCode && 'bg-[#21272d]'}`} onClick={() => setShowGeneratorCode(true)}>Generator Code</div>

      <div className="flex w-full">
        <InfoModal text="Generated Models: ">
          <p>
            This list contains all the generated models, select one to show their generated code.
          </p>
        </InfoModal>
        <div className={`px-2 py-2 w-full text-left border-b-[1px] border-gray-700 text-sm`}>Generated Models</div>
      </div>

      {renderModels}
    </div>
  )
}

const Options: React.FunctionComponent<OptionsProps> = ({ config, setNewConfig }) => {
  return (
    <div className="options w-full h-full overflow-y-auto">
      <PlaygroundGeneralConfigContext.Provider value={config}>
        <PlaygroundTypeScriptConfigContext.Provider value={config}>
          <PlaygroundJavaScriptConfigContext.Provider value={config}>
            <PlaygroundCSharpConfigContext.Provider value={config}>
              <PlaygroundDartConfigContext.Provider value={config}>
                <PlaygroundGoConfigContext.Provider value={config}>
                  <PlaygroundJavaConfigContext.Provider value={config}>
                    <PlaygroundPhpConfigContext.Provider value={config}>
                      <PlaygroundCplusplusConfigContext.Provider value={config}>
                        <PlaygroundKotlinConfigContext.Provider value={config}>
                          <PlaygroundRustConfigContext.Provider value={config}>
                            <PlaygroundPythonConfigContext.Provider value={config}>
                              <PlaygroundOptions setNewConfig={setNewConfig} />
                            </PlaygroundPythonConfigContext.Provider>
                          </PlaygroundRustConfigContext.Provider>
                        </PlaygroundKotlinConfigContext.Provider>
                      </PlaygroundCplusplusConfigContext.Provider>
                    </PlaygroundPhpConfigContext.Provider>
                  </PlaygroundJavaConfigContext.Provider>
                </PlaygroundGoConfigContext.Provider>
              </PlaygroundDartConfigContext.Provider>
            </PlaygroundCSharpConfigContext.Provider>
          </PlaygroundJavaScriptConfigContext.Provider>
        </PlaygroundTypeScriptConfigContext.Provider>
      </PlaygroundGeneralConfigContext.Provider>
    </div>
  )
}

export const Navigation: React.FunctionComponent<NavigationProps> = ({ config, setNewConfig }) => {
  const { panel } = usePanelContext();

  return (
    <div className="h-full w-full">
      {panel !== 'options' && <Options config={config} setNewConfig={setNewConfig} />}
      {panel !== 'output' && <Output />}
    </div>
  )
}
