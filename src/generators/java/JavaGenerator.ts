import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions,
} from "../AbstractGenerator";
import { CommonModel, CommonInputModel } from "../../models";
import { ModelKind, TypeHelpers } from "../../helpers";

import { ClassRenderer } from "./renderers/ClassRenderer";
import { EnumRenderer } from "./renderers/EnumRenderer";

export interface JavaOptions extends CommonGeneratorOptions {}

export class JavaGenerator extends AbstractGenerator {
  static defaultOptions: JavaOptions = {
    ...defaultGeneratorOptions,
  };

  static createGenerator(options?: JavaOptions): JavaGenerator {
    return new this(options);
  }

  constructor(
    public readonly options: JavaOptions = JavaGenerator.defaultOptions,
    public readonly displayName: string = "Java",
  ) {
    super(displayName, { ...JavaGenerator.defaultOptions, ...options });
  }

  async render(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const kind = TypeHelpers.extractKind(model);
    switch(kind) {
      case ModelKind.ENUM: {
        return this.renderEnum(model, inputModel);
      }
      default: return this.renderClass(model, inputModel);
    }
  }

  async renderClass(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const renderer = new ClassRenderer(model, inputModel, this.options);
    return renderer.render();
  }

  async renderEnum(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const renderer = new EnumRenderer(model, inputModel, this.options);
    return renderer.render();
  }
}
