import { PostPageQuery} from "@/types";
import Router, { NextRouter, withRouter } from "next/router";
import React from "react";
import MonacoEditorWrapper from "./MonacoEditorWrapper";
interface WithRouterProps {
  router: NextRouter
}
interface GeneratedModelsComponentProps extends WithRouterProps {
  models: ModelsGeneratorProps[],
  language: string,
  showAllInOneFile?: boolean
}
interface ModelsGeneratorProps {
  code: string;
  name: string;
};

type GeneratedModelsComponentState = {
  selectedModel?: string,
  selectedCode?: string,
}
class GeneratedModelsComponent extends React.Component<GeneratedModelsComponentProps, GeneratedModelsComponentState> {
  constructor(props: GeneratedModelsComponentProps) {
    super(props);
    this.setNewModel = this.setNewModel.bind(this);
    this.getNewModel = this.getNewModel.bind(this);

    let selectedModel = '';
    let selectedCode = '';
    if(this.props.showAllInOneFile === true) { 
      //Merge all models together
      selectedCode = this.props.models.map(model => `${model.code}`).join('\n\n');
    } 

    this.state = {
      selectedModel,
      selectedCode
    }
  }

  componentDidMount(): void {
    const query = this.props.router.query as PostPageQuery;
    let selectedModel = query.selectedModel;
    let selectedCode = '';

    if(this.props.showAllInOneFile === true) { 
      if(query.selectedModel !== undefined) {
        const newModels = this.getNewModel(selectedModel);
        console.log(newModels);
        selectedModel = newModels.selectedModel;
        selectedCode = newModels.selectedCode;
      } else {
        if(this.props.models.length > 0) {
          selectedModel = this.props.models[0].name;
          selectedCode = this.props.models[0].code;
        }
      }
    }
    
  }

  setNewQuery(queryKey: string, queryValue: string) {
    const newQuery = {
      query: { ...this.props.router.query},
    }
    newQuery.query[queryKey] = queryValue;
    Router.push(newQuery, undefined, { scroll: false });
  }

  getNewModel(modelName: string | undefined) : {selectedCode: string, selectedModel: string} {
    let newModelCode: string = '';
    if(modelName !== undefined) {
      //Find the appropriate model to show
      if(this.props.models.length > 0) {
        for (const model of this.props.models) {
          if(model.name === modelName) {
            newModelCode = model.code;
            continue;
          }
        }
        if(newModelCode === '') {
          //If the model is not found default to first one
          const defaultModel = this.props.models[0];
          newModelCode = defaultModel.code;
          modelName = defaultModel.name;
        }
      }
      return {selectedCode: newModelCode, selectedModel: modelName};
    }
    return {selectedCode: newModelCode, selectedModel: ''};
  }
  setNewModel(modelName: string){
    const {selectedCode, selectedModel} = this.getNewModel(modelName);
    this.setNewQuery("selectedModel", selectedModel);
    this.setState({...this.state, selectedCode, selectedModel});

  }

  render() {
    if(this.props.showAllInOneFile === true) {
      return (
        <div className="h-full bg-code-editor-dark text-white rounded-b shadow-lg font-bold">
          <MonacoEditorWrapper
            options={{readOnly: true}}
            language={this.props.language}
            value={this.state.selectedCode} />
        </div>
      )
    } else {
      return (
        <div className="grid grid-cols-3">
          <div className="col-span-2 h-full bg-code-editor-dark text-white rounded-b shadow-lg font-bold">
            <MonacoEditorWrapper
              options={{readOnly: true}}
              language={this.props.language}
              value={this.state.selectedCode} />
          </div>
          <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Generated Models</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">This list contains all the generated models, press each one to show the generated code</p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                {this.props.models.map((model, index) => {
                  let backgroundColor;
                  if(model.name === this.state.selectedModel) {
                    backgroundColor = "bg-blue-100";
                  } else {
                    backgroundColor = index % 2 === 0 ? "bg-gray-50" : "bg-white";
                  }
                  return <div key={"GeneratedModel" + model.name} onClick={() => {this.setNewModel(model.name)}} className={`${backgroundColor} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                  <dt className="text-sm font-medium text-gray-500">{model.name}</dt>
                </div>
                })}
              </dl>
            </div>
          </div>
        </div>
      )

    }
  }
}
export default withRouter(GeneratedModelsComponent);
  