import {
  InputMetaModel,
  OutputModel,
  Preset,
  Presets,
  RenderOutput,
  ProcessorOptions,
  MetaModel,
  ConstrainedMetaModel,
  UnionModel,
  ConstrainedUnionModel
} from '../models';
import { InputProcessor } from '../processors';
import { IndentationTypes } from '../helpers';
import { DeepPartial, isPresetWithOptions } from '../utils';
import { AbstractDependencyManager } from './AbstractDependencyManager';

export interface CommonGeneratorOptions<
  P extends Preset = Preset,
  DependencyManager extends
    AbstractDependencyManager = AbstractDependencyManager
> {
  indentation?: {
    type: IndentationTypes;
    size: number;
  };
  defaultPreset?: P;
  presets?: Presets<P>;
  processorOptions?: ProcessorOptions;
  /**
   * This dependency manager type serves two functions.
   * 1. It can be used to provide a factory for generate functions
   * 2. It can be used to provide a single instance of a dependency manager, to add all dependencies together
   *
   * This depends on context and where it's used.
   */
  dependencyManager?: (() => DependencyManager) | DependencyManager;
}

export const defaultGeneratorOptions: CommonGeneratorOptions = {
  indentation: {
    type: IndentationTypes.SPACES,
    size: 2
  }
};

export interface AbstractGeneratorRenderArgs<
  Options extends CommonGeneratorOptions,
  ConstrainedModel = ConstrainedMetaModel
> {
  constrainedModel: ConstrainedModel;
  inputModel: InputMetaModel;
  options?: DeepPartial<Options>;
}

export interface AbstractGeneratorRenderCompleteModelArgs<
  Options extends CommonGeneratorOptions,
  RenderCompleteModelOptions
> {
  constrainedModel: ConstrainedMetaModel;
  inputModel: InputMetaModel;
  completeOptions: Partial<RenderCompleteModelOptions>;
  options?: DeepPartial<Options>;
}

interface ConstrainedMetaModelWithDepManager {
  constrainedModel: ConstrainedMetaModel;
  dependencyManager: AbstractDependencyManager;
}

/**
 * Abstract generator which must be implemented by each language
 */
export abstract class AbstractGenerator<
  Options extends CommonGeneratorOptions,
  RenderCompleteModelOptions
