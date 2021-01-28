import { CommonModel, OutputModel } from "../models";

export abstract class AbstractGenerator<O = object> {
  constructor(
    public readonly displayName: string,
    public readonly options?: O,
  ) {}

  public abstract generate(commonModel: CommonModel): Promise<OutputModel>;
}
