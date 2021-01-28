import { AbstractGenerator } from "../AbstractGenerator";
import { CommonModel, OutputModel } from "../../models";

export interface TypeScriptOptions {
  // to be implement
}

export class TypeScriptGenerator extends AbstractGenerator {
  static defaultOptions: TypeScriptOptions = {};

  static createGenerator(options: TypeScriptOptions = this.defaultOptions): TypeScriptGenerator {
    return new this(options);
  }

  constructor(
    public readonly options: TypeScriptOptions,
    public readonly displayName: string = "TypeScript",
  ) {
    super(displayName, options);
  }

  async generate(commonModel: CommonModel): Promise<OutputModel> {
    return OutputModel.toOutputModel({ content: "", commonModel, });
  }
}
