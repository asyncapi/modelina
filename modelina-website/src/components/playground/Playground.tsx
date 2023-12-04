import React, { useEffect } from 'react';
import {
  ModelinaOptions,
  ModelinaQueryOptions,
  GenerateMessage,
  UpdateMessage
} from '@/types';
import Router, { withRouter, NextRouter } from 'next/router';
import { encode } from 'js-base64';
import { PanelContextProvider } from '../contexts/PlaygroundPanelContext';
import { usePlaygroundContext } from '../contexts/PlaygroundContext';
import { getTypeScriptGeneratorCode } from '@/helpers/GeneratorCode/TypeScriptGenerator';
import { getJavaScriptGeneratorCode } from '@/helpers/GeneratorCode/JavaScriptGenerator';
import { getJavaGeneratorCode } from '@/helpers/GeneratorCode/JavaGenerator';
import { getGoGeneratorCode } from '@/helpers/GeneratorCode/GoGenerator';
import { getCSharpGeneratorCode } from '@/helpers/GeneratorCode/CSharpGenerator';
import { getRustGeneratorCode } from '@/helpers/GeneratorCode/RustGenerator';
import { getPythonGeneratorCode } from '@/helpers/GeneratorCode/PythonGenerator';
import { getDartGeneratorCode } from '@/helpers/GeneratorCode/DartGenerator';
import { getCplusplusGeneratorCode } from '@/helpers/GeneratorCode/CplusplusGenerator';
import { getKotlinGeneratorCode } from '@/helpers/GeneratorCode/KotlinGenerator';
import { getPhpGeneratorCode } from '@/helpers/GeneratorCode/PhpGenerator';
import { Sidebar } from './Sidebar';
import { Content } from './Content';

interface WithRouterProps {
  router: NextRouter;
}
interface ModelinaPlaygroundProps extends WithRouterProps {
  maxInputSize?: number;
}

