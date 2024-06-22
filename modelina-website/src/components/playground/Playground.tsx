import { encode } from 'js-base64';
import type { NextRouter } from 'next/router';
import Router, { withRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { getCplusplusGeneratorCode } from '@/helpers/GeneratorCode/CplusplusGenerator';
import { getCSharpGeneratorCode } from '@/helpers/GeneratorCode/CSharpGenerator';
import { getDartGeneratorCode } from '@/helpers/GeneratorCode/DartGenerator';
import { getGoGeneratorCode } from '@/helpers/GeneratorCode/GoGenerator';
import { getJavaGeneratorCode } from '@/helpers/GeneratorCode/JavaGenerator';
import { getJavaScriptGeneratorCode } from '@/helpers/GeneratorCode/JavaScriptGenerator';
import { getKotlinGeneratorCode } from '@/helpers/GeneratorCode/KotlinGenerator';
import { getPhpGeneratorCode } from '@/helpers/GeneratorCode/PhpGenerator';
import { getPythonGeneratorCode } from '@/helpers/GeneratorCode/PythonGenerator';
import { getRustGeneratorCode } from '@/helpers/GeneratorCode/RustGenerator';
import { getScalaGeneratorCode } from '@/helpers/GeneratorCode/ScalaGenerator';
import { getTypeScriptGeneratorCode } from '@/helpers/GeneratorCode/TypeScriptGenerator';
import type { GenerateMessage, ModelinaQueryOptions, UpdateMessage } from '@/types';

import { usePlaygroundContext } from '../contexts/PlaygroundContext';
import { Content } from './Content';
import { Sidebar } from './Sidebar';

interface WithRouterProps {
  router: NextRouter;
}
interface ModelinaPlaygroundProps extends WithRouterProps {
  maxInputSize?: number;
}

const Playground: React.FC<ModelinaPlaygroundProps> = (props) => {
  const {
    config,
    setConfig,
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
    setHasLoadedQuery
  } = usePlaygroundContext();

  // To avoid hydration error
  const [isMounted, setIsMounted] = useState(false);

  /**
   * Tell the socket io server that we want some code
   */
  const generateNewCode = (inputArgs: string) => {
    try {
      const message: GenerateMessage = {
        ...config,
        input: encode(JSON.stringify(JSON.parse(inputArgs)))
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
          scala: getScalaGeneratorCode,
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
        })
          .then(async (res) => {
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
          })
          .catch((error) => {
            console.error(error);
            setError(true);
            setErrorMessage('Input is not a correct AsyncAPI document, so it cannot be processed.');
            setStatusCode(500);
          });
      }
    } catch (e: any) {
      console.error(e);
      setError(true);
      setErrorMessage('Input is not a correct AsyncAPI document, so it cannot be processed.');
      setStatusCode(400);
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
      newQuery.query[queryKey] = String(queryValue);
    }

    Router.push(newQuery, undefined, { scroll: false });
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const isHardLoaded = loaded.hasReceivedCode;
    const isSoftLoaded = loaded.editorLoaded;

    setIsLoaded(isHardLoaded && isSoftLoaded);

    const query = props.router.query as ModelinaQueryOptions;

    if (query.language !== undefined) {
      setConfig({ ...config, language: query.language as any });
    }
    if (query.enumKeyNamingFormat !== undefined) {
      setConfig({
        ...config,
        enumKeyNamingFormat: query.enumKeyNamingFormat as any
      });
    }
    if (query.propertyNamingFormat !== undefined) {
      setConfig({
        ...config,
        propertyNamingFormat: query.propertyNamingFormat as any
      });
    }
    if (query.modelNamingFormat !== undefined) {
      setConfig({
        ...config,
        modelNamingFormat: query.modelNamingFormat as any
      });
    }
    if (query.showTypeMappingExample !== undefined) {
      setConfig({
        ...config,
        showTypeMappingExample: query.showTypeMappingExample === 'true'
      });
    }
    if (query.indentationType !== undefined) {
      setConfig({ ...config, indentationType: query.indentationType as any });
    }
    if (query.tsMarshalling !== undefined) {
      setConfig({ ...config, tsMarshalling: query.tsMarshalling === 'true' });
    }
    if (query.tsModelType !== undefined) {
      setConfig({ ...config, tsModelType: query.tsModelType as any });
    }
    if (query.tsEnumType !== undefined) {
      setConfig({ ...config, tsEnumType: query.tsEnumType as any });
    }
    if (query.tsMapType !== undefined) {
      setConfig({ ...config, tsMapType: query.tsMapType as any });
    }
    if (query.tsIncludeDescriptions !== undefined) {
      setConfig({
        ...config,
        tsIncludeDescriptions: query.tsIncludeDescriptions === 'true'
      });
    }
    if (query.tsIncludeJsonBinPack !== undefined) {
      setConfig({
        ...config,
        tsIncludeJsonBinPack: query.tsIncludeJsonBinPack === 'true'
      });
    }
    if (query.tsIncludeExampleFunction !== undefined) {
      setConfig({
        ...config,
        tsIncludeExampleFunction: query.tsIncludeExampleFunction === 'true'
      });
    }
    if (query.csharpArrayType !== undefined) {
      setConfig({ ...config, csharpArrayType: query.csharpArrayType as any });
    }
    if (query.csharpAutoImplemented !== undefined) {
      setConfig({
        ...config,
        csharpAutoImplemented: query.csharpAutoImplemented === 'true'
      });
    }
    if (query.csharpOverwriteHashcode !== undefined) {
      setConfig({
        ...config,
        csharpOverwriteHashcode: query.csharpOverwriteHashcode === 'true'
      });
    }
    if (query.phpIncludeDescriptions !== undefined) {
      setConfig({
        ...config,
        phpIncludeDescriptions: query.phpIncludeDescriptions === 'true'
      });
    }
    if (query.phpNamespace !== undefined) {
      setConfig({ ...config, phpNamespace: query.phpNamespace });
    }
    if (query.csharpIncludeJson !== undefined) {
      setConfig({
        ...config,
        csharpIncludeJson: query.csharpIncludeJson === 'true'
      });
    }
    if (query.csharpOverwriteEqual !== undefined) {
      setConfig({
        ...config,
        csharpOverwriteEqual: query.csharpOverwriteEqual === 'true'
      });
    }
    if (query.csharpIncludeNewtonsoft !== undefined) {
      setConfig({
        ...config,
        csharpIncludeNewtonsoft: query.csharpIncludeNewtonsoft === 'true'
      });
    }
    if (query.csharpNamespace !== undefined) {
      setConfig({ ...config, csharpNamespace: query.csharpNamespace });
    }
    if (query.csharpNullable !== undefined) {
      setConfig({ ...config, csharpNullable: query.csharpNullable === 'true' });
    }
    if (query.cplusplusNamespace !== undefined) {
      setConfig({ ...config, cplusplusNamespace: query.cplusplusNamespace });
    }
    if (query.javaPackageName !== undefined) {
      setConfig({ ...config, javaPackageName: query.javaPackageName });
    }
    if (query.javaIncludeJackson !== undefined) {
      setConfig({
        ...config,
        javaIncludeJackson: query.javaIncludeJackson === 'true'
      });
    }
    if (query.javaIncludeMarshaling !== undefined) {
      setConfig({
        ...config,
        javaIncludeMarshaling: query.javaIncludeMarshaling === 'true'
      });
    }
    if (query.javaArrayType !== undefined) {
      setConfig({ ...config, javaArrayType: query.javaArrayType as any });
    }
    if (query.javaOverwriteHashcode !== undefined) {
      setConfig({
        ...config,
        javaOverwriteHashcode: query.javaOverwriteHashcode === 'true'
      });
    }
    if (query.javaOverwriteEqual !== undefined) {
      setConfig({
        ...config,
        javaOverwriteEqual: query.javaOverwriteEqual === 'true'
      });
    }
    if (query.javaOverwriteToString !== undefined) {
      setConfig({
        ...config,
        javaOverwriteToString: query.javaOverwriteToString === 'true'
      });
    }
    if (query.javaJavaDocs !== undefined) {
      setConfig({ ...config, javaJavaDocs: query.javaJavaDocs === 'true' });
    }
    if (query.javaJavaxAnnotation !== undefined) {
      setConfig({
        ...config,
        javaJavaxAnnotation: query.javaJavaxAnnotation === 'true'
      });
    }
    if (query.goPackageName !== undefined) {
      setConfig({ ...config, goPackageName: query.goPackageName });
    }

    if (query.kotlinPackageName !== undefined) {
      setConfig({ ...config, kotlinPackageName: query.kotlinPackageName });
    }
    if (query.scalaCollectionType !== undefined) {
      setConfig({
        ...config,
        scalaCollectionType: query.scalaCollectionType as any
      });
    }
    if (query.scalaPackageName !== undefined) {
      setConfig({
        ...config,
        scalaPackageName: query.scalaPackageName as any
      });
    }

    if (props.router.isReady && !hasLoadedQuery) {
      setHasLoadedQuery(true);
      generateNewCode(input);
    }
  }, [props.router.isReady, hasLoadedQuery]);

  const setNewConfig = (configName: string, configValue: any, updateCode?: boolean) => {
    setNewQuery(configName, configValue);
    (config as any)[configName] = configValue;
    if (updateCode === true || updateCode === undefined) {
      generateNewCode(input);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      {isLoaded ? (
        <div className='mt-16 text-center text-xl md:text-2xl lg:mt-56'>
          Loading Modelina Playground. Rendering playground components...
        </div>
      ) : (
        <div className='grid h-[90vh] w-full grid-cols-with-sidebar overflow-hidden'>
          <Sidebar />
          <Content setNewConfig={setNewConfig} setNewQuery={setNewQuery} generateNewCode={generateNewCode} />
        </div>
      )}
    </div>
  );
};

export default withRouter(Playground);
