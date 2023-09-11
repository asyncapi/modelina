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
import { IndentationTypes, split, TypeMapping } from '../../helpers';
import { KotlinPreset, KOTLIN_DEFAULT_PRESET } from './KotlinPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { isReservedKotlinKeyword } from './Constants';
import { Logger } from '../..';
import {
  constrainMetaModel,
  Constraints
} from '../../helpers/ConstrainHelpers';
import {
  KotlinDefaultConstraints,
  KotlinDefaultTypeMapping
} from './KotlinConstrainer';
import { DeepPartial, mergePartialAndDefault } from '../../utils/Partials';
import { KotlinDependencyManager } from './KotlinDependencyManager';

export interface KotlinOptions extends CommonGeneratorOptions<KotlinPreset> {
  typeMapping: TypeMapping<KotlinOptions, KotlinDependencyManager>;
  constraints: Constraints;
  collectionType: 'List' | 'Array';
}
export type KotlinTypeMapping = TypeMapping<
  KotlinOptions,
  KotlinDependencyManager
>;
export interface KotlinRenderCompleteModelOptions {
  packageName: string;
}
export class KotlinGenerator extends AbstractGenerator<
  KotlinOptions,
  KotlinRenderCompleteModelOptions
> {
  static defaultOptions: KotlinOptions = {
    ...defaultGeneratorOptions,
    indentation: {
      type: IndentationTypes.SPACES,
      size: 4
    },
    defaultPreset: KOTLIN_DEFAULT_PRESET,
    collectionType: 'List',
    typeMapping: KotlinDefaultTypeMapping,
    constraints: KotlinDefaultConstraints
  };

  constructor(options?: DeepPartial<KotlinOptions>) {
    const realizedOptions = KotlinGenerator.getKotlinOptions(options);
    super('Kotlin', realizedOptions);
  }

  /**
   * Returns the Kotlin options by merging custom options with default ones.
   */
  static getKotlinOptions(options?: DeepPartial<KotlinOptions>): KotlinOptions {
    const optionsToUse = mergePartialAndDefault(
      KotlinGenerator.defaultOptions,
      options
    ) as KotlinOptions;
    //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
    if (options?.dependencyManager === undefined) {
      optionsToUse.dependencyManager = () => {
        return new KotlinDependencyManager(optionsToUse);
      };
    }
    return optionsToUse;
  }

  /**
   * Wrapper to get an instance of the dependency manager
   */
  getDependencyManager(options: KotlinOptions): KotlinDependencyManager {
    return this.getDependencyManagerInstance(
      options
    ) as KotlinDependencyManager;
  }

  /**
   * This function makes sure we split up the MetaModels accordingly to what we want to render as models.
   */
  splitMetaModel(model: MetaModel): MetaModel[] {
    const metaModelsToSplit = {
      splitEnum: true,
      splitObject: true
    };
    return split(model, metaModelsToSplit);
  }

  constrainToMetaModel(
    model: MetaModel,
    options: DeepPartial<KotlinOptions>
  ): ConstrainedMetaModel {
    const optionsToUse = KotlinGenerator.getKotlinOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    return constrainMetaModel<KotlinOptions, KotlinDependencyManager>(
      optionsToUse.typeMapping,
      optionsToUse.constraints,
      {
        metaModel: model,
        dependencyManager: dependencyManagerToUse,
        options: optionsToUse,
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
    args: AbstractGeneratorRenderArgs<KotlinOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = KotlinGenerator.getKotlinOptions({
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
      `Kotlin generator, cannot generate this type of model, ${args.constrainedModel.name}`
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
   * For Kotlin you need to specify which package the model is placed under.
   *
   * @param model
   * @param inputModel
   * @param options used to render the full output
   */
  async renderCompleteModel(
    args: AbstractGeneratorRenderCompleteModelArgs<
      KotlinOptions,
      KotlinRenderCompleteModelOptions
    >
  ): Promise<RenderOutput> {
    const optionsToUse = KotlinGenerator.getKotlinOptions({
      ...this.options,
      ...args.options
    });
    const outputModel = await this.render({
      ...args,
      options: optionsToUse
    });
    const packageName = this.sanitizePackageName(
      args.completeOptions.packageName || 'Asyncapi.Models'
    );
    const outputContent = `package ${packageName}
${outputModel.dependencies.join('\n')}

${outputModel.result}`;
    return RenderOutput.toRenderOutput({
      result: outputContent,
      renderedName: outputModel.renderedName,
      dependencies: outputModel.dependencies
    });
  }

  private sanitizePackageName(packageName: string): string {
    return packageName
      .split('.')
      .map((subpackage) =>
        isReservedKotlinKeyword(subpackage, true)
          ? `\`${subpackage}\``
          : subpackage
      )
      .join('.');
  }

  async renderClass(
    model: ConstrainedObjectModel,
    inputModel: InputMetaModel,
    options?: DeepPartial<KotlinOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = KotlinGenerator.getKotlinOptions({
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
    options?: DeepPartial<KotlinOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = KotlinGenerator.getKotlinOptions({
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
