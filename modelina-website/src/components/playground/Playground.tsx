import React from 'react';
import MonacoEditorWrapper from '../MonacoEditorWrapper';
import {
  defaultAsyncapiDocument,
  ModelinaOptions,
  ModelinaQueryOptions,
  GenerateMessage,
  UpdateMessage
} from '@/types';
import Router, { withRouter, NextRouter } from 'next/router';
import { encode } from 'js-base64';
import GeneratedModelsComponent from './GeneratedModels';
import PlaygroundOptions from './PlaygroundOptions';
import Heading from '../typography/Heading';
import Paragraph from '../typography/Paragraph';
import { PlaygroundGeneratedContext } from '../contexts/PlaygroundGeneratedContext';
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

interface WithRouterProps {
  router: NextRouter;
}

interface ModelsGeneratorProps {
  code: string;
  name: string;
}
interface ModelinaPlaygroundProps extends WithRouterProps {
  maxInputSize?: number;
}

type ModelinaPlaygroundState = {
  input: string;
  models: ModelsGeneratorProps[];
  generatorCode: string;
  loaded: {
    editorLoaded: boolean;
    hasReceivedCode: boolean;
  };
  showGeneratorCode: boolean;
  error: boolean;
  statusCode: number;
  errorMessage: string;
};

class Playground extends React.Component<
  ModelinaPlaygroundProps,
  ModelinaPlaygroundState
