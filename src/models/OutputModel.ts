import { CommonInputModel } from './CommonInputModel';
import { CommonModel } from './CommonModel';

export interface ToOutputModelArg {
  result: string;
  model: CommonModel;
  modelName: string;
  inputModel: CommonInputModel;
  dependencies: string[];
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
    public readonly dependencies: string[]
  ) {}

  static toOutputModel(args: ToOutputModelArg): OutputModel;
  static toOutputModel(args: Array<ToOutputModelArg>): Array<OutputModel>;
  static toOutputModel(args: ToOutputModelArg | Array<ToOutputModelArg>): OutputModel | Array<OutputModel> {
    if (Array.isArray(args)) {
      return args.map(arg => new this(arg.result, arg.model, arg.modelName, arg.inputModel, arg.dependencies));
    }
    return new this(args.result, args.model, args.modelName, args.inputModel, args.dependencies);
  }
}
