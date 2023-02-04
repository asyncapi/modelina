import React, { useContext, useEffect, useRef, useState } from 'react';
import MonacoEditorWrapper from '../MonacoEditorWrapper';
import { defaultAsyncapiDocument, ModelinaOptions, ModelinaQueryOptions, SocketIoChannels, SocketIoGenerateMessage, SocketIoUpdateMessage } from '@/types';
import Router, { withRouter, NextRouter } from 'next/router';
import { encode, decode } from 'js-base64';
import { socket } from "../services/Socket";
import GeneratedModelsComponent from './GeneratedModels';
import PlaygroundOptions from './PlaygroundOptions';
import Heading from '../typography/Heading';
import Paragraph from '../typography/Paragraph';
import { PlaygroundGeneratedContextInstance } from '../contexts/PlaygroundGeneratedContext';
import { PlaygroundGeneralConfigContextInstance } from '../contexts/PlaygroundGeneralConfigContext';
import { PlaygroundTypeScriptConfigContextInstance } from '../contexts/PlaygroundTypeScriptConfigContext';
interface WithRouterProps {
  router: NextRouter
}

interface ModelsGeneratorProps {
  code: string;
  name: string;
};
interface ModelinaPlaygroundProps extends WithRouterProps { };

type ModelinaPlaygroundState = {
  input: string,
  models: ModelsGeneratorProps[],
  generatorCode: string,
  loaded: {
    editorLoaded: boolean,
    hasReceivedCode: boolean
  },
  config: ModelinaOptions,
  showGeneratorCode: boolean
}

class Playground extends React.Component<ModelinaPlaygroundProps, ModelinaPlaygroundState> {
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
      config: {
        language: 'typescript',
        tsMarshalling: false,
        tsModelType: 'class'
      }
    }
    this.setNewQuery = this.setNewQuery.bind(this);
    this.generateNewCode = this.generateNewCode.bind(this);
  }

  /**
   * Set a query key and value  
   */
  setNewQuery(queryKey: string, queryValue: string) {
    const newQuery = {
      query: { ...this.props.router.query },
    }
    newQuery.query[queryKey] = queryValue;
    Router.push(newQuery, undefined, { scroll: false });
  }

  /**
   * Tell the socket io server that we want some code
   */
  generateNewCode(input: string) {
    const message: SocketIoGenerateMessage = {
      ...this.state.config,
      input: encode(JSON.stringify(JSON.parse(input)))
    }
    socket.emit(SocketIoChannels.GENERATE, message);
  }

  componentDidMount(): void {
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
    const query = this.props.router.query as ModelinaQueryOptions;
    const localState = {...this.state};

    if (query.tsMarshalling !== undefined) {
      localState.config.tsMarshalling = (query.tsMarshalling === 'true');
    }
    if (query.tsModelType !== undefined) {
      localState.config.tsModelType = query.tsModelType as any;
    }
    if(query.language !== undefined) {
      localState.config.language = query.language as any;
    }
    console.log(localState);

    const isHardLoaded = loaded.hasReceivedCode;
    const isSoftLoaded = loaded.editorLoaded;
    const isLoaded = isHardLoaded && isSoftLoaded;
    let loader;
    if (!isHardLoaded) {
      loader = <div className="mt-12 text-2xl absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
        Loading Modelina Playground. Connecting to playground server...
      </div>
    } else if (!isSoftLoaded) {
      loader = <div className="mt-12 text-2xl absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
        Loading Modelina Playground. Rendering playground components...
      </div>
    }
    return (

      <div className="py-16 overflow-hidden lg:py-24">
        <div className="relative text-center">
          <Heading level="h1" typeStyle="heading-lg">
            Modelina Playground
          </Heading>
          <Paragraph className="mt-4 max-w-3xl mx-auto">
            Try out Modelina and see a small fraction of what it can do. Use it to play around, with small examples, otherwise turn to the CLI or library instead.
          </Paragraph>
        </div>
        {loader}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 ${isLoaded ? '' : 'invisible'}`}>
          <div className="flex flex-wrap col-span-2">
            <div className="basis-full" style={{ height: "500px" }}>
              <div className="overflow-hidden bg-white shadow sm:rounded-lg flex flex-row">
                <div className="px-4 py-5 sm:px-6 basis-6/12">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Modelina Options</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Change the generation options, or see the Modelina configuration you can use directly in your library</p>
                </div>

                <div onClick={() => { this.setState({ ...this.state, showGeneratorCode: false }) }} className={`${!this.state.showGeneratorCode ? "bg-blue-100" : "bg-white"} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 basis-3/12`}>
                  <dt className="text-sm font-medium text-gray-500">Options</dt>
                </div>
                <div onClick={() => { this.setState({ ...this.state, showGeneratorCode: true }) }} className={`${this.state.showGeneratorCode ? "bg-blue-100" : "bg-white"} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 basis-3/12`}>
                  <dt className="text-sm font-medium text-gray-500">Generator code</dt>
                </div>
              </div>
              {
                this.state.showGeneratorCode ?
                  <div className="bg-code-editor-dark text-white rounded-b shadow-lg font-bold" style={{ height: "400px" }}>
                    <MonacoEditorWrapper
                      options={{ readOnly: true }}
                      language="typescript"
                      value={this.state.generatorCode || ''}
                    />
                  </div>
                  :
                  <PlaygroundGeneralConfigContextInstance.Provider
                    value={{ language: localState.config.language }}
                  >
                    <PlaygroundTypeScriptConfigContextInstance.Provider
                      value={{ tsMarshalling: localState.config.tsMarshalling, tsModelType: localState.config.tsModelType }}
                    >
                      <PlaygroundOptions setNewQuery={this.setNewQuery} />
                    </PlaygroundTypeScriptConfigContextInstance.Provider>
                  </PlaygroundGeneralConfigContextInstance.Provider>
              }
            </div>
            <div className="basis-1/2">
              <div className="h-full bg-code-editor-dark text-white rounded-b shadow-lg font-bold">
                <MonacoEditorWrapper
                  value={this.state.input}
                  onChange={(_, change) => {
                    const encodedString = encode(change);
                    //this.setNewQuery("input", encodedString);
                    this.setState({ ...this.state, input: change });
                    this.generateNewCode(change);
                  }}
                  editorDidMount={() => {
                    this.setState({ loaded: { ...this.state.loaded, editorLoaded: true } });
                  }}
                  language="json"
                />
              </div>
            </div>
            <div className="basis-1/2" style={{ height: "750px" }}>
              <PlaygroundGeneratedContextInstance.Provider
                value={{ language: localState.config.language, models: localState.models }}
              >
                <GeneratedModelsComponent setNewQuery={this.setNewQuery} />
              </PlaygroundGeneratedContextInstance.Provider>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Playground);
