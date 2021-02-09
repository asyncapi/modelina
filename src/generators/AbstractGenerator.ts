import { AbstractRenderer } from "./AbstractRenderer";
import { CommonInputModel, CommonModel, OutputModel, Preset } from "../models";
import { InputProcessor } from "../processors";
import { IndentationTypes } from "../helpers";

export interface CommonGeneratorOptions<P extends Preset = Preset, R extends Record<string, AbstractRenderer> = any> {
  indentation?: {
    type: IndentationTypes;
    size: number;
  };
  renderers?: R;
  defaultPreset?: P;
  presets?: Array<P>;
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
export abstract class AbstractGenerator<Options extends CommonGeneratorOptions = CommonGeneratorOptions> {
  private processor = new InputProcessor();
  protected options: Options;
  
  constructor(
    public readonly languageName: string,
    defaultOptions?: Options,
    passedOptions?: Options,
  ) {
    this.options = this.mergeOptions(defaultOptions, passedOptions);
  }

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

  protected generateModels(inputModel: CommonInputModel): Promise<OutputModel[]> {
    const models = inputModel.models;
    const renders = Object.entries(models).map(async ([modelName, model]) => {
      const result = await this.render(model, inputModel);
      return OutputModel.toOutputModel({ result, model, modelName, inputModel });
    })
    return Promise.all(renders);
  }

  protected async renderModel(
    renderer: AbstractRenderer, 
    presetType: string, 
    model: CommonModel,
    inputModel: CommonInputModel,
  ): Promise<string> {
    let content: string = "";

    const defaultPreset = this.options.defaultPreset;
    if (defaultPreset === undefined) {
      throw ".defaultPreset must be defined!";
    }
    content = defaultPreset[presetType].self({ renderer, model, inputModel, content });

    let presets = this.options.presets || [];
    presets = presets.map(p => p[presetType]).filter(Boolean);
    for (const preset of presets) {
      content = await preset.self({ renderer, model, inputModel, content });
    }

    return content;
  }

  private mergeOptions(defaultOptions: Options = {} as any, passedOptions: Options = {} as any): Options {
    const renders = { 
      ...(defaultOptions.renderers || {}),
      ...(passedOptions.renderers || {})
    };
    return {
      ...defaultGeneratorOptions,
      ...defaultOptions,
      ...passedOptions,
      renders,
    };
  }
}
