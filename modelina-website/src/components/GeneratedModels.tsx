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
  selectedModel?: string
}
class GeneratedModelsComponent extends React.Component<GeneratedModelsComponentProps, GeneratedModelsComponentState> {
  constructor(props: GeneratedModelsComponentProps) {
    super(props);
    this.setNewModel = this.setNewModel.bind(this);
    const query = this.props.router.query as PostPageQuery;
    let selectedModel = query.selectedModel;

    this.state = {
      selectedModel
    }
  }

  componentDidMount(): void {
    const query = this.props.router.query as PostPageQuery;
    let selectedModel = query.selectedModel;
    this.setState({...this.state, selectedModel});
  }

  setNewQuery(queryKey: string, queryValue: string) {
    const newQuery = {
      query: { ...this.props.router.query},
    }
    newQuery.query[queryKey] = queryValue;
    Router.push(newQuery, undefined, { scroll: false });
  }

  setNewModel(modelName: string){
    this.setNewQuery("selectedModel", modelName);
    this.setState({...this.state, selectedModel: modelName});

  }

  render() {
    let selectedCode = '';
    let selectedModel = this.state.selectedModel;

    if(this.props.showAllInOneFile === true) { 
      //Merge all models together
      selectedCode = this.props.models.map(model => `${model.code}`).join('\n\n');
    } else if(this.state.selectedModel !== undefined) {
      for (const model of this.props.models) {
        if(model.name === this.state.selectedModel) {
          selectedCode = model.code;
          continue;
        }
      }
    }

    if(selectedCode === '' && this.props.models.length > 0) {
      //If the model is not found default to first one
      const defaultModel = this.props.models[0];
      selectedCode = defaultModel.code;
      selectedModel = defaultModel.name;
    }

    console.log(this.props.router.query);
    if(this.props.showAllInOneFile === true) {
      return (
        <div className="h-full bg-code-editor-dark text-white rounded-b shadow-lg font-bold">
          <MonacoEditorWrapper
            options={{readOnly: true}}
            language={this.props.language}
            value={selectedCode} />
        </div>
      )
    } else {
      return (
        <div className="grid grid-cols-3 h-full">
          <div className="col-span-2 h-full bg-code-editor-dark text-white rounded-b shadow-lg font-bold">
            <MonacoEditorWrapper
              options={{readOnly: true}}
              language={this.props.language}
              value={selectedCode} />
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
                  if(model.name === selectedModel) {
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
  