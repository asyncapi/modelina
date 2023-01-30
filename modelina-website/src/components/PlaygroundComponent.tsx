
import React, { useRef, useState } from 'react';
import Select from './Select';
import MonacoEditorWrapper from './MonacoEditorWrapper';
import TypeScriptOptions from './TypeScriptGenerator';
const modelinaLanguageOptions = [
  { 
    "value": "typescript", 
    "text": "TypeScript" 
  }
];

type ModelinaPlaygroundProps = {
  onError: (err: any) => void
};

type ModelsAndCode = {
  title: string,
  code: string
}
type ModelinaPlaygroundState = {
  input: string,
  models: ModelsAndCode[],// Former models
  generatorCode: string,
  rawGeneratorCode: '',
  generator: any,
  generatorOptions: any,
  language: string,
  loaded: boolean
}
export class ModelinaPlayground extends React.Component<ModelinaPlaygroundProps, ModelinaPlaygroundState> {
  constructor(props: ModelinaPlaygroundProps) {
    super(props)
    this.state = {
      input: JSON.stringify(playgroundAsyncAPIDocument, null, 4),
      models: [],
      generatorCode: '',
      rawGeneratorCode: '',
      generator: undefined,
      generatorOptions: undefined,
      language: 'typescript',
      loaded: false,
    }

    this.generateOutput = this.generateOutput.bind(this)
    this.onGeneratorChange = this.onGeneratorChange.bind(this)
    this.setNewLanguageOptions = this.setNewLanguageOptions.bind(this)
  }

  componentDidMount() {
    this.setNewLanguageOptions(this.state.language)
  }

  async generateOutput() {
    try {
      const models = await this.state.generator.generate(this.state.input, { processorOptions: { asyncapi: { path: './' } } })
      const newCodeblockModels = []
      for (const model of models) {
        newCodeblockModels.push({
          title: model.modelName,
          code: `${model.dependencies.join('\n')}\n\n${model.result}`.trim(),
        });
      }
      const newGeneratorCode = `${this.state.rawGeneratorCode}
  
  // const input = ...AsyncAPI document
  const models = await generator.generate(input)`
      this.setState({ ...this.state, models: newCodeblockModels, generatorCode: newGeneratorCode })
      this.props.onError(undefined)
    } catch (e) {
      console.log(e)
      this.props.onError(e)
    }
  }

  async onGeneratorChange({ generator, generatorCode: rawGeneratorCode }: any) {
    this.setState({ ...this.state, generator, rawGeneratorCode })
    await this.generateOutput()
  }

  setNewLanguageOptions(newLanguage: string) {
    let generatorOptions;
    if (newLanguage === 'typescript') {
      generatorOptions = <TypeScriptOptions key={"typescript"} onGeneratorChange={this.onGeneratorChange} onInit={this.onGeneratorChange} />
    }
    this.setState({ ...this.state, generatorOptions: generatorOptions, language: newLanguage })
  }

  render() {
    const { loaded, generatorOptions } = this.state;

    return (
      <div className="relative">
        {!loaded && (
          <div className="mt-12 text-2xl absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
            Loading Modelina Playground. Please wait...
          </div>
        )}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 ${loaded ? '' : 'invisible'}`}>
          <div className="col-span-2 mb-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="col-span-1 text-center">
                <div>
                  <div className="inline-flex items-center ml-6">
                    <h4 className="mr-2">
                      Select the desired language:
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
                      Missing a language? Please let us know!
                    </a>
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="flex flex-wrap">
              <div className="basis-1/2">
                <div className="h-full bg-code-editor-dark text-white px-4 rounded-b shadow-lg">
                  <MonacoEditorWrapper
                    value={this.state.input}
                    onChange={(_, change) => {
                      this.setState({ input: change });
                      this.generateOutput();
                    }}
                    editorDidMount={() => {
                      this.setState({ loaded: true });
                    }}
                    language="yaml"
                  />
                </div>
              </div>
              <div className="basis-1/2">
                <div className="h-full bg-code-editor-dark text-white px-4 rounded-b shadow-lg font-bold">
                  {generatorOptions}
                </div>
              </div>
              <div className="basis-1/2">
                <MonacoEditorWrapper
                  language="javascript"
                  value={this.state.generatorCode || ''}

                />
              </div>
              <div className="basis-1/2"><MonacoEditorWrapper value={this.state.models === undefined || this.state.models.length === 0 ? '' : this.state.models[0].code}></MonacoEditorWrapper></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}