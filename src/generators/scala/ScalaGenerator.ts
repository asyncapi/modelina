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
import { split, TypeMapping } from '../../helpers';
import { ScalaPreset, SCALA_DEFAULT_PRESET } from './ScalaPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { isReservedScalaKeyword } from './Constants';
import { Logger } from '../..';
import {
  constrainMetaModel,
  Constraints
} from '../../helpers/ConstrainHelpers';
import {
  ScalaDefaultConstraints,
  ScalaDefaultTypeMapping
} from './ScalaConstrainer';
import { DeepPartial, mergePartialAndDefault } from '../../utils/Partials';
import { ScalaDependencyManager } from './ScalaDependencyManager';

export interface ScalaOptions
  extends CommonGeneratorOptions<ScalaPreset> {
  typeMapping: TypeMapping<ScalaOptions, ScalaDependencyManager>;
  constraints: Constraints;
}
export interface ScalaRenderCompleteModelOptions {
  packageName: string;
}
export class ScalaGenerator extends AbstractGenerator<
  ScalaOptions,
  ScalaRenderCompleteModelOptions
> {
  static defaultOptions: ScalaOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: SCALA_DEFAULT_PRESET,
    typeMapping: ScalaDefaultTypeMapping,
    constraints: ScalaDefaultConstraints
  };

  static defaultCompleteModelOptions: ScalaRenderCompleteModelOptions = {
    packageName: 'Asyncapi.Models'
  };

  constructor(options?: DeepPartial<ScalaOptions>) {
    const realizedOptions = ScalaGenerator.getScalaOptions(options);
    super('Scala', realizedOptions);
  }

  /**
   * Returns the Scala options by merging custom options with default ones.
   */
  static getScalaOptions(
    options?: DeepPartial<ScalaOptions>
  ): ScalaOptions {
    const optionsToUse = mergePartialAndDefault(
      ScalaGenerator.defaultOptions,
      options
    ) as ScalaOptions;
    //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
    if (options?.dependencyManager === undefined) {
      optionsToUse.dependencyManager = () => {
        return new ScalaDependencyManager(optionsToUse);
      };
    }
    return optionsToUse;
  }

  /**
   * Wrapper to get an instance of the dependency manager
   */
  getDependencyManager(options: ScalaOptions): ScalaDependencyManager {
    return this.getDependencyManagerInstance(
      options
    ) as ScalaDependencyManager;
  }

  /**
   * This function makes sure we split up the MetaModels accordingly to what we want to render as models.
   */
  splitMetaModel(model: MetaModel): MetaModel[] {
    //These are the models that we have separate renderers for
    const metaModelsToSplit = {
      splitEnum: true,
      splitObject: true
    };
    return split(model, metaModelsToSplit);
  }

  constrainToMetaModel(
    model: MetaModel,
    options: DeepPartial<ScalaOptions>
  ): ConstrainedMetaModel {
    const optionsToUse = ScalaGenerator.getScalaOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    return constrainMetaModel<ScalaOptions, ScalaDependencyManager>(
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
    args: AbstractGeneratorRenderArgs<ScalaOptions>
  ): Promise<RenderOutput> {
    if (args.constrainedModel instanceof ConstrainedObjectModel) {
      return this.renderClass(args.constrainedModel, args.inputModel);
    } else if (args.constrainedModel instanceof ConstrainedEnumModel) {
      return this.renderEnum(args.constrainedModel, args.inputModel);
    }
    Logger.warn(
      `Scala generator, cannot generate this type of model, ${args.constrainedModel.name}`
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
   * For Scala you need to specify which package the model is placed under.
   *
   * @param model
   * @param inputModel
   * @param options used to render the full output
   */
  async renderCompleteModel(
    args: AbstractGeneratorRenderCompleteModelArgs<
      ScalaOptions,
      ScalaRenderCompleteModelOptions
    >
  ): Promise<RenderOutput> {
    const completeModelOptionsToUse =
      mergePartialAndDefault<ScalaRenderCompleteModelOptions>(
        ScalaGenerator.defaultCompleteModelOptions,
        args.completeOptions
      );

    if (isReservedScalaKeyword(completeModelOptionsToUse.packageName)) {
      throw new Error(
        `You cannot use reserved Scala keyword (${args.completeOptions.packageName}) as package name, please use another.`
      );
    }

    const outputModel = await this.render(args);
    const modelDependencies = args.constrainedModel
      .getNearestDependencies()
      .map((dependencyModel) => {
        return `import ${completeModelOptionsToUse.packageName}.${dependencyModel.name};`;
      });
    const outputContent = `package ${completeModelOptionsToUse.packageName};
${modelDependencies.join('\n')}
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
    options?: Partial<ScalaOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = ScalaGenerator.getScalaOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    const presets = this.getPresets('class');
    const renderer = new ClassRenderer(
      this.options,
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
    options?: Partial<ScalaOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = ScalaGenerator.getScalaOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    const presets = this.getPresets('enum');
    const renderer = new EnumRenderer(
      this.options,
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
