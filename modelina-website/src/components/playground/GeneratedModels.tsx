import React, { useContext, useState } from 'react';
import { PlaygroundGeneratedContext } from '../contexts/PlaygroundGeneratedContext';
import MonacoEditorWrapper from '../MonacoEditorWrapper';

interface GeneratedModelsComponentProps {
  showAllInOneFile?: boolean;
  setNewQuery?: (queryKey: string, queryValue: string) => void;
}

const GeneratedModelsComponent: React.FC<GeneratedModelsComponentProps> = ({
  showAllInOneFile,
  setNewQuery,
}) => {
  const context = useContext(PlaygroundGeneratedContext);
  const [selectedModel, setSelectedModel] = useState<string>('');

  const toShow = () => {
    let selectedCode = '';
    let updatedSelectedModel = selectedModel;

    if (context) {
      if (showAllInOneFile === true) {
        selectedCode = context.models.map((model: any) => `${model.code}`).join('\n\n');
      } else if (selectedModel !== undefined && context.models) {
        for (const model of context.models) {
          if (model.name === selectedModel) {
            selectedCode = model.code;
            break;
          }
        }
      }

      if (selectedCode === '' && (context.models && context.models.length > 0)) {
        const defaultModel = context.models[0];
        selectedCode = defaultModel.code;
        updatedSelectedModel = defaultModel.name;
      }
    }

    return { selectedCode, updatedSelectedModel };
  };

  const renderModels = (selectedModel = '') => {
    if (context?.models) {
      return context?.models.map((model, index) => {
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
              setNewQuery && setNewQuery('selectedModel', model.name);
              setSelectedModel(model.name);
            }}
            className={`${backgroundColor} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
          >
            <dt className="text-sm font-medium text-gray-500">{model.name}</dt>
          </div>
        );
      });
    }
  };

  const { selectedCode, updatedSelectedModel } = toShow();
  const modelsToRender = renderModels(updatedSelectedModel);

  if (showAllInOneFile === true) {
    return (
      <div className="h-full bg-code-editor-dark text-white rounded-b shadow-lg font-bold">
        <MonacoEditorWrapper
          options={{ readOnly: true }}
          language={context?.language}
          value={selectedCode}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 h-full">
      <div className="overflow-scroll bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Generated Models</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            This list contains all the generated models, select one to show their generated code
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>{modelsToRender}</dl>
        </div>
      </div>
      <div className="col-span-2 h-full bg-code-editor-dark text-white rounded-b shadow-lg font-bold">
        <MonacoEditorWrapper
          options={{ readOnly: true }}
          language={context?.language}
          value={selectedCode}
        />
      </div>
    </div>
  );
};

export default GeneratedModelsComponent;