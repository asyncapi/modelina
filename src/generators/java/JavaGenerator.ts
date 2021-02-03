import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions,
} from "../AbstractGenerator";
import { CommonModel, CommonInputModel } from "../../models";
import { TypeHelpers } from "../../helpers";

import { ClassRenderer } from "./renderers/ClassRenderer";

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
      default: return this.renderClass(model, inputModel);
    }
  }

  async renderClass(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const renderer = new ClassRenderer(model, inputModel, this.options);
    return renderer.render();
  }
}
