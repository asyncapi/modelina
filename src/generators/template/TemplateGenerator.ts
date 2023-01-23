import {
  AbstractGenerator,
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
import { TemplatePreset, TEMPLATE_DEFAULT_PRESET } from './TemplatePreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { isReservedTemplateKeyword } from './Constants';
import { Logger } from '../..';
import {
  constrainMetaModel,
  Constraints
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
  constraints: Constraints;
}
export interface TemplateRenderCompleteModelOptions {
  packageName: string;
}
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
    model: ConstrainedMetaModel,
    inputModel: InputMetaModel
  ): Promise<RenderOutput> {
    if (model instanceof ConstrainedObjectModel) {
      return this.renderClass(model, inputModel);
    } else if (model instanceof ConstrainedEnumModel) {
      return this.renderEnum(model, inputModel);
    }
    Logger.warn(
      `Template generator, cannot generate this type of model, ${model.name}`
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
    model: ConstrainedMetaModel,
    inputModel: InputMetaModel,
    options: TemplateRenderCompleteModelOptions
  ): Promise<RenderOutput> {
    if (isReservedTemplateKeyword(options.packageName)) {
      throw new Error(
        `You cannot use reserved Template keyword (${options.packageName}) as package name, please use another.`
      );
    }

    const outputModel = await this.render(model, inputModel);
    const modelDependencies = model
      .getNearestDependencies()
      .map((dependencyModel) => {
        return `import ${options.packageName}.${dependencyModel.name};`;
      });
    const outputContent = `package ${options.packageName};
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
