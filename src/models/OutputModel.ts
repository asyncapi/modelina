import { CommonModel } from "./CommonModel"

interface ToOutputModel {
  content: string;
  commonModel: CommonModel;
  models?: OutputModel[];
}

/**
 * Common representation for the output model.
 */
export class OutputModel {
  constructor(
    public readonly content: string,
    public readonly commonModel: CommonModel,
    public readonly models: OutputModel[] = [],
  ) {}

  static toOutputModel(args: ToOutputModel): OutputModel {
    return new this(args.content, args.commonModel, args.models);
  }
}
