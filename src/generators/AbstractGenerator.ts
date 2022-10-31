import { InputMetaModel, OutputModel, Preset, Presets, RenderOutput, ProcessorOptions, MetaModel, ConstrainedMetaModel } from '../models';
import { InputProcessor } from '../processors';
import { IndentationTypes } from '../helpers';
import { isPresetWithOptions } from '../utils';
import { AbstractDependencyManager } from './AbstractDependencyManager';

export interface CommonGeneratorOptions<P extends Preset = Preset, DependencyManager extends AbstractDependencyManager = AbstractDependencyManager> {
  indentation?: {
    type: IndentationTypes;
    size: number;
  };
  defaultPreset?: P;
  presets?: Presets<P>;
  processorOptions?: ProcessorOptions;
  dependencyManagerFactory?: () => DependencyManager;
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
  Options extends CommonGeneratorOptions, 
  RenderCompleteModelOptions> {
  constructor(
    public readonly languageName: string,
    public readonly options: Options
  ) { }

  public abstract render(model: MetaModel, inputModel: InputMetaModel, dependencyManager?: AbstractDependencyManager): Promise<RenderOutput>;
  public abstract renderCompleteModel(model: MetaModel, inputModel: InputMetaModel, options: Partial<RenderCompleteModelOptions>, dependencyManager?: AbstractDependencyManager): Promise<RenderOutput>;
  public abstract constrainToMetaModel(model: MetaModel, dependencyManager: AbstractDependencyManager): ConstrainedMetaModel;
  public abstract splitMetaModel(model: MetaModel): MetaModel[];

  public process(input: Record<string, unknown>): Promise<InputMetaModel> {
    return InputProcessor.processor.process(input, this.options.processorOptions);
  }

  /**
   * Generates the full output of a model, instead of a scattered model.
   * 
   * OutputModels result is no longer the model itself, but including package, package dependencies and model dependencies.
   * 
   */
  public async generateCompleteModels(input: any | InputMetaModel, options: Partial<RenderCompleteModelOptions>): Promise<OutputModel[]> {
    const inputModel = await this.processInput(input);
    const dependencyManager = this.options.dependencyManagerFactory!();
    const renders = Object.values(inputModel.models).map(async (model) => {
      const constrainedModel = this.constrainToMetaModel(model, dependencyManager);
      const renderedOutput = await this.renderCompleteModel(constrainedModel, inputModel, options, dependencyManager);
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
   */
  public async generate(input: any | InputMetaModel): Promise<OutputModel[]> {
    const inputModel = await this.processInput(input);
    const dependencyManager = this.options.dependencyManagerFactory!();
    const renders = Object.values(inputModel.models).map(async (model) => {
      const constrainedModel = this.constrainToMetaModel(model, dependencyManager);
      const renderedOutput = await this.render(constrainedModel, inputModel, dependencyManager);
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

  /**
   * Get all presets (default and custom ones from options) for a given preset type (class, enum, etc).  
   */
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
