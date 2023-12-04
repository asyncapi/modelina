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

interface OptionsProps {
  config: ModelinaOptions;
  setNewConfig: (config: string, configValue: any, updateCode?: boolean) => void;
}
interface OutputProps { }
interface NavigationProps {
  config: ModelinaOptions;
  setNewConfig: (config: string, configValue: any, updateCode?: boolean) => void;
}
interface ButtonProps {
  title: string;
  disabled?: boolean;
  cn?: string;
}

const CustomButton: React.FunctionComponent<ButtonProps> = ({ title, disabled = false, cn = '' }) => {
  return <button className={`px-2 py-2 w-full text-left ${disabled ? "border-b-[1px] border-gray-700 text-sm" : "hover:bg-[#4b5563] text-xs"} ${cn}`} disabled={disabled}>{title}</button>
}

const Output: React.FunctionComponent<OutputProps> = () => {

  return (
    <div className="h-full w-full flex flex-col">
      <CustomButton title="Generator Code" />
      <CustomButton title="Generated Models" disabled={true} />
      <CustomButton title="LightMeasured" />
      <CustomButton title="TurnOn" />
    </div>
  )
}

const Options: React.FunctionComponent<OptionsProps> = ({ config, setNewConfig }) => {
  const {
    generatorCode,
    showGeneratorCode,
    setShowGeneratorCode,
  } = usePlaygroundContext();
  return (
    // <div className="col-span-2">
    //   <div className="overflow-hidden bg-white shadow sm:rounded-lg flex flex-row">
    //     <div className="px-4 py-5 sm:px-6 basis-6/12">
    //       <h3 className="text-lg font-medium leading-6 text-gray-900">
    //         Modelina Options
    //       </h3>
    //       <p className="mt-1 max-w-2xl text-sm text-gray-500">
    //         , or see the Modelina
    //         configuration you can use directly in your library
    //       </p>
    //     </div>

    //     <div
    //       onClick={() => {
    //         setShowGeneratorCode(false);
    //       }}
    //       className={`${!showGeneratorCode ? 'bg-blue-100' : 'bg-white'
    //         } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 basis-3/12`}
    //     >
    //       <h3 className="text-lg font-medium leading-6 text-gray-900">
    //         Options
    //       </h3>
    //     </div>

    //     <div
    //       onClick={() => {
    //         setShowGeneratorCode(true);
    //       }}
    //       className={`${showGeneratorCode ? 'bg-blue-100' : 'bg-white'
    //         } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 basis-3/12`}
    //     >
    //       <h3 className="text-lg font-medium leading-6 text-gray-900">
    //         Generator code
    //       </h3>
    //     </div>
    //   </div>
    //   {showGeneratorCode ? (
    //     <div
    //       className="bg-code-editor-dark text-white rounded-b shadow-lg font-bold"
    //       style={{ height: '400px' }}
    //     >
    //       <MonacoEditorWrapper
    //         options={{ readOnly: true }}
    //         language="typescript"
    //         value={generatorCode || ''}
    //       />
    //     </div>
    //   ) : (
    //     <PlaygroundGeneralConfigContext.Provider value={config}>
    //       <PlaygroundTypeScriptConfigContext.Provider value={config}>
    //         <PlaygroundJavaScriptConfigContext.Provider value={config}>
    //           <PlaygroundCSharpConfigContext.Provider value={config}>
    //             <PlaygroundDartConfigContext.Provider value={config}>
    //               <PlaygroundGoConfigContext.Provider value={config}>
    //                 <PlaygroundJavaConfigContext.Provider value={config}>
    //                   <PlaygroundPhpConfigContext.Provider value={config}>
    //                     <PlaygroundCplusplusConfigContext.Provider value={config}>
    //                       <PlaygroundKotlinConfigContext.Provider value={config}>
    //                         <PlaygroundRustConfigContext.Provider value={config}>
    //                           <PlaygroundPythonConfigContext.Provider value={config}>
    //                             <PlaygroundOptions setNewConfig={setNewConfig} />
    //                           </PlaygroundPythonConfigContext.Provider>
    //                         </PlaygroundRustConfigContext.Provider>
    //                       </PlaygroundKotlinConfigContext.Provider>
    //                     </PlaygroundCplusplusConfigContext.Provider>
    //                   </PlaygroundPhpConfigContext.Provider>
    //                 </PlaygroundJavaConfigContext.Provider>
    //               </PlaygroundGoConfigContext.Provider>
    //             </PlaygroundDartConfigContext.Provider>
    //           </PlaygroundCSharpConfigContext.Provider>
    //         </PlaygroundJavaScriptConfigContext.Provider>
    //       </PlaygroundTypeScriptConfigContext.Provider>
    //     </PlaygroundGeneralConfigContext.Provider>
    //   )}
    // </div>

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
