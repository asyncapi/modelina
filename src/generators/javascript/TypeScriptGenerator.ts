import { AbstractGenerator, CommonGeneratorOptions } from "../AbstractGenerator";

import { ModelKind, TypeHelpers, FormatHelpers, IndentationTypes } from "../../helpers";
import { CommonModel, CommonInputModel } from "../../models";
import { ClassRenderer, InterfaceRenderer, EnumRenderer } from "./renderers";

export interface TypeScriptOptions extends CommonGeneratorOptions {
  objectModelType?: 'class' | 'interface';
  renderTypes?: boolean
}

export class TypeScriptGenerator extends AbstractGenerator {
  static defaultOptions: TypeScriptOptions = {
    indentation: {
      type: IndentationTypes.SPACES,
      size: 2,
    },
    objectModelType: 'class',
    renderTypes: true,
    namingConvention: FormatHelpers.camelCase,
  };

  static createGenerator(options: TypeScriptOptions = this.defaultOptions): TypeScriptGenerator {
    return new this({ ...this.defaultOptions, ...options });
  }

  constructor(
    public readonly options: TypeScriptOptions,
    public readonly displayName: string = "TypeScript",
  ) {
    super(displayName, options);
  }

  async render(model: CommonModel, modelName: string, inputModel: CommonInputModel): Promise<string> {
    const kind = TypeHelpers.extractKind(model);
    switch(kind) {
      case ModelKind.OBJECT: {
        switch(this.options.objectModelType) {
          case 'class': return this.renderClass(model, modelName, inputModel);
          case 'interface': return this.renderInterface(model, modelName, inputModel);
          default: return this.renderClass(model, modelName, inputModel);
        }
      }
      case ModelKind.ENUM: {
        return this.renderEnum(model, modelName, inputModel);
      }
      default: return this.renderClass(model, modelName, inputModel);
    }
  }

  async renderClass(model: CommonModel, modelName: string, inputModel: CommonInputModel): Promise<string> {
    const renderer = new ClassRenderer(model, modelName, inputModel, this.options);
    return renderer.render();
  }

  async renderInterface(model: CommonModel, modelName: string, inputModel: CommonInputModel): Promise<string> {
    const renderer = new InterfaceRenderer(model, modelName, inputModel, this.options);
    return renderer.render();
  }

  async renderEnum(model: CommonModel, modelName: string, inputModel: CommonInputModel): Promise<string> {
    const renderer = new EnumRenderer(model, modelName, inputModel, this.options);
    return renderer.render();
  }
}
