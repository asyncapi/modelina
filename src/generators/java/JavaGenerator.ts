import { AbstractGenerator } from "../AbstractGenerator";
import { CommonInputModel, OutputModel } from "../../models";

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

  async render(inputModel: CommonInputModel): Promise<OutputModel> {
    return OutputModel.toOutputModel({ content: "", inputModel, });
  }
}
