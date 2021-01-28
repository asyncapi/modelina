import { AbstractGenerator } from "../AbstractGenerator";
import { CommonModel, CommonInputModel } from "../../models";

export interface JavaOptions {
  // to be implement
}

export class JavaGenerator extends AbstractGenerator {
  static defaultOptions: JavaOptions = {};

  static createGenerator(options: JavaOptions = this.defaultOptions): JavaGenerator {
    return new this(options);
  }

  constructor(
    public readonly options: JavaOptions,
    public readonly displayName: string = "Java",
  ) {
    super(displayName, options);
  }

  async render(model: CommonModel, modelName: string, inputModel: CommonInputModel): Promise<string> {
    return "JavaGenerator"; // placeholder
  }
}
