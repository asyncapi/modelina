import { CommonInputModel, CommonModel, OutputModel } from "../models";
import { inputProcessor } from "../processors";
import { IndentationTypes } from "../helpers";

export interface CommonGeneratorOptions {
  indentation: {
    type: IndentationTypes;
    size: number;
  };
}

export const defaultGeneratorOptions = {
  indentation: {
    type: IndentationTypes.SPACES,
    size: 2,
  },
}

/**
 * Abstract generator which must be implemented by each language
 */
export abstract class AbstractGenerator<O = object> {
  constructor(
    public readonly displayName: string,
    public readonly options?: O,
  ) {}

  public abstract render(model: CommonModel, inputModel: CommonInputModel): Promise<string>;

  public async process(input: any, type: string = 'json-schema'): Promise<CommonInputModel> {
    return await inputProcessor.process(input, type);
  }

  public generate(input: CommonInputModel): Promise<OutputModel[]>;
  public generate(input: any, type: string): Promise<OutputModel[]>;
  public async generate(input: any, type: string = 'json-schema'): Promise<OutputModel[]> {
    if (input instanceof CommonInputModel) {
      return this.generateModels(input);
    }
    const model = await this.process(input, type);
    return this.generateModels(model);
  }

  private generateModels(inputModel: CommonInputModel): Promise<OutputModel[]> {
    const models = inputModel.models;
    const renders = Object.entries(models).map(async ([modelName, model]) => {
      const result = await this.render(model, inputModel);
      return OutputModel.toOutputModel({ result, model, modelName, inputModel });
    })
    return Promise.all(renders);
  }
}
