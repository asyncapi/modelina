import { InputMetaModel, OutputModel, Preset, Presets, RenderOutput, ProcessorOptions, MetaModel, ConstrainedMetaModel } from '../models';
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
export abstract class AbstractGenerator<
  Options extends CommonGeneratorOptions = CommonGeneratorOptions, 
  RenderCompleteModelOptions = any> {
  constructor(
    public readonly languageName: string,
    public readonly options: Options
  ) { }

  public abstract render(model: MetaModel, inputModel: InputMetaModel): Promise<RenderOutput>;
  public abstract renderCompleteModel(model: MetaModel, inputModel: InputMetaModel, options: RenderCompleteModelOptions): Promise<RenderOutput>;
  public abstract constrainToMetaModel(model: MetaModel): ConstrainedMetaModel;
  public abstract splitMetaModel(model: MetaModel): MetaModel[];

  public async process(input: Record<string, unknown>): Promise<InputMetaModel> {
    return await InputProcessor.processor.process(input, this.options.processorOptions);
  }

  /**
   * Generates the full output of a model, instead of a scattered model.
   * 
   * OutputModels result is no longer the model itself, but including package, package dependencies and model dependencies.
   * 
   * @param input 
   * @param options to use for rendering full output
   */
  public async generateCompleteModels(input: Record<string, unknown> | InputMetaModel, options: RenderCompleteModelOptions): Promise<OutputModel[]> {
    const inputModel = await this.processInput(input);
    const renders = Object.values(inputModel.models).map(async (model) => {
      const constrainedModel = this.constrainToMetaModel(model);
      const renderedOutput = await this.renderCompleteModel(constrainedModel, inputModel, options);
      return OutputModel.toOutputModel({ 
        result: renderedOutput.result,
        modelName: renderedOutput.renderedName, 
        dependencies: renderedOutput.dependencies,
        model: constrainedModel, 
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
  public async generate(input: Record<string, unknown> | InputMetaModel): Promise<OutputModel[]> {
    const inputModel = await this.processInput(input);
    const renders = Object.values(inputModel.models).map(async (model) => {
      const constrainedModel = this.constrainToMetaModel(model);
      const renderedOutput = await this.render(constrainedModel, inputModel);
      return OutputModel.toOutputModel({ 
        result: renderedOutput.result,
        modelName: renderedOutput.renderedName, 
        dependencies: renderedOutput.dependencies,
        model: constrainedModel, 
        inputModel
      });
    });
    return Promise.all(renders);
  }

  /**
   * Process any of the input formats to the appropriate InputMetaModel type and split out the meta models
   * based on the requirements of the generators
   * 
   * @param input 
   */
  private async processInput(input: Record<string, unknown> | InputMetaModel): Promise<InputMetaModel> {
    const rawInputModel = input instanceof InputMetaModel ? input : await this.process(input);

    //Split out the models based on the language specific requirements of which models is rendered separately
    const splitOutModels: {[key: string]: MetaModel} = {};
    for (const model of Object.values(rawInputModel.models)) {
      const splitModels = this.splitMetaModel(model);
      for (const splitModel of splitModels) {
        splitOutModels[splitModel.name] = splitModel;
      }
    }
    rawInputModel.models = splitOutModels;
    return rawInputModel;
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
