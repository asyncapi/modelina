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
export abstract class AbstractGenerator<Options extends CommonGeneratorOptions = CommonGeneratorOptions, RenderCompleteModelOptions = any> {
  protected options: Options;
  
  constructor(
    public readonly languageName: string,
    defaultOptions?: Options,
    passedOptions?: Options,
  ) {
    this.options = this.mergeOptions(defaultOptions, passedOptions);
  }

  public abstract render(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput>;
  public abstract renderCompleteModel(model: CommonModel, inputModel: CommonInputModel, options: RenderCompleteModelOptions): Promise<RenderOutput>;

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
  public async generateCompleteModels(input: Record<string, unknown> | CommonInputModel, options: RenderCompleteModelOptions): Promise<OutputModel[]> {
    const inputModel = await this.processInput(input);
    const renders = Object.values(inputModel.models).map(async (model) => {
      const renderedOutput = await this.renderCompleteModel(model, inputModel, options);
      return OutputModel.toOutputModel({ 
        result: renderedOutput.result,
        modelName: renderedOutput.renderedName, 
        dependencies: renderedOutput.dependencies,
        model, 
        inputModel
      });
    });
    return Promise.all(renders);
  }

  /**
   * Generates a scattered model where dependencies and rendered results are separated. 
   * 
   * @param input 
   */
  public async generate(input: Record<string, unknown> | CommonInputModel): Promise<OutputModel[]> {
    const inputModel = await this.processInput(input);
    const renders = Object.values(inputModel.models).map(async (model) => {
      const renderedOutput = await this.render(model, inputModel);
      return OutputModel.toOutputModel({ 
        result: renderedOutput.result,
        modelName: renderedOutput.renderedName, 
        dependencies: renderedOutput.dependencies,
        model, 
        inputModel
      });
    });
    return Promise.all(renders);
  }

  /**
   * Process any of the input formats to the appropriate CommonInputModel type.
   * 
   * @param input 
   */
  private processInput(input: Record<string, unknown> | CommonInputModel): Promise<CommonInputModel> {
    if (input instanceof CommonInputModel) {
      return Promise.resolve(input);
    }
    return this.process(input);
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
