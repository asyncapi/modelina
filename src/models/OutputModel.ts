import { CommonInputModel } from "./CommonInputModel"

export interface IOutputModel {
  content: string;
  inputModel: CommonInputModel;
}

/**
 * Common representation for the output model.
 */
export class OutputModel {
  constructor(
    public readonly content: string,
    public readonly inputModel: CommonInputModel,
  ) {}

  static toOutputModel(args: IOutputModel): OutputModel;
  static toOutputModel(args: Array<IOutputModel>): Array<OutputModel>;
  static toOutputModel(args: IOutputModel | Array<IOutputModel>): OutputModel | Array<OutputModel> {
    if (Array.isArray(args)) {
      return args.map(arg => new this(arg.content, arg.inputModel));
    }
    return new this(args.content, args.inputModel);
  }
}
