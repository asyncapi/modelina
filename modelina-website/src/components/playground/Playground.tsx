import React from 'react';
import MonacoEditorWrapper from '../MonacoEditorWrapper';
import {
  defaultAsyncapiDocument,
  ModelinaOptions,
  ModelinaQueryOptions,
  SocketIoChannels,
  SocketIoGenerateMessage,
  SocketIoUpdateMessage
} from '@/types';
import Router, { withRouter, NextRouter } from 'next/router';
import { encode } from 'js-base64';
import { socket } from '../services/Socket';
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
  PlaygroundRustConfigContext
} from '../contexts/PlaygroundConfigContext';
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
};

class Playground extends React.Component<
  ModelinaPlaygroundProps,
  ModelinaPlaygroundState
> {
  config: ModelinaOptions = {
    language: 'typescript',
    tsMarshalling: false,
    tsModelType: 'class'
  };
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
      showGeneratorCode: false
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
      const message: SocketIoGenerateMessage = {
        ...this.config,
        input: encode(JSON.stringify(JSON.parse(input)))
      };
      if (message.input.length > (this.props.maxInputSize || 30000)) {
        console.error('Input too large, use smaller example');
      } else {
        socket.emit(SocketIoChannels.GENERATE, message);
      }
    } catch (e) {
      console.error('Could not generate new code');
    }
  }

  componentDidMount(): void {
    const query = this.props.router.query as ModelinaQueryOptions;
    if (query.tsMarshalling !== undefined) {
      this.config.tsMarshalling = query.tsMarshalling === 'true';
    }
    if (query.tsModelType !== undefined) {
      this.config.tsModelType = query.tsModelType as any;
    }
    if (query.language !== undefined) {
      this.config.language = query.language as any;
    }
    console.log(query);

    // update chat on new message dispatched
    socket.on(SocketIoChannels.UPDATE, (message: SocketIoUpdateMessage) => {
      this.setState({
        ...this.state,
        generatorCode: message.generatorCode,
        models: message.models,
        loaded: {
          ...this.state.loaded,
          hasReceivedCode: true
        }
      });
    });
    this.generateNewCode(this.state.input);
  }

  render() {
    const { loaded } = this.state;
    const isHardLoaded = loaded.hasReceivedCode;
    const isSoftLoaded = loaded.editorLoaded;
    const isLoaded = isHardLoaded && isSoftLoaded;
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
          className={`grid grid-cols-2 gap-4 mt-4 ${
            isLoaded ? '' : 'invisible'
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
                className={`${
                  !this.state.showGeneratorCode ? 'bg-blue-100' : 'bg-white'
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
                className={`${
                  this.state.showGeneratorCode ? 'bg-blue-100' : 'bg-white'
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
                    tsModelType: this.config.tsModelType
                  }}
                >
                  <PlaygroundJavaScriptConfigContext.Provider value={{}}>
                    <PlaygroundCSharpConfigContext.Provider value={{}}>
                      <PlaygroundDartConfigContext.Provider value={{}}>
                        <PlaygroundGoConfigContext.Provider value={{}}>
                          <PlaygroundJavaConfigContext.Provider value={{}}>
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
            <PlaygroundGeneratedContext.Provider
              value={{
                language: this.config.language,
                models: this.state.models
              }}
            >
              <GeneratedModelsComponent setNewQuery={this.setNewQuery} />
            </PlaygroundGeneratedContext.Provider>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Playground);
