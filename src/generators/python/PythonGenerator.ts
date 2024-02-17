/* eslint-disable no-console */
import {
  AbstractGenerator,
  AbstractGeneratorRenderArgs,
  AbstractGeneratorRenderCompleteModelArgs,
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import {
  ConstrainedEnumModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  InputMetaModel,
  MetaModel,
  RenderOutput
} from '../../models';
import { split, SplitOptions, TypeMapping } from '../../helpers';
import { PythonPreset, PYTHON_DEFAULT_PRESET } from './PythonPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { Logger } from '../..';
import {
  ConstantConstraint,
  constrainMetaModel,
  Constraints,
  EnumKeyConstraint,
  EnumValueConstraint,
  ModelNameConstraint,
  PropertyKeyConstraint
} from '../../helpers/ConstrainHelpers';
import {
  PythonDefaultConstraints,
  PythonDefaultTypeMapping
} from './PythonConstrainer';
import { DeepPartial, mergePartialAndDefault } from '../../utils/Partials';
import { PythonDependencyManager } from './PythonDependencyManager';

export interface PythonOptions extends CommonGeneratorOptions<PythonPreset> {
  typeMapping: TypeMapping<PythonOptions, PythonDependencyManager>;
  constraints: Constraints<PythonOptions>;
  importsStyle: 'explicit' | 'implicit';
  dependencyManager?: (() => PythonDependencyManager) | PythonDependencyManager;
}
export type PythonConstantConstraint = ConstantConstraint<PythonOptions>;
export type PythonEnumKeyConstraint = EnumKeyConstraint<PythonOptions>;
export type PythonEnumValueConstraint = EnumValueConstraint<PythonOptions>;
export type PythonModelNameConstraint = ModelNameConstraint<PythonOptions>;
export type PythonPropertyKeyConstraint = PropertyKeyConstraint<PythonOptions>;
export type PythonTypeMapping = TypeMapping<
  PythonOptions,
  PythonDependencyManager
>;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PythonRenderCompleteModelOptions {}

export class PythonGenerator extends AbstractGenerator<
  PythonOptions,
  PythonRenderCompleteModelOptions
> {
  static defaultOptions: PythonOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: PYTHON_DEFAULT_PRESET,
    typeMapping: PythonDefaultTypeMapping,
    constraints: PythonDefaultConstraints,
    importsStyle: 'implicit',
    // Temporarily set
    dependencyManager: () => {
      return {} as PythonDependencyManager;
    }
  };

  static defaultCompleteModelOptions: PythonRenderCompleteModelOptions = {};

  constructor(options?: DeepPartial<PythonOptions>) {
    const realizedOptions = PythonGenerator.getPythonOptions(options);
    super('Python', realizedOptions);
  }

  /**
   * Returns the Python options by merging custom options with default ones.
   */
  static getPythonOptions(options?: DeepPartial<PythonOptions>): PythonOptions {
    const optionsToUse = mergePartialAndDefault(
      PythonGenerator.defaultOptions,
      options
    ) as PythonOptions;
    //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
    if (options?.dependencyManager === undefined) {
      optionsToUse.dependencyManager = () => {
        return new PythonDependencyManager(optionsToUse);
      };
    }
    return optionsToUse;
  }

  /**
   * Wrapper to get an instance of the dependency manager
   */
  getDependencyManager(options: PythonOptions): PythonDependencyManager {
    return this.getDependencyManagerInstance(
      options
    ) as PythonDependencyManager;
  }

  /**
   * This function makes sure we split up the MetaModels accordingly to what we want to render as models.
   */
  splitMetaModel(model: MetaModel): MetaModel[] {
    //These are the models that we have separate renderers for
    const metaModelsToSplit: SplitOptions = {
      splitEnum: true,
      splitObject: true
    };
    return split(model, metaModelsToSplit);
  }

  constrainToMetaModel(
    model: MetaModel,
    options: DeepPartial<PythonOptions>
  ): ConstrainedMetaModel {
    const optionsToUse = PythonGenerator.getPythonOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    return constrainMetaModel<PythonOptions, PythonDependencyManager>(
      this.options.typeMapping,
      this.options.constraints,
      {
        metaModel: model,
        dependencyManager: dependencyManagerToUse,
        options: { ...this.options },
        constrainedName: '' //This is just a placeholder, it will be constrained within the function
      }
    );
  }

  /**
   * Render a scattered model, where the source code and library and model dependencies are separated.
   *
   * @param model
   * @param inputModel
   */
  render(
    args: AbstractGeneratorRenderArgs<PythonOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = PythonGenerator.getPythonOptions({
      ...this.options,
      ...args.options
    });
    if (args.constrainedModel instanceof ConstrainedObjectModel) {
      return this.renderClass(
        args.constrainedModel,
        args.inputModel,
        optionsToUse
      );
    } else if (args.constrainedModel instanceof ConstrainedEnumModel) {
      return this.renderEnum(
        args.constrainedModel,
        args.inputModel,
        optionsToUse
      );
    }
    Logger.warn(
      `Python generator, cannot generate this type of model, ${args.constrainedModel.name}`
    );
    return Promise.resolve(
      RenderOutput.toRenderOutput({
        result: '',
        renderedName: '',
        dependencies: []
      })
    );
  }

  /**
   * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
   *
   * For Python you need to specify which package the model is placed under.
   *
   * @param model
   * @param inputModel
   * @param options used to render the full output
   */
  async renderCompleteModel(
    args: AbstractGeneratorRenderCompleteModelArgs<
      PythonOptions,
      PythonRenderCompleteModelOptions
    >
  ): Promise<RenderOutput> {
    //const completeModelOptionsToUse = mergePartialAndDefault(PythonGenerator.defaultCompleteModelOptions, completeModelOptions) as PythonRenderCompleteModelOptions;
    const optionsToUse = PythonGenerator.getPythonOptions({
      ...this.options,
      ...args.options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    const outputModel = await this.render({
      ...args,
      options: {
        ...optionsToUse,
        dependencyManager: dependencyManagerToUse
      }
    });
    const modelDependencies = args.constrainedModel
      .getNearestDependencies()
      .map((model) => {
        return dependencyManagerToUse.renderDependency(model);
      });
    const outputContent = `${modelDependencies.join('\n')}
${outputModel.dependencies.join('\n')}
${outputModel.result}`;
    return RenderOutput.toRenderOutput({
      result: outputContent,
      renderedName: outputModel.renderedName,
      dependencies: outputModel.dependencies
    });
  }

  async renderClass(
    model: ConstrainedObjectModel,
    inputModel: InputMetaModel,
    options?: DeepPartial<PythonOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = PythonGenerator.getPythonOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    const presets = this.getPresets('class');
    const renderer = new ClassRenderer(
      optionsToUse,
      this,
      presets,
      model,
      inputModel,
      dependencyManagerToUse
    );
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({
      result,
      renderedName: model.name,
      dependencies: dependencyManagerToUse.dependencies
    });
  }

  async renderEnum(
    model: ConstrainedEnumModel,
    inputModel: InputMetaModel,
    options?: DeepPartial<PythonOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = PythonGenerator.getPythonOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    const presets = this.getPresets('enum');
    const renderer = new EnumRenderer(
      optionsToUse,
      this,
      presets,
      model,
      inputModel,
      dependencyManagerToUse
    );
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({
      result,
      renderedName: model.name,
      dependencies: dependencyManagerToUse.dependencies
    });
  }
}
