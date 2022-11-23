import { InputMetaModel, OutputModel, Preset, RenderOutput, MetaModel, ConstrainedMetaModel } from '../models';
import { InputProcessor } from '../processors';
import { DeepPartial, isPresetWithOptions } from '../utils';
import { CommonOptions } from './CommonGeneratorOptions';

/**
 * Abstract generator which must be implemented by each language
 */
export abstract class AbstractGenerator<
  Options extends CommonOptions = CommonOptions, 
  RenderCompleteModelOptions = any> {

  constructor(
    public readonly languageName: string,
    public readonly options: Options
  ) { }

  public abstract render(model: MetaModel, inputModel: InputMetaModel): Promise<RenderOutput>;
  public abstract renderCompleteModel(model: MetaModel, inputModel: InputMetaModel, options?: DeepPartial<RenderCompleteModelOptions>): Promise<RenderOutput>;
  public abstract constrainToMetaModel(model: MetaModel): ConstrainedMetaModel;
  public abstract splitMetaModel(model: MetaModel): MetaModel[];

  public process(input: Record<string, unknown>): Promise<InputMetaModel> {
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
  public async generateCompleteModels(input: any | InputMetaModel, options?: DeepPartial<RenderCompleteModelOptions>): Promise<OutputModel[]> {
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
  public async generate(input: any | InputMetaModel): Promise<OutputModel[]> {
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
  protected async processInput(input: any | InputMetaModel): Promise<InputMetaModel> {
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
      filteredPresets.push([defaultPreset[String(presetType)], this.options]);
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
}
