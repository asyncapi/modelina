import {
  AbstractGenerator,
  AbstractGeneratorRenderArgs,
  AbstractGeneratorRenderCompleteModelArgs,
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import {
  ConstrainedAnyModel,
  ConstrainedBooleanModel,
  ConstrainedEnumModel,
  ConstrainedFloatModel,
  ConstrainedIntegerModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedReferenceModel,
  ConstrainedStringModel,
  ConstrainedUnionModel,
  InputMetaModel,
  MetaModel,
  RenderOutput
} from '../../models';
import { split, TypeMapping } from '../../helpers';
import { TemplatePreset, TEMPLATE_DEFAULT_PRESET } from './TemplatePreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { isReservedTemplateKeyword } from './Constants';
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
  TemplateDefaultConstraints,
  TemplateDefaultTypeMapping
} from './TemplateConstrainer';
import { DeepPartial, mergePartialAndDefault } from '../../utils/Partials';
import { TemplateDependencyManager } from './TemplateDependencyManager';

export interface TemplateOptions
  extends CommonGeneratorOptions<TemplatePreset> {
  typeMapping: TypeMapping<TemplateOptions, TemplateDependencyManager>;
  constraints: Constraints<TemplateOptions>;
}
export type TemplateConstantConstraint = ConstantConstraint<TemplateOptions>;
export type TemplateEnumKeyConstraint = EnumKeyConstraint<TemplateOptions>;
export type TemplateEnumValueConstraint = EnumValueConstraint<TemplateOptions>;
export type TemplateModelNameConstraint = ModelNameConstraint<TemplateOptions>;
export type TemplatePropertyKeyConstraint =
  PropertyKeyConstraint<TemplateOptions>;
export interface TemplateRenderCompleteModelOptions {
  packageName: string;
}

/**
 * All the constrained models that do not depend on others to determine the type
 */
const SAFE_MODEL_TYPES: any[] = [
  ConstrainedAnyModel,
  ConstrainedBooleanModel,
  ConstrainedFloatModel,
  ConstrainedIntegerModel,
  ConstrainedStringModel,
  ConstrainedReferenceModel,
  ConstrainedObjectModel,
  ConstrainedUnionModel,
  ConstrainedEnumModel
];

export class TemplateGenerator extends AbstractGenerator<
  TemplateOptions,
  TemplateRenderCompleteModelOptions
> {
  static defaultOptions: TemplateOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: TEMPLATE_DEFAULT_PRESET,
    typeMapping: TemplateDefaultTypeMapping,
    constraints: TemplateDefaultConstraints
  };

  static defaultCompleteModelOptions: TemplateRenderCompleteModelOptions = {
    packageName: 'Asyncapi.Models'
  };

  constructor(options?: DeepPartial<TemplateOptions>) {
    const realizedOptions = TemplateGenerator.getTemplateOptions(options);
    super('Template', realizedOptions);
  }

  /**
   * Returns the Template options by merging custom options with default ones.
   */
  static getTemplateOptions(
    options?: DeepPartial<TemplateOptions>
  ): TemplateOptions {
    const optionsToUse = mergePartialAndDefault(
      TemplateGenerator.defaultOptions,
      options
    ) as TemplateOptions;
    //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
    if (options?.dependencyManager === undefined) {
      optionsToUse.dependencyManager = () => {
        return new TemplateDependencyManager(optionsToUse);
      };
    }
    return optionsToUse;
  }

  /**
   * Wrapper to get an instance of the dependency manager
   */
  getDependencyManager(options: TemplateOptions): TemplateDependencyManager {
    return this.getDependencyManagerInstance(
      options
    ) as TemplateDependencyManager;
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
    options: DeepPartial<TemplateOptions>
  ): ConstrainedMetaModel {
    const optionsToUse = TemplateGenerator.getTemplateOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    return constrainMetaModel<TemplateOptions, TemplateDependencyManager>(
      this.options.typeMapping,
      this.options.constraints,
      {
        metaModel: model,
        dependencyManager: dependencyManagerToUse,
        options: this.options,
        constrainedName: '' //This is just a placeholder, it will be constrained within the function
      },
      SAFE_MODEL_TYPES
    );
  }

  /**
   * Render a scattered model, where the source code and library and model dependencies are separated.
   *
   * @param model
   * @param inputModel
   */
  render(
    args: AbstractGeneratorRenderArgs<TemplateOptions>
  ): Promise<RenderOutput> {
    if (args.constrainedModel instanceof ConstrainedObjectModel) {
      return this.renderClass(args.constrainedModel, args.inputModel);
    } else if (args.constrainedModel instanceof ConstrainedEnumModel) {
      return this.renderEnum(args.constrainedModel, args.inputModel);
    }
    Logger.warn(
      `Template generator, cannot generate this type of model, ${args.constrainedModel.name}`
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
   * For Template you need to specify which package the model is placed under.
   *
   * @param model
   * @param inputModel
   * @param options used to render the full output
   */
  async renderCompleteModel(
    args: AbstractGeneratorRenderCompleteModelArgs<
      TemplateOptions,
      TemplateRenderCompleteModelOptions
    >
  ): Promise<RenderOutput> {
    const completeModelOptionsToUse =
      mergePartialAndDefault<TemplateRenderCompleteModelOptions>(
        TemplateGenerator.defaultCompleteModelOptions,
        args.completeOptions
      );

    if (isReservedTemplateKeyword(completeModelOptionsToUse.packageName)) {
      throw new Error(
        `You cannot use reserved Template keyword (${args.completeOptions.packageName}) as package name, please use another.`
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
    options?: Partial<TemplateOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = TemplateGenerator.getTemplateOptions({
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
    options?: Partial<TemplateOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = TemplateGenerator.getTemplateOptions({
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
