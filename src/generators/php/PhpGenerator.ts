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
import { PhpPreset, PHP_DEFAULT_PRESET } from './PhpPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { isReservedPhpKeyword } from './Constants';
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
import { PhpDefaultConstraints, PhpDefaultTypeMapping } from './PhpConstrainer';
import { DeepPartial, mergePartialAndDefault } from '../../utils/Partials';
import { PhpDependencyManager } from './PhpDependencyManager';

export interface PhpOptions extends CommonGeneratorOptions<PhpPreset> {
  typeMapping: TypeMapping<PhpOptions, PhpDependencyManager>;
  constraints: Constraints<PhpOptions>;
}
export type PhpConstantConstraint = ConstantConstraint<PhpOptions>;
export type PhpEnumKeyConstraint = EnumKeyConstraint<PhpOptions>;
export type PhpEnumValueConstraint = EnumValueConstraint<PhpOptions>;
export type PhpModelNameConstraint = ModelNameConstraint<PhpOptions>;
export type PhpPropertyKeyConstraint = PropertyKeyConstraint<PhpOptions>;
export interface PhpRenderCompleteModelOptions {
  namespace: string;
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
    namespace: 'Asyncapi',
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
  render(args: AbstractGeneratorRenderArgs<PhpOptions>): Promise<RenderOutput> {
    if (args.constrainedModel instanceof ConstrainedObjectModel) {
      return this.renderClass(args.constrainedModel, args.inputModel);
    } else if (args.constrainedModel instanceof ConstrainedEnumModel) {
      return this.renderEnum(args.constrainedModel, args.inputModel);
    }
    Logger.warn(
      `PHP generator, cannot generate this type of model, ${args.constrainedModel.name}`
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
    args: AbstractGeneratorRenderCompleteModelArgs<
      PhpOptions,
      PhpRenderCompleteModelOptions
    >
  ): Promise<RenderOutput> {
    const completeModelOptionsToUse =
      mergePartialAndDefault<PhpRenderCompleteModelOptions>(
        PhpGenerator.defaultCompleteModelOptions,
        args.completeOptions
      );

    if (isReservedPhpKeyword(completeModelOptionsToUse.namespace)) {
      throw new Error(
        `You cannot use reserved PHP keyword (${completeModelOptionsToUse.namespace}) as package name, please use another.`
      );
    }

    const declares: string = completeModelOptionsToUse.declareStrictTypes
      ? 'declare(strict_types=1);'
      : '';
    const outputModel: RenderOutput = await this.render(args);
    const modelDependencies: string[] = args.constrainedModel
      .getNearestDependencies()
      .map((dependencyModel) => {
        return `use ${completeModelOptionsToUse.namespace}\\${dependencyModel.name};`;
      });
    const outputContent = `<?php
${declares}

namespace ${completeModelOptionsToUse.namespace};

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
    const optionsToUse: PhpOptions = PhpGenerator.getPhpOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse: PhpDependencyManager =
      this.getDependencyManager(optionsToUse);
    const presets = this.getPresets('class');
    const renderer: ClassRenderer = new ClassRenderer(
      this.options,
      this,
      presets,
      model,
      inputModel,
      dependencyManagerToUse
    );
    const result: string = await renderer.runSelfPreset();
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
    const dependencyManagerToUse: PhpDependencyManager =
      this.getDependencyManager(optionsToUse);
    const presets = this.getPresets('enum');
    const renderer: EnumRenderer = new EnumRenderer(
      this.options,
      this,
      presets,
      model,
      inputModel,
      dependencyManagerToUse
    );
    const result: string = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({
      result,
      renderedName: model.name,
      dependencies: dependencyManagerToUse.dependencies
    });
  }
}
