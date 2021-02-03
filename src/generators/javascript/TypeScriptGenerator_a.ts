import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions,
} from "../AbstractGenerator";
import { CommonModel, CommonInputModel } from "../../models";
import { TypeHelpers, ModelKind } from "../../helpers";

import { ClassRenderer } from "./renderers/ClassRenderer";

export interface TypeScriptOptions extends CommonGeneratorOptions {
  renderTypes?: boolean
}

/**
 * Generator for TypeScript
 */
export class TypeScriptGenerator extends AbstractGenerator {
  static defaultOptions: TypeScriptOptions = {
    ...defaultGeneratorOptions,
    renderTypes: true,
  };

  static createGenerator(options?: TypeScriptOptions): TypeScriptGenerator {
    return new this(options);
  }

  constructor(
    public readonly options: TypeScriptOptions = TypeScriptGenerator.defaultOptions,
    public readonly displayName: string = "TypeScript",
  ) {
    super(displayName, { ...TypeScriptGenerator.defaultOptions, ...options });
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
