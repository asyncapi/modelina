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

  static toOutputModel(args: IOutputModel): OutputModel;
  static toOutputModel(args: Array<IOutputModel>): Array<OutputModel>;
  static toOutputModel(args: IOutputModel | Array<IOutputModel>): OutputModel | Array<OutputModel> {
    if (Array.isArray(args)) {
      return args.map(arg => new this(arg.content, arg.commonModel));
    }
    return new this(args.content, args.commonModel);
  }
}
