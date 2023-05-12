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
import { PlaygroundGeneralConfigContext } from '../contexts/PlaygroundGeneralConfigContext';
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
  PlaygroundCplusplusConfigContext
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
    tsMarshalling: false,
    tsModelType: 'class',
    tsEnumType: 'enum',
    tsModuleSystem: 'CJS',
    tsIncludeDescriptions: false,
    csharpArrayType: 'Array',
    csharpAutoImplemented: false,
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

  setNewConfig(config: string, configValue: any) {
    this.setNewQuery(config, configValue);
    /* eslint-disable-next-line security/detect-object-injection */
    (this.config as any)[config] = configValue;
    this.generateNewCode(this.state.input);
  }

  /**
   * Set a query key and value
   */
  setNewQuery(queryKey: string, queryValue: any) {
    const newQuery = {
      query: { ...this.props.router.query }
    };
    /* eslint-disable-next-line security/detect-object-injection */
    newQuery.query[queryKey] = String(queryValue);
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
          cplusplus: getCplusplusGeneratorCode
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
    if (query.language !== undefined) {
      this.config.language = query.language as any;
    }
    if (query.csharpArrayType !== undefined) {
      this.config.csharpArrayType = query.csharpArrayType as any;
    }
    if (query.csharpAutoImplemented !== undefined) {
      this.config.csharpAutoImplemented =
        query.csharpAutoImplemented === 'true';
    }
    if (this.props.router.isReady && !this.hasLoadedQuery) {
      this.hasLoadedQuery = true;
      this.generateNewCode(this.state.input);
    }

    let loader;
    if (!isHardLoaded) {
      loader = (
        <div className="mt-12 text-2xl absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
          Loading Modelina Playground. Connecting to playground server...
        </div>
      );
    } else if (!isSoftLoaded) {
      loader = (
        <div className="mt-12 text-2xl absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
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
          <div className="col-span-2" style={{ height: '500px' }}>
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
              <PlaygroundGeneralConfigContext.Provider
                value={{ language: this.config.language }}
              >
                <PlaygroundTypeScriptConfigContext.Provider
                  value={{
                    tsMarshalling: this.config.tsMarshalling,
                    tsModelType: this.config.tsModelType,
                    tsModuleSystem: this.config.tsModuleSystem,
                    tsEnumType: this.config.tsEnumType,
                    tsIncludeDescriptions: this.config.tsIncludeDescriptions
                  }}
                >
                  <PlaygroundJavaScriptConfigContext.Provider value={{}}>
                    <PlaygroundCSharpConfigContext.Provider
                      value={{
                        csharpArrayType: this.config.csharpArrayType,
                        csharpAutoImplemented: this.config.csharpAutoImplemented,
                      }}
                    >
                      <PlaygroundDartConfigContext.Provider value={{}}>
                        <PlaygroundGoConfigContext.Provider value={{}}>
                          <PlaygroundJavaConfigContext.Provider value={{}}>
                            <PlaygroundCplusplusConfigContext.Provider value={{}}>
                              <PlaygroundKotlinConfigContext.Provider value={{}}>
                                <PlaygroundRustConfigContext.Provider value={{}}>
                                  <PlaygroundPythonConfigContext.Provider
                                    value={{}}
                                  >
                                    <PlaygroundOptions
                                      setNewConfig={this.setNewConfig}
                                    />
                                  </PlaygroundPythonConfigContext.Provider>
                                </PlaygroundRustConfigContext.Provider>
                              </PlaygroundKotlinConfigContext.Provider>
                            </PlaygroundCplusplusConfigContext.Provider>
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
