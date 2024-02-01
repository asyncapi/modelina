import {
  AbstractGenerator,
  AbstractGeneratorRenderArgs,
  AbstractGeneratorRenderCompleteModelArgs,
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import {
  RenderOutput,
  ConstrainedMetaModel,
  MetaModel,
  ConstrainedObjectModel,
  ConstrainedEnumModel,
  InputMetaModel
} from '../../models';
import {
  ConstantConstraint,
  constrainMetaModel,
  Constraints,
  EnumKeyConstraint,
  EnumValueConstraint,
  ModelNameConstraint,
  PropertyKeyConstraint,
  split,
  SplitOptions,
  TypeMapping
} from '../../helpers';
import { DartPreset, DART_DEFAULT_PRESET } from './DartPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { isReservedDartKeyword } from './Constants';
import { Logger } from '../../';
import {
  DartDefaultConstraints,
  DartDefaultTypeMapping
} from './DartConstrainer';
import { DeepPartial, mergePartialAndDefault } from '../../utils/Partials';
import { DartDependencyManager } from './DartDependencyManager';
export interface DartOptions extends CommonGeneratorOptions<DartPreset> {
  collectionType?: 'List';
  typeMapping: TypeMapping<DartOptions, DartDependencyManager>;
  constraints: Constraints<DartOptions>;
}
export type DartConstantConstraint = ConstantConstraint<DartOptions>;
export type DartEnumKeyConstraint = EnumKeyConstraint<DartOptions>;
export type DartEnumValueConstraint = EnumValueConstraint<DartOptions>;
export type DartModelNameConstraint = ModelNameConstraint<DartOptions>;
export type DartPropertyKeyConstraint = PropertyKeyConstraint<DartOptions>;
export type DartTypeMapping = TypeMapping<DartOptions, DartDependencyManager>;

export interface DartRenderCompleteModelOptions {
  packageName: string;
}

export class DartGenerator extends AbstractGenerator<
  DartOptions,
  DartRenderCompleteModelOptions
> {
  static defaultOptions: DartOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: DART_DEFAULT_PRESET,
    collectionType: 'List',
    typeMapping: DartDefaultTypeMapping,
    constraints: DartDefaultConstraints
  };

  static defaultCompleteModelOptions: DartRenderCompleteModelOptions = {
    packageName: 'AsyncapiModels'
  };

  constructor(options?: DeepPartial<DartOptions>) {
    const realizedOptions = DartGenerator.getDartOptions(options);
    super('Dart', realizedOptions);
  }

  /**
   * Returns the Dart options by merging custom options with default ones.
   */
  static getDartOptions(options?: DeepPartial<DartOptions>): DartOptions {
    const optionsToUse = mergePartialAndDefault(
      DartGenerator.defaultOptions,
      options
    ) as DartOptions;
    //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
    if (options?.dependencyManager === undefined) {
      optionsToUse.dependencyManager = () => {
        return new DartDependencyManager(optionsToUse);
      };
    }
    return optionsToUse;
  }

  /**
   * Wrapper to get an instance of the dependency manager
   */
  getDependencyManager(options: DartOptions): DartDependencyManager {
    return this.getDependencyManagerInstance(options) as DartDependencyManager;
  }

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
    options: DeepPartial<DartOptions>
  ): ConstrainedMetaModel {
    const optionsToUse = DartGenerator.getDartOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    return constrainMetaModel<DartOptions, DartDependencyManager>(
      this.options.typeMapping,
      this.options.constraints,
      {
        metaModel: model,
        dependencyManager: dependencyManagerToUse,
        options: this.options,
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
    args: AbstractGeneratorRenderArgs<DartOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = DartGenerator.getDartOptions({
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
      `Dart generator, cannot generate this type of model, ${args.constrainedModel.name}`
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
   * For Dart you need to specify which package the model is placed under.
   *
   * @param model
   * @param inputModel
   * @param options used to render the full output
   */
  async renderCompleteModel(
    args: AbstractGeneratorRenderCompleteModelArgs<
      DartOptions,
      DartRenderCompleteModelOptions
    >
  ): Promise<RenderOutput> {
    const completeModelOptionsToUse = mergePartialAndDefault(
      DartGenerator.defaultCompleteModelOptions,
      args.completeOptions
    ) as DartRenderCompleteModelOptions;
    const optionsToUse = DartGenerator.getDartOptions({
      ...this.options,
      ...args.options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    if (isReservedDartKeyword(completeModelOptionsToUse.packageName)) {
      throw new Error(
        `You cannot use reserved Dart keyword (${completeModelOptionsToUse.packageName}) as package name, please use another.`
      );
    }

    const outputModel = await this.render({ ...args, options: optionsToUse });
    const modelDependencies = dependencyManagerToUse.renderAllModelDependencies(
      args.constrainedModel,
      completeModelOptionsToUse.packageName
    );
    const outputContent = `${modelDependencies}
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
    options?: DeepPartial<DartOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = DartGenerator.getDartOptions({
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
    options?: DeepPartial<DartOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = DartGenerator.getDartOptions({
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
