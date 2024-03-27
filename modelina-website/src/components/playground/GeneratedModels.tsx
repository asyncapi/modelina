import React, { useContext, useEffect, useState } from 'react';
import { PlaygroundGeneratedContext } from '../contexts/PlaygroundGeneratedContext';
import MonacoEditorWrapper from '../MonacoEditorWrapper';
import { usePlaygroundContext } from '../contexts/PlaygroundContext';

interface GeneratedModelsComponentProps {
  showAllInOneFile?: boolean;
  setNewQuery?: (queryKey: string, queryValue: any) => void;
}

const GeneratedModelsComponent: React.FC<GeneratedModelsComponentProps> = ({
  showAllInOneFile,
  setNewQuery,
}) => {
  const context = useContext(PlaygroundGeneratedContext);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const { setRenderModels, generatorCode, showGeneratorCode, setShowGeneratorCode } = usePlaygroundContext();
  const { outputLoading } = usePlaygroundContext();

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
      return context?.models.map((model) => {
        let backgroundColor;
        if (!showGeneratorCode && model.name === selectedModel) {
          backgroundColor = 'bg-[#3c4450]';
        } else {
          backgroundColor = '';
        }
        return (
          <div
            key={`GeneratedModel${model.name}`}
            onClick={() => {
              setNewQuery?.('selectedModel', model.name);
              setSelectedModel(model.name);
              setShowGeneratorCode(false);
            }}
            className={`${backgroundColor} hover:bg-[#4b5563] px-2 py-2 w-full text-left`}
          >
            <dt className="text-xs">{model.name}</dt>
          </div>
        );
      });
    }
  };

  const { selectedCode, updatedSelectedModel } = toShow();

  useEffect(() => {
    const modelsToRender = renderModels(updatedSelectedModel);
    setRenderModels(modelsToRender);
  }, [updatedSelectedModel, showGeneratorCode]);

  if (outputLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-code-editor-dark transition-opacity">
        <div className="text-white opacity-0">Loading...</div>
      </div>
    );
  }

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
    <div className="h-full">
      <div className="col-span-2 h-full bg-code-editor-dark text-white rounded-b shadow-lg font-bold transition-opacity opacity-100">
        <MonacoEditorWrapper
          options={{ readOnly: true }}
          language={context?.language}
          value={showGeneratorCode ? generatorCode : selectedCode}
        />
      </div>
    </div>
  );
};

export default GeneratedModelsComponent;