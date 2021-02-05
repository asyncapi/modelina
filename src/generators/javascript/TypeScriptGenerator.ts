import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions,
} from "../AbstractGenerator";
import { CommonModel, CommonInputModel } from "../../models";
import { TypeHelpers, ModelKind } from "../../helpers";

import { ClassRenderer } from "./renderers/ClassRenderer";
import { InterfaceRenderer } from "./renderers/InterfaceRenderer";
import { EnumRenderer } from "./renderers/EnumRenderer";
import { TypeRenderer } from "./renderers/TypeRenderer";

export interface TypeScriptOptions extends CommonGeneratorOptions {
  renderTypes?: boolean
  modelType?: 'class' | 'interface';
}

/**
 * Generator for TypeScript
 */
export class TypeScriptGenerator extends AbstractGenerator {
  static defaultOptions: TypeScriptOptions = {
    ...defaultGeneratorOptions,
    renderTypes: true,
    modelType: 'class',
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

  async render(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const kind = TypeHelpers.extractKind(model);
    switch(kind) {
      case ModelKind.OBJECT: {
        return this.rendeModelType(model, inputModel);
      }
      case ModelKind.ENUM: {
        return this.renderEnum(model, inputModel);
      }
      default: return this.renderType(model, inputModel);
    }
  }

  async renderClass(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const renderer = new ClassRenderer(model, inputModel, this.options);
    return renderer.render();
  }

  async renderInterface(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const renderer = new InterfaceRenderer(model, inputModel, this.options);
    return renderer.render();
  }

  async renderEnum(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const renderer = new EnumRenderer(model, inputModel, this.options);
    return renderer.render();
  }

  async renderType(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const renderer = new TypeRenderer(model, inputModel, this.options);
    return renderer.render();
  }

  private rendeModelType(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const modelType = this.options.modelType;
    switch(modelType) {
      case 'interface': {
        return this.renderInterface(model, inputModel);
      };
      default: return this.renderClass(model, inputModel);
    }
  }
}
