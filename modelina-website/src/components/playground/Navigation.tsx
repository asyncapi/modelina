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

interface OptionsProps { }
interface OutputProps { }
interface NavigationProps {
  // router: NextRouter;
}
interface ButtonProps {
  title: string;
  disabled?: boolean;
  cn?: string;
}

const CustomButton: React.FunctionComponent<ButtonProps> = ({ title, disabled = false, cn = '' }) => {
  return <button className={`px-2 py-2 w-full text-left ${disabled ? "border-b-[1px] border-gray-700 text-sm" : "hover:bg-[#4b5563] text-xs"} ${cn}`} disabled={disabled}>{title}</button>
}

export const Navigation: React.FunctionComponent<NavigationProps> = () => {
  const { panel, setPanel } = usePanelContext();

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

  // const setNewConfig = (config: string, configValue: any, updateCode?: boolean) => {
  //   setNewQuery(config, configValue);
  //   /* eslint-disable-next-line security/detect-object-injection */
  //   (config as any)[config] = configValue;
  //   if (updateCode === true || updateCode === undefined) {
  //     generateNewCode(input);
  //   }
  // };

  // const setNewQuery = (queryKey: string, queryValue: any) => {
  //   // Create a new object representing the updated query
  //   const newQuery = {
  //     query: { ...router.query }
  //   };
  
    // // Check if the queryValue is false, and remove the queryKey if necessary
    // if (queryValue === false) {
    //   delete newQuery.query[queryKey];
    // } else {
    //   // Set the queryKey and queryValue in the new query object
    //   newQuery.query[queryKey] = String(queryValue);
    // }
  
    // // Use the Next.js Router to update the query in the URL
    // Router.push(newQuery, undefined, { scroll: false });
  // };
  
  // const generateNewCode = (input: string) => {
  //   try {
  //     const message: GenerateMessage = {
  //       ...config,
  //       input: encode(JSON.stringify(JSON.parse(input)))
  //     };
  
  //     // Check if the input size is within limits
  //     if (message.input.length > (maxInputSize || 30000)) {
  //       console.error('Input too large, use a smaller example');
  //       setError(true);
  //       setErrorMessage('Input too large, use a smaller example');
  //       setStatusCode(400);
  //     } else {
  //       const generators: { [key: string]: Function } = {
  //         typescript: getTypeScriptGeneratorCode,
  //         javascript: getJavaScriptGeneratorCode,
  //         java: getJavaGeneratorCode,
  //         go: getGoGeneratorCode,
  //         csharp: getCSharpGeneratorCode,
  //         rust: getRustGeneratorCode,
  //         python: getPythonGeneratorCode,
  //         dart: getDartGeneratorCode,
  //         cplusplus: getCplusplusGeneratorCode,
  //         kotlin: getKotlinGeneratorCode,
  //         php: getPhpGeneratorCode
  //       };
  
  //       // Call the appropriate generator based on the selected language
  //       const generatorCode = generators[config.language](message);
  
  //       // Make a POST request to the API endpoint to generate code
  //       fetch(`${process.env.NEXT_PUBLIC_API_PATH}/generate`, {
  //         body: JSON.stringify(message),
  //         method: 'POST'
  //       }).then(async (res) => {
  //         // Check if the response is successful
  //         if (!res.ok) {
  //           throw new Error(res.statusText);
  //         }
  
  //         // Parse the response as JSON
  //         const response: UpdateMessage = await res.json();
  
  //         // Update state with the generated code and models
  //         setGeneratorCode(generatorCode);
  //         setModels(response.models);
  //         setLoaded({
  //           ...loaded,
  //           hasReceivedCode: true
  //         });
  //         setError(false);
  //         setStatusCode(200);
  //         setErrorMessage('');
  //       }).catch(error => {
  //         console.error(error);
  //         setError(true);
  //         setErrorMessage('Input is not a correct AsyncAPI document, so it cannot be processed.');
  //         setStatusCode(500);
  //       });
  //     }
  //   } catch (e: any) {
  //     console.error(e);
  //     setError(true);
  //     setErrorMessage('Input is not a correct AsyncAPI document, so it cannot be processed.');
  //     setStatusCode(400);
  //   }
  // };
  


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
  
      <div>
        Options
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      {panel !== 'options' && <Options />}
      {panel !== 'output' && <Output />}
    </div>
  )
}