> {
  config: ModelinaOptions = {
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
    goPackageName: 'asyncapi.models',
    kotlinPackageName: 'asyncapi.models'
  };
  hasLoadedQuery: boolean = false;
  constructor(props: ModelinaPlaygroundProps) {
    super(props);
    this.state = {
      input: JSON.stringify(defaultAsyncapiDocument, null, 4),
      models: [],
      generatorCode: '',
      loaded: {
        editorLoaded: false,
        hasReceivedCode: false
      },
      showGeneratorCode: false,
      error: false,
      statusCode: 400,
      errorMessage: 'Bad Request',
    };
    this.setNewConfig = this.setNewConfig.bind(this);
    this.setNewQuery = this.setNewQuery.bind(this);
    this.generateNewCode = this.generateNewCode.bind(this);
  }

  setNewConfig(config: string, configValue: any, updateCode?: boolean) {
    this.setNewQuery(config, configValue);
    /* eslint-disable-next-line security/detect-object-injection */
    (this.config as any)[config] = configValue;
    if(updateCode === true || updateCode === undefined) {
      this.generateNewCode(this.state.input);
    }
  }

  /**
   * Set a query key and value
   */
  setNewQuery(queryKey: string, queryValue: any) {
    const newQuery = {
      query: { ...this.props.router.query }
    };
    if(queryValue === false) {
      delete newQuery.query[queryKey];
    } else {
      /* eslint-disable-next-line security/detect-object-injection */
      newQuery.query[queryKey] = String(queryValue);
    }
    Router.push(newQuery, undefined, { scroll: false });
  }

  /**
   * Tell the socket io server that we want some code
   */
  generateNewCode(input: string) {
    try {
      const message: GenerateMessage = {
        ...this.config,
        input: encode(JSON.stringify(JSON.parse(input)))
      };
      if (message.input.length > (this.props.maxInputSize || 30000)) {
        console.error('Input too large, use smaller example');
        this.setState({ ...this.state, error: true, errorMessage: 'Input too large, use smaller example', statusCode: 400 });
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
        }
        const generatorCode = generators[this.config.language](message);
        fetch(`${process.env.NEXT_PUBLIC_API_PATH}/generate`, {
          body: JSON.stringify(message),
          method: 'POST'
        }).then(async (res) => {
          if (!res.ok) {
            throw new Error(res.statusText);
          }
          const response: UpdateMessage = await res.json();
          this.setState({
            ...this.state,
            generatorCode,
            models: response.models,
            loaded: {
              ...this.state.loaded,
              hasReceivedCode: true
            },
            error: false,
            statusCode: 200,
            errorMessage: '',
          });
        }).catch(error => {
          console.error(error);
          this.setState({ ...this.state, error: true, errorMessage: "Input is not an correct AsyncAPI document so it cannot be processed.", statusCode: 500 });
        });
      }
    } catch (e: any) {
      console.error(e);
      this.setState({ ...this.state, error: true, errorMessage: "Input is not an correct AsyncAPI document so it cannot be processed.", statusCode: 400 });
    }
  }

  render() {
    const { loaded } = this.state;
    const isHardLoaded = loaded.hasReceivedCode;
    const isSoftLoaded = loaded.editorLoaded;
    const isLoaded = isHardLoaded && isSoftLoaded;

    const query = this.props.router.query as ModelinaQueryOptions;
    if (query.language !== undefined) {
      this.config.language = query.language as any;
    }
    if (query.enumKeyNamingFormat !== undefined) {
      this.config.enumKeyNamingFormat = query.enumKeyNamingFormat as any;
    }
    if (query.propertyNamingFormat !== undefined) {
      this.config.propertyNamingFormat = query.propertyNamingFormat as any;
    }
    if (query.modelNamingFormat !== undefined) {
      this.config.modelNamingFormat = query.modelNamingFormat as any;
    }
    if (query.showTypeMappingExample !== undefined) {
      this.config.showTypeMappingExample = query.showTypeMappingExample  === 'true';
    }
    if (query.indentationType !== undefined) {
      this.config.indentationType = query.indentationType as any;
    }
    if (query.tsMarshalling !== undefined) {
      this.config.tsMarshalling = query.tsMarshalling === 'true';
    }
    if (query.tsModelType !== undefined) {
      this.config.tsModelType = query.tsModelType as any;
    }
    if (query.tsEnumType !== undefined) {
      this.config.tsEnumType = query.tsEnumType as any;
    }
    if (query.tsIncludeDescriptions !== undefined) {
      this.config.tsIncludeDescriptions =
        query.tsIncludeDescriptions === 'true';
    }
    if (query.tsIncludeJsonBinPack !== undefined) {
      this.config.tsIncludeJsonBinPack =
        query.tsIncludeJsonBinPack === 'true';
    }
    if (query.tsIncludeExampleFunction !== undefined) {
      this.config.tsIncludeExampleFunction =
        query.tsIncludeExampleFunction === 'true';
    }
    if (query.csharpArrayType !== undefined) {
      this.config.csharpArrayType = query.csharpArrayType as any;
    }
    if (query.csharpAutoImplemented !== undefined) {
      this.config.csharpAutoImplemented =
        query.csharpAutoImplemented === 'true';
    }
    if (query.csharpOverwriteHashcode !== undefined) {
      this.config.csharpOverwriteHashcode =
        query.csharpOverwriteHashcode === 'true';
    }
    if (query.phpIncludeDescriptions !== undefined) {
      this.config.phpIncludeDescriptions =
        query.phpIncludeDescriptions === 'true';
    }
    if (query.phpNamespace !== undefined) {
      this.config.phpNamespace = query.phpNamespace;
    }
    if (query.csharpIncludeJson !== undefined) {
      this.config.csharpIncludeJson =
        query.csharpIncludeJson === 'true';
    }
    if (query.csharpOverwriteEqual !== undefined) {
      this.config.csharpOverwriteEqual =
        query.csharpOverwriteEqual === 'true';
    }
    if (query.csharpIncludeNewtonsoft !== undefined) {
      this.config.csharpIncludeNewtonsoft =
        query.csharpIncludeNewtonsoft === 'true';
    }
    if (query.csharpNamespace !== undefined) {
      this.config.csharpNamespace = query.csharpNamespace;
    }
    if (query.csharpNullable !== undefined) {
      this.config.csharpNullable = query.csharpNullable === 'true';
    }
    if(query.cplusplusNamespace !== undefined) {
      this.config.cplusplusNamespace = query.cplusplusNamespace;
    }
    if (query.javaPackageName !== undefined) {
      this.config.javaPackageName = query.javaPackageName;
    }
    if(query.goPackageName !== undefined) {
      this.config.goPackageName = query.goPackageName;
    }
    if (query.kotlinPackageName !== undefined) {
      this.config.kotlinPackageName = query.kotlinPackageName;
    }
    if (this.props.router.isReady && !this.hasLoadedQuery) {
      this.hasLoadedQuery = true;
      this.generateNewCode(this.state.input);
    }

    let loader;
    if (!isHardLoaded) {
      loader = (
        <div className="text-xl text-center mt-16 lg:mt-56 md:text-2xl">
          Loading Modelina Playground. Connecting to playground server...
        </div>
      );
    } else if (!isSoftLoaded) {
      loader = (
        <div className="text-xl text-center mt-16 lg:mt-56 md:text-2xl">
          Loading Modelina Playground. Rendering playground components...
        </div>
      );
    }
    return (
      <div className="py-16 overflow-hidden lg:py-24">
        <div className="relative text-center">
          <Heading level="h1" typeStyle="heading-lg">
            Modelina Playground
          </Heading>
          <Paragraph className="mt-4 max-w-3xl mx-auto">
            Try out Modelina and see a small fraction of what it can do. Use it
            to play around, with small examples, otherwise turn to the CLI or
            library instead.
          </Paragraph>
        </div>
        {loader}
        <div
          className={`grid grid-cols-2 gap-4 mt-4 ${isLoaded ? '' : 'invisible'
            }`}
        >
          <div className="col-span-2">
            <div className="overflow-hidden bg-white shadow sm:rounded-lg flex flex-row">
              <div className="px-4 py-5 sm:px-6 basis-6/12">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Modelina Options
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Change the generation options, or see the Modelina
                  configuration you can use directly in your library
                </p>
              </div>

              <div
                onClick={() => {
                  this.setState({ ...this.state, showGeneratorCode: false });
                }}
                className={`${!this.state.showGeneratorCode ? 'bg-blue-100' : 'bg-white'
                  } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 basis-3/12`}
              >
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Options
                </h3>
              </div>
              <div
                onClick={() => {
                  this.setState({ ...this.state, showGeneratorCode: true });
                }}
                className={`${this.state.showGeneratorCode ? 'bg-blue-100' : 'bg-white'
                  } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 basis-3/12`}
              >
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Generator code
                </h3>
              </div>
            </div>
            {this.state.showGeneratorCode ? (
              <div
                className="bg-code-editor-dark text-white rounded-b shadow-lg font-bold"
                style={{ height: '400px' }}
              >
                <MonacoEditorWrapper
                  options={{ readOnly: true }}
                  language="typescript"
                  value={this.state.generatorCode || ''}
                />
              </div>
            ) : (
              <PlaygroundGeneralConfigContext.Provider value={this.config}>
                <PlaygroundTypeScriptConfigContext.Provider value={this.config}>
                  <PlaygroundJavaScriptConfigContext.Provider value={this.config}>
                    <PlaygroundCSharpConfigContext.Provider value={this.config}>
                      <PlaygroundDartConfigContext.Provider value={this.config}>
                        <PlaygroundGoConfigContext.Provider value={this.config}>
                          <PlaygroundJavaConfigContext.Provider value={this.config}>
                            <PlaygroundPhpConfigContext.Provider value={this.config}>
                              <PlaygroundCplusplusConfigContext.Provider value={this.config}>
                                <PlaygroundKotlinConfigContext.Provider value={this.config}>
                                  <PlaygroundRustConfigContext.Provider value={this.config}>
                                    <PlaygroundPythonConfigContext.Provider value={this.config}>
                                      <PlaygroundOptions setNewConfig={this.setNewConfig}/>
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
            )}
          </div>
          <div className="max-xl:col-span-2 xl:grid-cols-1">
            <div
              className="h-full bg-code-editor-dark text-white rounded-b shadow-lg font-bold"
              style={{ height: '750px' }}
            >
              <MonacoEditorWrapper
                value={this.state.input}
                onChange={(_, change) => {
                  this.setState({ ...this.state, input: change });
                  this.generateNewCode(change);
                }}
                editorDidMount={() => {
                  this.setState({
                    loaded: { ...this.state.loaded, editorLoaded: true }
                  });
                }}
                language="json"
              />
            </div>
          </div>
          <div
            className="max-xl:col-span-2 xl:grid-cols-1"
            style={{ height: '750px' }}
          >
            {this.state.error ? (
              <CustomError statusCode={this.state.statusCode} errorMessage={this.state.errorMessage} />
            ) : (
              <PlaygroundGeneratedContext.Provider
                value={{
                  language: this.config.language,
                  models: this.state.models
                }}
              >
                <GeneratedModelsComponent setNewQuery={this.setNewQuery} />
              </PlaygroundGeneratedContext.Provider>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Playground);
