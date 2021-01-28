import { CommonInputModel } from "./CommonInputModel"
import { CommonModel } from "./CommonModel";

export interface IOutputModel {
  result: string;
  model: CommonModel;
  modelName: string;
  inputModel: CommonInputModel;
}

/**
 * Common representation for the output model.
 */
export class OutputModel {
  constructor(
    public readonly result: string,
    public readonly model: CommonModel,
    public readonly modelName: string,
    public readonly inputModel: CommonInputModel,
  ) {}

  static toOutputModel(args: IOutputModel): OutputModel;
  static toOutputModel(args: Array<IOutputModel>): Array<OutputModel>;
  static toOutputModel(args: IOutputModel | Array<IOutputModel>): OutputModel | Array<OutputModel> {
    if (Array.isArray(args)) {
      return args.map(arg => new this(arg.result, arg.model, arg.modelName, arg.inputModel));
    }
    return new this(args.result, args.model, args.modelName, args.inputModel);
  }
}
