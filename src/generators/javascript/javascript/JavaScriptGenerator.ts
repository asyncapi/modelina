import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions,
} from "../../AbstractGenerator";
import { CommonModel, CommonInputModel } from "../../../models";
import { TypeHelpers, ModelKind } from "../../../helpers";

import { ClassRenderer } from "./renderers/ClassRenderer";

export interface JavaScriptOptions extends CommonGeneratorOptions {}

/**
 * Generator for TypeScript
 */
export class JavaScriptGenerator extends AbstractGenerator {
  static defaultOptions: JavaScriptOptions = {
    ...defaultGeneratorOptions,
  };

  static createGenerator(options?: JavaScriptOptions): JavaScriptGenerator {
    return new this(options);
  }

  constructor(
    public readonly options: JavaScriptOptions = JavaScriptGenerator.defaultOptions,
    public readonly displayName: string = "JavaScript",
  ) {
    super(displayName, { ...JavaScriptGenerator.defaultOptions, ...options });
  }

  async render(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const kind = TypeHelpers.extractKind(model);
    switch(kind) {
      case ModelKind.OBJECT: {
        return this.renderClass(model, inputModel);
      }
      default: return "";
    }
  }

  async renderClass(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const renderer = new ClassRenderer(model, inputModel, this.options);
    return renderer.render();
  }
}
