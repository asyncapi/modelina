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
import { PhpPreset, PHP_DEFAULT_PRESET } from './PhpPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { isReservedPhpKeyword } from './Constants';
import { Logger } from '../..';
import {
  constrainMetaModel,
  Constraints
} from '../../helpers/ConstrainHelpers';
import { PhpDefaultConstraints, PhpDefaultTypeMapping } from './PhpConstrainer';
import { DeepPartial, mergePartialAndDefault } from '../../utils/Partials';
import { PhpDependencyManager } from './PhpDependencyManager';

export interface PhpOptions extends CommonGeneratorOptions<PhpPreset> {
  typeMapping: TypeMapping<PhpOptions, PhpDependencyManager>;
  constraints: Constraints;
}
export interface PhpRenderCompleteModelOptions {
  packageName: string;
  declareStrictTypes: boolean;
}
export class PhpGenerator extends AbstractGenerator<
  PhpOptions,
  PhpRenderCompleteModelOptions
> {
  static defaultOptions: PhpOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: PHP_DEFAULT_PRESET,
    typeMapping: PhpDefaultTypeMapping,
    constraints: PhpDefaultConstraints
  };

  static defaultCompleteModelOptions: PhpRenderCompleteModelOptions = {
    packageName: 'Asyncapi',
    declareStrictTypes: true
  };

  constructor(options?: DeepPartial<PhpOptions>) {
    const realizedOptions = PhpGenerator.getPhpOptions(options);
    super('PHP', realizedOptions);
  }

  /**
   * Returns the Php options by merging custom options with default ones.
   */
  static getPhpOptions(options?: DeepPartial<PhpOptions>): PhpOptions {
    const optionsToUse = mergePartialAndDefault(
      PhpGenerator.defaultOptions,
      options
    ) as PhpOptions;
    //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
    if (options?.dependencyManager === undefined) {
      optionsToUse.dependencyManager = () => {
        return new PhpDependencyManager(optionsToUse);
      };
    }
    return optionsToUse;
  }

  /**
   * Wrapper to get an instance of the dependency manager
   */
  getDependencyManager(options: PhpOptions): PhpDependencyManager {
    return this.getDependencyManagerInstance(options) as PhpDependencyManager;
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
    options: DeepPartial<PhpOptions>
  ): ConstrainedMetaModel {
    const optionsToUse = PhpGenerator.getPhpOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    return constrainMetaModel<PhpOptions, PhpDependencyManager>(
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
      `PHP generator, cannot generate this type of model, ${model.name}`
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
   * @param model
   * @param inputModel
   * @param options used to render the full output
   */
  async renderCompleteModel(
    model: ConstrainedMetaModel,
    inputModel: InputMetaModel,
    options: PhpRenderCompleteModelOptions
  ): Promise<RenderOutput> {

    const completeModelOptionsToUse = mergePartialAndDefault(
        PhpGenerator.defaultCompleteModelOptions,
        options
    )

    if (isReservedPhpKeyword(completeModelOptionsToUse.packageName)) {
      throw new Error(
        `You cannot use reserved PHP keyword (${options.packageName}) as package name, please use another.`
      );
    }

    const declares = completeModelOptionsToUse.declareStrictTypes ? 'declare(strict_types=1);' : '';
    const outputModel = await this.render(model, inputModel);
    const modelDependencies = model
      .getNearestDependencies()
      .map((dependencyModel) => {
        return `use ${completeModelOptionsToUse.packageName}\\${dependencyModel.name};`;
      });
    const outputContent = `
<?php
${declares}

namespace ${completeModelOptionsToUse.packageName};
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
    options?: Partial<PhpOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = PhpGenerator.getPhpOptions({
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
    options?: Partial<PhpOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = PhpGenerator.getPhpOptions({
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
