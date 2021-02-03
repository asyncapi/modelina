import { 
  CommonGeneratorOptions,
  defaultGeneratorOptions,
} from "../AbstractGenerator";
import { CommonModel, CommonInputModel } from "../../models";
import { TypeHelpers, ModelKind } from "../../helpers";

import { TypeScriptGenerator } from "./TypeScriptGenerator";

import { ClassRenderer } from "./renderers/ClassRenderer";

export interface JavaScriptOptions extends CommonGeneratorOptions {
  renderTypes?: false;
  modelType?: 'class',
}

/**
 * Generator for TypeScript
 */
export class JavaScriptGenerator extends TypeScriptGenerator {
  static defaultOptions: JavaScriptOptions = {
    ...defaultGeneratorOptions,
    renderTypes: false,
    modelType: 'class',
  };

  static createGenerator(options?: JavaScriptOptions): TypeScriptGenerator {
    return new this(options);
  }

  constructor(
    public readonly options: JavaScriptOptions = JavaScriptGenerator.defaultOptions,
    public readonly displayName: string = "JavaScript",
  ) {
    super({ ...TypeScriptGenerator.defaultOptions, ...options }, displayName);
    this.options.renderTypes = false; // must be override in any case
    this.options.modelType = 'class'; // must be override in any case
  }

  async render(model: CommonModel, modelName: string, inputModel: CommonInputModel): Promise<string> {
    const kind = TypeHelpers.extractKind(model);
    switch(kind) {
      case ModelKind.OBJECT: {
        return this.renderClass(model, modelName, inputModel);
      }
      default: return "";
    }
  }

  async renderClass(model: CommonModel, modelName: string, inputModel: CommonInputModel): Promise<string> {
    const renderer = new ClassRenderer(model, modelName, inputModel, this.options);
    return renderer.render();
  }
}
