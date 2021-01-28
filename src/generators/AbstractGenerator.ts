import { CommonInputModel, OutputModel } from "../models";
import { inputProcessor } from "../processors";

export abstract class AbstractGenerator<O = object> {
  constructor(
    public readonly displayName: string,
    public readonly options?: O,
  ) {}

  public abstract render(model: CommonInputModel): Promise<OutputModel>;

  public generate(commonModel: CommonInputModel): Promise<OutputModel>;
  public generate(object: any, type: string): Promise<OutputModel>;
  public async generate(commonModelOrObject: any, type: string = 'json-schema'): Promise<OutputModel> {
    if (commonModelOrObject instanceof CommonInputModel) {
      return this.render(commonModelOrObject);
    }
    const model = await inputProcessor.process(commonModelOrObject, type);
    return this.render(model);
  }
}
