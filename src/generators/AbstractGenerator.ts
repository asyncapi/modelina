import { CommonInputModel, CommonModel, OutputModel, Preset, Presets, RenderOutput, ProcessorOptions } from '../models';
import { InputProcessor } from '../processors';
import { IndentationTypes } from '../helpers';
import { isPresetWithOptions } from '../utils';
export interface CommonGeneratorOptions<P extends Preset = Preset> {
  indentation?: {
    type: IndentationTypes;
    size: number;
  };
  defaultPreset?: P;
  presets?: Presets<P>;
  processorOptions?: ProcessorOptions
}

export const defaultGeneratorOptions: CommonGeneratorOptions = {
  indentation: {
    type: IndentationTypes.SPACES,
    size: 2,
  }
};

/**
 * Abstract generator which must be implemented by each language
 */
export abstract class AbstractGenerator<RenderFullOptions, Options extends CommonGeneratorOptions = CommonGeneratorOptions> {
  protected options: Options;
  
  constructor(
    public readonly languageName: string,
    defaultOptions?: Options,
    passedOptions?: Options,
  ) {
    this.options = this.mergeOptions(defaultOptions, passedOptions);
  }

  public abstract render(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput>;
  public abstract renderFull(model: CommonModel, inputModel: CommonInputModel, options: RenderFullOptions): Promise<RenderOutput>;
  public abstract generateFile(input: Record<string, unknown> | CommonInputModel, outputDirectory: string, options: RenderFullOptions): Promise<OutputModel[]>;

  public process(input: Record<string, unknown>): Promise<CommonInputModel> {
    return InputProcessor.processor.process(input, this.options.processorOptions);
  }

  /**
   * Generates the full output of a model, instead of a scattered model.
   * 
   * OutputModels result is no longer the model itself, but including package, package dependencies and model dependencies.
   * 
   * @param input 
   * @param options to use for rendering full output
   */
  public async generateFull(input: Record<string, unknown> | CommonInputModel, options: RenderFullOptions): Promise<OutputModel[]> {
    const inputModel = await this.processInput(input);
    const renders = Object.entries(inputModel.models).map(async ([modelName, model]) => {
      const renderedOutput = await this.renderFull(model, inputModel, options);
      return OutputModel.toOutputModel({ result: renderedOutput.result, model, modelName, inputModel, dependencies: renderedOutput.dependencies});
    });
    return Promise.all(renders);
  }

  /**
   * Generates a scattered model where dependencies and rendered results are separated. 
   * 
   * @param input 
   * @returns 
   */
  public async generate(input: Record<string, unknown> | CommonInputModel): Promise<OutputModel[]> {
    const inputModel = await this.processInput(input);
    const renders = Object.entries(inputModel.models).map(async ([modelName, model]) => {
      const renderedOutput = await this.render(model, inputModel);
      return OutputModel.toOutputModel({ result: renderedOutput.result, model, modelName, inputModel, dependencies: renderedOutput.dependencies});
    });
    return Promise.all(renders);
  }

  /**
   * Process any of the input formats to the appropriate CommonInputModel type.
   * 
   * @param input 
   * @returns 
   */
  private async processInput(input: Record<string, unknown> | CommonInputModel): Promise<CommonInputModel> {
    let inputModel: CommonInputModel;
    if (input instanceof CommonInputModel) {
      inputModel = input;
    } else {
      inputModel = await this.process(input);
    }
    return inputModel;
  }

  protected getPresets(presetType: string): Array<[Preset, unknown]> {
    const filteredPresets: Array<[Preset, unknown]> = [];

    const defaultPreset = this.options.defaultPreset;
    if (defaultPreset !== undefined) {
      filteredPresets.push([defaultPreset[String(presetType)], undefined]);
    }

    const presets = this.options.presets || [];
    for (const p of presets) {
      if (isPresetWithOptions(p)) {
        const preset = p.preset[String(presetType)];
        if (preset) {
          filteredPresets.push([preset, p.options]);
        }
      } else {
        const preset = p[String(presetType)];
        if (preset) {
          filteredPresets.push([preset, undefined]);
        }
      }
    }

    return filteredPresets;
  }

  protected mergeOptions(defaultOptions: Options = {} as any, passedOptions: Options = {} as any): Options {
    return {
      ...defaultGeneratorOptions,
      ...defaultOptions,
      ...passedOptions
    };
  }
}
