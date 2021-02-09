import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions,
} from "../../AbstractGenerator";
import { CommonModel, CommonInputModel } from "../../../models";
import { TypeHelpers, ModelKind } from "../../../helpers";

import { TypeScriptPreset, TS_DEFAULT_PRESET } from "./TypeScriptPreset";

import { ClassRenderer } from "./renderers/ClassRenderer";
import { InterfaceRenderer } from "./renderers/InterfaceRenderer";
import { EnumRenderer } from "./renderers/EnumRenderer";
import { TypeRenderer } from "./renderers/TypeRenderer";

export interface TypeScriptOptions extends CommonGeneratorOptions<TypeScriptPreset> {
  renderTypes?: boolean
  modelType?: 'class' | 'interface' | 'type';
}

/**
 * Generator for TypeScript
 */
export class TypeScriptGenerator extends AbstractGenerator<TypeScriptOptions> {
  static defaultOptions: TypeScriptOptions = {
    ...defaultGeneratorOptions,
    renderTypes: true,
    modelType: 'class',
    defaultPreset: TS_DEFAULT_PRESET,
  };

  constructor(
    options: TypeScriptOptions = TypeScriptGenerator.defaultOptions,
  ) {
    super("TypeScript", TypeScriptGenerator.defaultOptions, options);
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
    return this.renderModel(renderer, "class", model, inputModel);
  }

  async renderInterface(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const renderer = new InterfaceRenderer(model, inputModel, this.options);
    return this.renderModel(renderer, "interface", model, inputModel);
  }

  async renderEnum(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const renderer = new EnumRenderer(model, inputModel, this.options);
    return this.renderModel(renderer, "enum", model, inputModel);
  }

  async renderType(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const renderer = new TypeRenderer(model, inputModel, this.options);
    return this.renderModel(renderer, "type", model, inputModel);
  }

  private rendeModelType(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const modelType = this.options.modelType;
    switch(modelType) {
      case 'interface': {
        return this.renderInterface(model, inputModel);
      };
      case 'type': {
        return this.renderType(model, inputModel);
      };
      default: return this.renderClass(model, inputModel);
    }
  }
}
