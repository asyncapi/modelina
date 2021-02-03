import { CommonInputModel, CommonModel, OutputModel } from "../models";
import { InputProcessor } from "../processors";
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
  processor = new InputProcessor();
  constructor(
    public readonly displayName: string,
    public readonly options?: O,
  ) {}

  public abstract render(model: CommonModel, inputModel: CommonInputModel): Promise<string>;

  public async process(input: any): Promise<CommonInputModel> {
    return await this.processor.process(input);
  }

  public generate(input: CommonInputModel): Promise<OutputModel[]>;
  public generate(input: any, type: string): Promise<OutputModel[]>;
  public async generate(input: any): Promise<OutputModel[]> {
    if (input instanceof CommonInputModel) {
      return this.generateModels(input);
    }
    const model = await this.process(input);
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
