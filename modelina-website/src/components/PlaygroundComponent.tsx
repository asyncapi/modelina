
import React, { useEffect, useRef, useState } from 'react';
import Select from './Select';
import MonacoEditorWrapper from './MonacoEditorWrapper';
import TypeScriptOptions from './TypeScriptGenerator';
import { defaultAsyncapiDocument, PostPageQuery, SocketIoChannels, SocketIoGenerateMessage, SocketIoUpdateMessage } from '@/types';
import Router, { withRouter, NextRouter } from 'next/router';
import { encode, decode } from 'js-base64';
import {socket} from "./services/Socket";
import GeneratedModelsComponent from './GeneratedModelsComponent';
interface WithRouterProps {
  router: NextRouter
}
const modelinaLanguageOptions = [
  { 
    "value": "typescript", 
    "text": "TypeScript" 
  }
];

interface ModelsGeneratorProps {
  code: string;
  name: string;
};
interface ModelinaPlaygroundProps extends WithRouterProps {};

type ModelinaPlaygroundState = {
  input: string,
  models: ModelsGeneratorProps[],// Former models
  generatorCode: string,
  language: string,
  loaded: {
    editorLoaded: boolean,
    hasReceivedCode: boolean
  },
  config: any
}

class ModelinaPlayground extends React.Component<ModelinaPlaygroundProps, ModelinaPlaygroundState> {
  constructor(props: ModelinaPlaygroundProps) {
    super(props);
    const query = this.props.router.query as PostPageQuery;

    this.state = {
      input: query.input ? decode(query.input) : JSON.stringify(defaultAsyncapiDocument, null, 4),
      models: [],
      generatorCode: '',
      language: query.language as any || 'typescript',
      loaded: {
        editorLoaded: false,
        hasReceivedCode: false
      },
      config: {}
    }
    this.setNewLanguageOptions = this.setNewLanguageOptions.bind(this);
    this.setNewConfig = this.setNewConfig.bind(this);
    this.setNewQuery = this.setNewQuery.bind(this);
    this.generateNewCode = this.generateNewCode.bind(this);
  }
  
  /**
   * Let each generator options push new properties with new values.
   * 
   * For each change the following will happen:
   * 1) push the new query parameters
   * 2) emit to the socket server that new code needs to be generated
   */
  setNewConfig(propertyKey: string, propertyValue: string) {
    this.setNewQuery(propertyKey, propertyValue);
    const newState = {...this.state, config: {...this.state.config}};
    newState.config[propertyKey] = propertyValue;
    this.setState(newState);
  }

  /**
   * Set a query key and value  
   */
  setNewQuery(queryKey: string, queryValue: string) {
    const newQuery = {
      query: { ...this.props.router.query},
    }
    newQuery.query[queryKey] = queryValue;
    Router.push(newQuery, undefined, { scroll: false });
  }

  /**
   * Tell the socket io server that we want some code
   */
  generateNewCode(){
    const message: SocketIoGenerateMessage = {
      ...this.state.config,
      language: this.state.language,
      input: encode(JSON.stringify(JSON.parse(this.state.input)))
    }
    console.log(message);
    socket.emit(SocketIoChannels.GENERATE, message);
  }

  componentDidMount(): void {
    // update chat on new message dispatched
    socket.on(SocketIoChannels.UPDATE, (message: SocketIoUpdateMessage) => {
      console.log(message)
      this.setState({...this.state, 
        generatorCode: message.generatorCode, 
        models: message.models,
        loaded: {
          ...this.state.loaded,
          hasReceivedCode: true
        }
      });
    });
    this.generateNewCode();
  }

  setNewLanguageOptions(newLanguage: string) {
    this.setNewQuery("language", newLanguage);
    this.setState({...this.state, language: newLanguage});
  }

  render() {
    const { loaded, language } = this.state;
    let generatorOptions;
    if(language === 'typescript'){
      generatorOptions = <TypeScriptOptions key={"typescript"} setNewConfig={this.setNewConfig}/>
    }
    const isHardLoaded = loaded.hasReceivedCode;
    const isSoftLoaded = loaded.editorLoaded;
    const isLoaded = isHardLoaded && isSoftLoaded;
    let loader;
    if(!isHardLoaded) {
      loader = <div className="mt-12 text-2xl absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
      Loading Modelina Playground. Connecting to playground server...
    </div>
    } else if(!isSoftLoaded) {
      loader = <div className="mt-12 text-2xl absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
      Loading Modelina Playground. Rendering playground components...
    </div>
    }
    const playgroundCode = (
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 ${isLoaded ? '' : 'invisible'}`}>
          <div className="col-span-2 mb-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="col-span-1 text-center">
                <div>
                  <div className="inline-flex items-center ml-6">
                    <h4 className="mr-2">
                      Select the desired output:
                    </h4>
                    <Select
                      options={modelinaLanguageOptions}
                      selected={this.state.language}
                      onChange={this.setNewLanguageOptions}
                      className="shadow-outline-blue cursor-pointer"
                    />
                  </div>
                  <h4 className="underline mt-2 hover:text-secondary-500 transition duration-300 ease">
                    <a href="https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md" target="_blank" rel="noopener noreferrer">
                      Missing an output? Please let us know!
                    </a>
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="flex flex-wrap">
              <div className="basis-1/2" style={{height: "300px"}}>
                <MonacoEditorWrapper
                  options={{readOnly: true}}
                  language="typescript"
                  value={this.state.generatorCode || ''}
                />
              </div>
              <div className="basis-1/2" style={{height: "300px"}}>
                <div className="h-full bg-code-editor-dark text-white rounded-b shadow-lg font-bold">
                  {generatorOptions}
                </div>
              </div>

              <div className="basis-1/2">
                <div className="h-full bg-code-editor-dark text-white rounded-b shadow-lg font-bold">
                  <MonacoEditorWrapper
                    value={this.state.input}
                    onChange={(_, change) => {
                      const encodedString = encode(change);
                      this.setNewQuery("input", encodedString);
                      this.generateNewCode();
                    }}
                    editorDidMount={() => {
                      this.setState({ loaded: {...this.state.loaded, editorLoaded: true} });
                    }}
                    language="json"
                  />
                </div>
              </div>
              <div className="basis-1/2" style={{height: "300px"}}>
                <GeneratedModelsComponent language={this.state.language} models={this.state.models}/>
              </div>
            </div>
          </div>
        </div>);
    return (
      <div className="relative">
        {loader}
        {playgroundCode}
      </div>
    )
  }
}
export default withRouter(ModelinaPlayground);
