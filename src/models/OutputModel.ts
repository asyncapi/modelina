import { CommonModel } from "./CommonModel"

export interface IOutputModel {
  content: string;
  commonModel: CommonModel;
}

/**
 * Common representation for the output model.
 */
export class OutputModel {
  constructor(
    public readonly content: string,
    public readonly commonModel: CommonModel,
  ) {}

  static toOutputModel(args: IOutputModel): OutputModel {
    return new this(args.content, args.commonModel);
  }

  static toOutputModels(args: Array<IOutputModel>): Array<OutputModel> {
    return args.map(arg => new this(arg.content, arg.commonModel));
  }
}