const Playground: React.FC<ModelinaPlaygroundProps> = (props) => {
  const {
    input,
    setModels,
    setGeneratorCode,
    loaded,
    setLoaded,
    setError,
    setStatusCode,
    setErrorMessage,
    isLoaded,
    setIsLoaded,
    hasLoadedQuery,
    setHasLoadedQuery,
  } = usePlaygroundContext();

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

  useEffect(() => {
    const isHardLoaded = loaded.hasReceivedCode;
    const isSoftLoaded = loaded.editorLoaded;
    setIsLoaded(isHardLoaded && isSoftLoaded);

    const query = props.router.query as ModelinaQueryOptions;
    if (query.language !== undefined) {
      config.language = query.language as any;
    }
    if (query.enumKeyNamingFormat !== undefined) {
      config.enumKeyNamingFormat = query.enumKeyNamingFormat as any;
    }
    if (query.propertyNamingFormat !== undefined) {
      config.propertyNamingFormat = query.propertyNamingFormat as any;
    }
    if (query.modelNamingFormat !== undefined) {
      config.modelNamingFormat = query.modelNamingFormat as any;
    }
    if (query.showTypeMappingExample !== undefined) {
      config.showTypeMappingExample = query.showTypeMappingExample === 'true';
    }
    if (query.indentationType !== undefined) {
      config.indentationType = query.indentationType as any;
    }
    if (query.tsMarshalling !== undefined) {
      config.tsMarshalling = query.tsMarshalling === 'true';
    }
    if (query.tsModelType !== undefined) {
      config.tsModelType = query.tsModelType as any;
    }
    if (query.tsEnumType !== undefined) {
      config.tsEnumType = query.tsEnumType as any;
    }
    if (query.tsIncludeDescriptions !== undefined) {
      config.tsIncludeDescriptions = query.tsIncludeDescriptions === 'true';
    }
    if (query.tsIncludeJsonBinPack !== undefined) {
      config.tsIncludeJsonBinPack = query.tsIncludeJsonBinPack === 'true';
    }
    if (query.tsIncludeExampleFunction !== undefined) {
      config.tsIncludeExampleFunction = query.tsIncludeExampleFunction === 'true';
    }
    if (query.csharpArrayType !== undefined) {
      config.csharpArrayType = query.csharpArrayType as any;
    }
    if (query.csharpAutoImplemented !== undefined) {
      config.csharpAutoImplemented = query.csharpAutoImplemented === 'true';
    }
    if (query.csharpOverwriteHashcode !== undefined) {
      config.csharpOverwriteHashcode = query.csharpOverwriteHashcode === 'true';
    }
    if (query.phpIncludeDescriptions !== undefined) {
      config.phpIncludeDescriptions = query.phpIncludeDescriptions === 'true';
    }
    if (query.phpNamespace !== undefined) {
      config.phpNamespace = query.phpNamespace;
    }
    if (query.csharpIncludeJson !== undefined) {
      config.csharpIncludeJson = query.csharpIncludeJson === 'true';
    }
    if (query.csharpOverwriteEqual !== undefined) {
      config.csharpOverwriteEqual = query.csharpOverwriteEqual === 'true';
    }
    if (query.csharpIncludeNewtonsoft !== undefined) {
      config.csharpIncludeNewtonsoft = query.csharpIncludeNewtonsoft === 'true';
    }
    if (query.csharpNamespace !== undefined) {
      config.csharpNamespace = query.csharpNamespace;
    }
    if (query.csharpNullable !== undefined) {
      config.csharpNullable = query.csharpNullable === 'true';
    }
    if (query.cplusplusNamespace !== undefined) {
      config.cplusplusNamespace = query.cplusplusNamespace;
    }
    if (query.javaPackageName !== undefined) {
      config.javaPackageName = query.javaPackageName;
    }
    if (query.javaIncludeJackson !== undefined) {
      config.javaIncludeJackson = query.javaIncludeJackson === 'true';
    }
    if (query.javaIncludeMarshaling !== undefined) {
      config.javaIncludeMarshaling = query.javaIncludeMarshaling === 'true';
    }
    if (query.javaArrayType !== undefined) {
      config.javaArrayType = query.javaArrayType as any;
    }
    if (query.javaOverwriteHashcode !== undefined) {
      config.javaOverwriteHashcode = query.javaOverwriteHashcode === 'true';
    }
    if (query.javaOverwriteEqual !== undefined) {
      config.javaOverwriteEqual = query.javaOverwriteEqual === 'true';
    }
    if (query.javaOverwriteToString !== undefined) {
      config.javaOverwriteToString = query.javaOverwriteToString === 'true';
    }
    if (query.javaJavaDocs !== undefined) {
      config.javaJavaDocs = query.javaJavaDocs === 'true';
    }
    if (query.javaJavaxAnnotation !== undefined) {
      config.javaJavaxAnnotation = query.javaJavaxAnnotation === 'true';
    }
    if (query.goPackageName !== undefined) {
      config.goPackageName = query.goPackageName;
    }
    if (query.kotlinPackageName !== undefined) {
      config.kotlinPackageName = query.kotlinPackageName;
    }

    if (props.router.isReady && !hasLoadedQuery) {
      setHasLoadedQuery(true);
      generateNewCode(input);
    }
  }, [props.router.isReady, hasLoadedQuery]);

  const setNewConfig = (config: string, configValue: any, updateCode?: boolean) => {
    setNewQuery(config, configValue);
    /* eslint-disable-next-line security/detect-object-injection */
    (config as any)[config] = configValue;
    if (updateCode === true || updateCode === undefined) {
      generateNewCode(input);
    }
  };

  /**
   * Set a query key and value
   */
  const setNewQuery = (queryKey: string, queryValue: any) => {
    const newQuery = {
      query: { ...props.router.query }
    };

    if (queryValue === false) {
      delete newQuery.query[queryKey];
    } else {
      /* eslint-disable-next-line security/detect-object-injection */
      newQuery.query[queryKey] = String(queryValue);
    }

    Router.push(newQuery, undefined, { scroll: false });
  };

  /**
   * Tell the socket io server that we want some code
   */
  const generateNewCode = (input: string) => {
    try {
      const message: GenerateMessage = {
        ...config,
        input: encode(JSON.stringify(JSON.parse(input)))
      };

      if (message.input.length > (props.maxInputSize || 30000)) {
        console.error('Input too large, use a smaller example');
        setError(true);
        setErrorMessage('Input too large, use a smaller example');
        setStatusCode(400);
      } else {
        const generators: { [key: string]: Function } = {
          typescript: getTypeScriptGeneratorCode,
          javascript: getJavaScriptGeneratorCode,
          java: getJavaGeneratorCode,
          go: getGoGeneratorCode,
          csharp: getCSharpGeneratorCode,
          rust: getRustGeneratorCode,
          python: getPythonGeneratorCode,
          dart: getDartGeneratorCode,
          cplusplus: getCplusplusGeneratorCode,
          kotlin: getKotlinGeneratorCode,
          php: getPhpGeneratorCode
        };

        const generatorCode = generators[config.language](message);

        fetch(`${process.env.NEXT_PUBLIC_API_PATH}/generate`, {
          body: JSON.stringify(message),
          method: 'POST'
        }).then(async (res) => {
          if (!res.ok) {
            throw new Error(res.statusText);
          }

          const response: UpdateMessage = await res.json();
          setGeneratorCode(generatorCode);
          setModels(response.models);
          setLoaded({
            ...loaded,
            hasReceivedCode: true
          });
          setError(false);
          setStatusCode(200);
          setErrorMessage('');
        }).catch(error => {
          console.error(error);
          setError(true);
          setErrorMessage("Input is not a correct AsyncAPI document, so it cannot be processed.");
          setStatusCode(500);
        });
      }
    } catch (e: any) {
      console.error(e);
      setError(true);
      setErrorMessage("Input is not a correct AsyncAPI document, so it cannot be processed.");
      setStatusCode(400);
    }
  };

  return (
    <div>
      {
        isLoaded
          ?
          <div className="text-xl text-center mt-16 lg:mt-56 md:text-2xl">
            Loading Modelina Playground. Rendering playground components...
          </div>
          :
          <div className="flex flex-col h-[90vh] w-full py-2">
            <div className="flex flex-row flex-1 overflow-hidden">
              <PanelContextProvider>
                <Sidebar />
                <Content config={config} setNewConfig={setNewConfig} setNewQuery={setNewQuery} generateNewCode={generateNewCode} />
              </PanelContextProvider>
            </div>
          </div>
      }
    </div>
  );
};

export default withRouter(Playground);
