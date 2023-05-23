import React from 'react';
import { PlaygroundGeneratedContext } from '../contexts/PlaygroundGeneratedContext';
import MonacoEditorWrapper from '../MonacoEditorWrapper';

interface GeneratedModelsComponentProps {
  showAllInOneFile?: boolean;
  setNewQuery?: (queryKey: string, queryValue: string) => void;
}

type GeneratedModelsComponentState = {
  selectedModel?: string;
};
class GeneratedModelsComponent extends React.Component<
  GeneratedModelsComponentProps,
  GeneratedModelsComponentState
> {
  static contextType = PlaygroundGeneratedContext;
  declare context: React.ContextType<typeof PlaygroundGeneratedContext>;
  constructor(props: GeneratedModelsComponentProps) {
    super(props);
    this.setNewQuery = this.setNewQuery.bind(this);
    this.state = {
      selectedModel: ''
    };
  }

  setNewQuery(modelName: string) {
    if (this.props.setNewQuery) {
      this.props.setNewQuery('selectedModel', modelName);
    }
    this.setState({ ...this.state, selectedModel: modelName });
  }

  toShow() {
    let selectedCode = '';
    let selectedModel = this.state.selectedModel;
    if (this.context) {
      if (this.props.showAllInOneFile === true) {
        //Merge all models together
        selectedCode = this.context.models
          .map((model: any) => `${model.code}`)
          .join('\n\n');
      } else if (this.state.selectedModel !== undefined && this.context.models) {
        for (const model of this.context.models) {
          if (model.name === this.state.selectedModel) {
            selectedCode = model.code;
            break;
          }
        }
      }

      if (selectedCode === '' && (this.context.models && this.context.models.length > 0)) {
        //If the model is not found default to first one
        const defaultModel = this.context.models[0];
        selectedCode = defaultModel.code;
        selectedModel = defaultModel.name;
      }
    }
    return { selectedCode, selectedModel };
  }

  renderModels(selectedModel = '') {
    if(this.context?.models){
      return this.context?.models.map((model, index) => {
        let backgroundColor;
        if (model.name === selectedModel) {
          backgroundColor = 'bg-blue-100';
        } else {
          backgroundColor = index % 2 === 0 ? 'bg-gray-50' : 'bg-white';
        }
        return (
          <div
            key={`GeneratedModel${model.name}`}
            onClick={() => {
              this.setNewQuery(model.name);
            }}
            className={`${backgroundColor} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
          >
            <dt className="text-sm font-medium text-gray-500">{model.name}</dt>
          </div>
        );
      });
    };
  }

  render() {
    const { selectedCode, selectedModel } = this.toShow();
    const modelsToRender = this.renderModels(selectedModel);
    if (this.props.showAllInOneFile === true) {
      return (
        <div className="h-full bg-code-editor-dark text-white rounded-b shadow-lg font-bold">
          <MonacoEditorWrapper
            options={{ readOnly: true }}
            language={this.context?.language}
            value={selectedCode}
          />
        </div>
      );
    }
    return (
      <div className="grid grid-cols-3 h-full">
        <div className="overflow-scroll bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Generated Models
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              This list contains all the generated models, select one to show
              their generated code
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>{modelsToRender}</dl>
          </div>
        </div>
        <div className="col-span-2 h-full bg-code-editor-dark text-white rounded-b shadow-lg font-bold">
          <MonacoEditorWrapper
            options={{ readOnly: true }}
            language={this.context?.language}
            value={selectedCode}
          />
        </div>
      </div>
    );
  }
}
export default GeneratedModelsComponent;
