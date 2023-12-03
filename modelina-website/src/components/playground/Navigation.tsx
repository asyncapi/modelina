import React from "react";
import { usePanelContext } from "../contexts/PlaygroundPanelContext";
import PlaygroundOptions from './PlaygroundOptions';
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
import {
  ModelinaOptions
} from '@/types';

interface NavigationProps { }
interface OptionsProps { }
interface OutputProps { }
interface ButtonProps {
  title: string;
  disabled?: boolean;
  cn?: string;
}

const CustomButton: React.FunctionComponent<ButtonProps> = ({ title, disabled = false, cn = '' }) => {
  return <button className={`px-2 py-2 w-full text-left ${disabled ? "border-b-[1px] border-gray-700 text-sm" : "hover:bg-[#4b5563] text-xs"} ${cn}`} disabled={disabled}>{title}</button>
}

const Options: React.FunctionComponent<OptionsProps> = () => {
  return (
    // <div>
    //   {this.state.showGeneratorCode ? (
    //     <div
    //       className="bg-code-editor-dark text-white rounded-b shadow-lg font-bold"
    //       style={{ height: '400px' }}
    //     >
    //       <MonacoEditorWrapper
    //         options={{ readOnly: true }}
    //         language="typescript"
    //         value={this.state.generatorCode || ''}
    //       />
    //     </div>
    //   ) : (
    //     <PlaygroundGeneralConfigContext.Provider value={this.config}>
    //       <PlaygroundTypeScriptConfigContext.Provider value={this.config}>
    //         <PlaygroundJavaScriptConfigContext.Provider value={this.config}>
    //           <PlaygroundCSharpConfigContext.Provider value={this.config}>
    //             <PlaygroundDartConfigContext.Provider value={this.config}>
    //               <PlaygroundGoConfigContext.Provider value={this.config}>
    //                 <PlaygroundJavaConfigContext.Provider value={this.config}>
    //                   <PlaygroundPhpConfigContext.Provider value={this.config}>
    //                     <PlaygroundCplusplusConfigContext.Provider value={this.config}>
    //                       <PlaygroundKotlinConfigContext.Provider value={this.config}>
    //                         <PlaygroundRustConfigContext.Provider value={this.config}>
    //                           <PlaygroundPythonConfigContext.Provider value={this.config}>
    //                             <PlaygroundOptions setNewConfig={this.setNewConfig} />
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

    <div>
      Options
    </div>
  )
}


const Output: React.FunctionComponent<OutputProps> = () => {
  const config: ModelinaOptions = {
    language: 'typescript',
    propertyNamingFormat: 'default',
    modelNamingFormat: 'default',
    enumKeyNamingFormat: 'default',
    indentationType: 'spaces',
    showTypeMappingExample: false,
    tsMarshalling: false,
    tsModelType: 'class',
    tsEnumType: 'enum',
    tsModuleSystem: 'CJS',
    tsIncludeDescriptions: false,
    tsIncludeExampleFunction: false,
    tsIncludeJsonBinPack: false,
    csharpArrayType: 'Array',
    csharpAutoImplemented: false,
    csharpOverwriteHashcode: false,
    csharpIncludeJson: false,
    csharpOverwriteEqual: false,
    csharpIncludeNewtonsoft: false,
    csharpNamespace: 'asyncapi.models',
    csharpNullable: false,
    phpIncludeDescriptions: false,
    phpNamespace: 'AsyncAPI/Models',
    cplusplusNamespace: 'AsyncapiModels',
    javaPackageName: 'asyncapi.models',
    javaIncludeJackson: false,
    javaIncludeMarshaling: false,
    javaArrayType: 'Array',
    javaOverwriteHashcode: false,
    javaOverwriteEqual: false,
    javaOverwriteToString: false,
    javaJavaDocs: false,
    javaJavaxAnnotation: false,
    goPackageName: 'asyncapi.models',
    kotlinPackageName: 'asyncapi.models'
  };
  
  return (
    <div className="h-full w-full flex flex-col">
      <CustomButton title="Generator Code" />
      <CustomButton title="Generated Models" disabled={true} />
      <CustomButton title="LightMeasured" />
      <CustomButton title="TurnOn" />
    </div>
  )
}

export const Navigation: React.FunctionComponent<NavigationProps> = () => {
  const { panel } = usePanelContext();

  return (
    <div className="h-full w-full">
      {panel !== 'options' && <Options />}
      {panel !== 'output' && <Output />}
    </div>
  )
}
