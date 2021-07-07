import { CommonInputModel, CommonModel, OutputModel, Preset, Presets } from '../models';
import { InputProcessor } from '../processors';
import { IndentationTypes } from '../helpers';
import { isPresetWithOptions } from '../utils';
import { RenderOutput } from '../models/RenderOutput';

export interface CommonGeneratorOptions<P extends Preset = Preset> {
  indentation?: {
    type: IndentationTypes;
    size: number;
  };
  defaultPreset?: P;
  presets?: Presets<P>;
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
export abstract class AbstractGenerator<Options extends CommonGeneratorOptions = CommonGeneratorOptions> {
  protected options: Options;
  
  constructor(
    public readonly languageName: string,
    defaultOptions?: Options,
    passedOptions?: Options,
  ) {
    this.options = this.mergeOptions(defaultOptions, passedOptions);
  }

  public abstract render(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput>;

  public async process(input: Record<string, unknown>): Promise<CommonInputModel> {
    return await InputProcessor.processor.process(input);
  }

  public async generate(input: Record<string, unknown> | CommonInputModel): Promise<OutputModel[]> {
    if (input instanceof CommonInputModel) {
      return this.generateModels(input);
    }
    const model = await this.process(input);
    return this.generateModels(model);
  }

  protected generateModels(inputModel: CommonInputModel): Promise<OutputModel[]> {
    const models = inputModel.models;
    const renders = Object.entries(models).map(async ([modelName, model]) => {
      const renderedOutput = await this.render(model, inputModel);
      return OutputModel.toOutputModel({ result: renderedOutput.result, model, modelName, inputModel, dependencies: renderedOutput.dependencies});
    });
    return Promise.all(renders);
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
