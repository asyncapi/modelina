import { TypeScriptGenerator, TypeScriptOptions } from "./TypeScriptGenerator";

import { ModelKind, TypeHelpers, FormatHelpers, IndentationTypes } from "../../helpers";
import { CommonModel, CommonInputModel } from "../../models";
import { ClassRenderer } from "./renderers";

export interface JavaScriptOptions extends TypeScriptOptions {
  objectModelType?: 'class';
  renderTypes?: false,
}

export class JavaScriptGenerator extends TypeScriptGenerator {
  static defaultOptions: JavaScriptOptions = {
    indentation: {
      type: IndentationTypes.SPACES,
      size: 2,
    },
    objectModelType: 'class',
    renderTypes: false,
    namingConvention: FormatHelpers.camelCase,
  };

  static createGenerator(options: JavaScriptOptions = this.defaultOptions): JavaScriptGenerator {
    return new this({ ...this.defaultOptions, ...options });
  }

  constructor(
    public readonly options: JavaScriptOptions,
    public readonly displayName: string = "JavaScript",
  ) {
    super(options, displayName);
    this.options.renderTypes = false;
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

  async renderInterface(model: CommonModel, modelName: string, inputModel: CommonInputModel): Promise<string> {
    return "";
  }

  async renderEnum(model: CommonModel, modelName: string, inputModel: CommonInputModel): Promise<string> {
    return "";
  }
}
