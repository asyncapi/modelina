import { 
  CommonGeneratorOptions,
  defaultGeneratorOptions,
} from "../AbstractGenerator";
import { CommonModel, CommonInputModel } from "../../models";
import { TypeHelpers, ModelKind } from "../../helpers";

import { ClassRenderer } from "./renderers/ClassRenderer";
import { TypeScriptGenerator } from "./TypeScriptGenerator_a";

export interface JavaScriptOptions extends CommonGeneratorOptions {
  renderTypes?: false;
}

/**
 * Generator for TypeScript
 */
export class JavaScriptGenerator extends TypeScriptGenerator {
  static defaultOptions: JavaScriptOptions = {
    ...defaultGeneratorOptions,
    renderTypes: false,
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
  }

  async render(model: CommonModel, modelName: string, inputModel: CommonInputModel): Promise<string> {
    const kind = TypeHelpers.extractKind(model);
    switch(kind) {
      case ModelKind.OBJECT: {
        return this.renderClass(model, modelName, inputModel);
      }
      default: return this.renderClass(model, modelName, inputModel);
    }
  }

  async renderClass(model: CommonModel, modelName: string, inputModel: CommonInputModel): Promise<string> {
    const renderer = new ClassRenderer(model, modelName, inputModel, this.options);
    return renderer.render();
  }
}