> {
  constructor(
    public readonly languageName: string,
    public readonly options: Options
  ) {}

  public abstract render(
    args: AbstractGeneratorRenderArgs<Options>
  ): Promise<RenderOutput>;
  public abstract renderCompleteModel(
    args: AbstractGeneratorRenderCompleteModelArgs<
      Options,
      RenderCompleteModelOptions
    >
  ): Promise<RenderOutput>;
  public abstract constrainToMetaModel(
    model: MetaModel,
    options: DeepPartial<Options>
  ): ConstrainedMetaModel;
  public abstract getDependencyManager(
    options: Options
  ): AbstractDependencyManager;
  public abstract splitMetaModel(model: MetaModel): MetaModel[];

  public process(input: Record<string, unknown>): Promise<InputMetaModel> {
    return InputProcessor.processor.process(
      input,
      this.options.processorOptions
    );
  }

  /**
   * This function returns an instance of the dependency manager which is either a factory or an instance.
   */
  protected getDependencyManagerInstance(
    options: Options
  ): AbstractDependencyManager {
    if (options.dependencyManager === undefined) {
      throw new Error(
        'Internal error, could not find dependency manager instance'
      );
    }
    if (typeof options.dependencyManager === 'function') {
      return options.dependencyManager();
    }
    return options.dependencyManager;
  }

  private setImplementedByForModels(
    constrainedModels: ConstrainedMetaModelWithDepManager[],
    constrainedModel: ConstrainedMetaModel
  ) {
    if (!constrainedModel.options.extend) {
      return;
    }

    for (const extend of constrainedModel.options.extend) {
      const extendModel = constrainedModels.find(
        (m) => m.constrainedModel.name === extend.name
      );

      if (!extendModel) {
        throw new Error(
          `Could not find the model ${extend.name} to extend in the constrained models`
        );
      }

      if (!extendModel.constrainedModel.options.implementedBy) {
        extendModel.constrainedModel.options.implementedBy = [];
      }

      extendModel.constrainedModel.options.implementedBy.push(constrainedModel);
    }
  }

  private setParentsForModels(
    unionConstrainedModelsWithDepManager: ConstrainedMetaModelWithDepManager[],
    constrainedModel: ConstrainedMetaModel
  ) {
    for (const unionConstrainedModel of unionConstrainedModelsWithDepManager) {
      if (
        unionConstrainedModel.constrainedModel instanceof
          ConstrainedUnionModel &&
        unionConstrainedModel.constrainedModel.union.some(
          (m) =>
            m.name === constrainedModel.name && m.type === constrainedModel.type
        )
      ) {
        if (!constrainedModel.options.parents) {
          constrainedModel.options.parents = [];
        }

        constrainedModel.options.parents.push(
          unionConstrainedModel.constrainedModel
        );
      }
    }
  }

  /**
   * Generates an array of ConstrainedMetaModel with its dependency manager from an InputMetaModel.
   * It also adds parents to the ConstrainedMetaModel's which can be used in renderers which needs to know what parents they belong to.
   */
  private getConstrainedModels(inputModel: InputMetaModel): Array<{
    constrainedModel: ConstrainedMetaModel;
    dependencyManager: AbstractDependencyManager;
  }> {
    const getConstrainedMetaModelWithDepManager = (
      model: MetaModel
    ): ConstrainedMetaModelWithDepManager => {
      const dependencyManager = this.getDependencyManager(this.options);
      const constrainedModel = this.constrainToMetaModel(model, {
        dependencyManager
      } as DeepPartial<Options>);
      return {
        constrainedModel,
        dependencyManager
      };
    };

    const unionConstrainedModelsWithDepManager: ConstrainedMetaModelWithDepManager[] =
      [];
    const constrainedModelsWithDepManager: ConstrainedMetaModelWithDepManager[] =
      [];

    for (const model of Object.values(inputModel.models)) {
      if (model instanceof UnionModel) {
        unionConstrainedModelsWithDepManager.push(
          getConstrainedMetaModelWithDepManager(model)
        );
        continue;
      }

      constrainedModelsWithDepManager.push(
        getConstrainedMetaModelWithDepManager(model)
      );
    }

    const constrainedModels = [
      ...unionConstrainedModelsWithDepManager,
      ...constrainedModelsWithDepManager
    ];

    for (const { constrainedModel } of constrainedModels) {
      this.setImplementedByForModels(constrainedModels, constrainedModel);
      this.setParentsForModels(
        unionConstrainedModelsWithDepManager,
        constrainedModel
      );
    }

    return constrainedModels;
  }

  /**
   * Generates the full output of a model, instead of a scattered model.
   *
   * OutputModels result is no longer the model itself, but including package, package dependencies and model dependencies.
   *
   */
  public async generateCompleteModels(
    input: any | InputMetaModel,
    completeOptions: Partial<RenderCompleteModelOptions>
  ): Promise<OutputModel[]> {
    const inputModel = await this.processInput(input);

    return Promise.all(
      this.getConstrainedModels(inputModel).map(
        async ({ constrainedModel, dependencyManager }) => {
          const renderedOutput = await this.renderCompleteModel({
            constrainedModel,
            inputModel,
            completeOptions,
            options: { dependencyManager } as DeepPartial<Options>
          });
          return OutputModel.toOutputModel({
            result: renderedOutput.result,
            modelName: renderedOutput.renderedName,
            dependencies: renderedOutput.dependencies,
            model: constrainedModel,
            inputModel
          });
        }
      )
    );
  }

  /**
   * Generates a scattered model where dependencies and rendered results are separated.
   */
  public async generate(input: any | InputMetaModel): Promise<OutputModel[]> {
    const inputModel = await this.processInput(input);

    return Promise.all(
      this.getConstrainedModels(inputModel).map(
        async ({ constrainedModel, dependencyManager }) => {
          const renderedOutput = await this.render({
            constrainedModel,
            inputModel,
            options: {
              dependencyManager
            } as DeepPartial<Options>
          });
          return OutputModel.toOutputModel({
            result: renderedOutput.result,
            modelName: renderedOutput.renderedName,
            dependencies: renderedOutput.dependencies,
            model: constrainedModel,
            inputModel
          });
        }
      )
    );
  }

  /**
   * Process any of the input formats to the appropriate InputMetaModel type and split out the meta models
   * based on the requirements of the generators
   *
   * @param input
   */
  protected async processInput(
    input: any | InputMetaModel
  ): Promise<InputMetaModel> {
    const rawInputModel =
      input instanceof InputMetaModel ? input : await this.process(input);

    //Split out the models based on the language specific requirements of which models is rendered separately
    const splitOutModels: { [key: string]: MetaModel } = {};
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
