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
import { FormatHelpers, split, TypeMapping } from '../../helpers';
import { CplusplusPreset, CPLUSPLUS_DEFAULT_PRESET } from './CplusplusPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { isReservedCplusplusKeyword } from './Constants';
import { Logger } from '../..';
import {
  constrainMetaModel,
  Constraints
} from '../../helpers/ConstrainHelpers';
import {
  CplusplusDefaultConstraints,
  CplusplusDefaultTypeMapping
} from './CplusplusConstrainer';
import { DeepPartial, mergePartialAndDefault } from '../../utils/Partials';
import { CplusplusDependencyManager } from './CplusplusDependencyManager';

export interface CplusplusOptions
  extends CommonGeneratorOptions<CplusplusPreset> {
  typeMapping: TypeMapping<CplusplusOptions, CplusplusDependencyManager>;
  constraints: Constraints;
  namespace: string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CplusplusRenderCompleteModelOptions {}
export class CplusplusGenerator extends AbstractGenerator<
  CplusplusOptions,
  CplusplusRenderCompleteModelOptions
> {
  static defaultOptions: CplusplusOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: CPLUSPLUS_DEFAULT_PRESET,
    typeMapping: CplusplusDefaultTypeMapping,
    constraints: CplusplusDefaultConstraints,
    namespace: 'AsyncapiModels'
  };

  static defaultCompleteModelOptions: CplusplusRenderCompleteModelOptions = {};

  constructor(options?: DeepPartial<CplusplusOptions>) {
    const realizedOptions = CplusplusGenerator.getOptions(options);
    super('Cplusplus', realizedOptions);
  }

  /**
   * Returns the Cplusplus options by merging custom options with default ones.
   */
  static getOptions(options?: DeepPartial<CplusplusOptions>): CplusplusOptions {
    const optionsToUse = mergePartialAndDefault(
      CplusplusGenerator.defaultOptions,
      options
    ) as CplusplusOptions;
    //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
    if (options?.dependencyManager === undefined) {
      optionsToUse.dependencyManager = () => {
        return new CplusplusDependencyManager(optionsToUse);
      };
    }
    return optionsToUse;
  }

  /**
   * Wrapper to get an instance of the dependency manager
   */
  getDependencyManager(options: CplusplusOptions): CplusplusDependencyManager {
    return this.getDependencyManagerInstance(
      options
    ) as CplusplusDependencyManager;
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
    options: DeepPartial<CplusplusOptions>
  ): ConstrainedMetaModel {
    const optionsToUse = CplusplusGenerator.getOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    return constrainMetaModel<CplusplusOptions, CplusplusDependencyManager>(
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
    args: AbstractGeneratorRenderArgs<CplusplusOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = CplusplusGenerator.getOptions({
      ...this.options,
      ...args.options
    });
    if (isReservedCplusplusKeyword(optionsToUse.namespace)) {
      throw new Error(
        `You cannot use reserved C++ keyword (${optionsToUse.namespace}) as namespace, please use another.`
      );
    }
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
      `C++ generator, cannot generate this type of model, ${args.constrainedModel.name}`
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
   * For Cplusplus you need to specify which package the model is placed under.
   *
   * @param model
   * @param inputModel
   * @param options used to render the full output
   */
  async renderCompleteModel(
    args: AbstractGeneratorRenderCompleteModelArgs<
      CplusplusOptions,
      CplusplusRenderCompleteModelOptions
    >
  ): Promise<RenderOutput> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const completeModelOptionsToUse = mergePartialAndDefault(
      CplusplusGenerator.defaultCompleteModelOptions,
      args.completeOptions
    ) as CplusplusRenderCompleteModelOptions;
    const optionsToUse = CplusplusGenerator.getOptions({
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

    const imports = args.constrainedModel
      .getNearestDependencies()
      .map((model) => {
        return `#include "${model.name}.hpp"`;
      });
    const formattedOutputResult = FormatHelpers.indent(
      outputModel.result,
      2,
      optionsToUse.indentation?.type
    );
    const outputContent = `${outputModel.dependencies.join('\n')}
${imports.join('\n')}
namespace ${optionsToUse.namespace}{
${formattedOutputResult}
}`;
    return RenderOutput.toRenderOutput({
      result: outputContent,
      renderedName: outputModel.renderedName,
      dependencies: outputModel.dependencies
    });
  }

  async renderClass(
    model: ConstrainedObjectModel,
    inputModel: InputMetaModel,
    options?: Partial<CplusplusOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = CplusplusGenerator.getOptions({
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
    options?: Partial<CplusplusOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = CplusplusGenerator.getOptions({
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
