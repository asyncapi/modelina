import {
  AbstractGenerator,
  AbstractGeneratorRenderArgs,
  AbstractGeneratorRenderCompleteModelArgs,
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import {
  InputMetaModel,
  RenderOutput,
  ConstrainedObjectModel,
  ConstrainedEnumModel,
  ConstrainedMetaModel,
  ConstrainedUnionModel,
  MetaModel
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
import { GoPreset, GO_DEFAULT_PRESET } from './GoPreset';
import { StructRenderer } from './renderers/StructRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { Logger } from '../../utils/LoggingInterface';
import { GoDefaultConstraints, GoDefaultTypeMapping } from './GoConstrainer';
import { DeepPartial, mergePartialAndDefault } from '../../utils/Partials';
import { GoDependencyManager } from './GoDependencyManager';
import { UnionRenderer } from './renderers/UnionRenderer';

/**
 * @typedef GoOptions
 * @prop {string} unionAnyModelName
 * @prop {string} unionDictModelName
 * @prop {string} unionArrModelName
 */
export interface GoOptions extends CommonGeneratorOptions<GoPreset> {
  typeMapping: TypeMapping<GoOptions, GoDependencyManager>;
  constraints: Constraints<GoOptions>;
  unionAnyModelName: string;
  unionDictModelName: string;
  unionArrModelName: string;
}
export type GoConstantConstraint = ConstantConstraint<GoOptions>;
export type GoEnumKeyConstraint = EnumKeyConstraint<GoOptions>;
export type GoEnumValueConstraint = EnumValueConstraint<GoOptions>;
export type GoModelNameConstraint = ModelNameConstraint<GoOptions>;
export type GoPropertyKeyConstraint = PropertyKeyConstraint<GoOptions>;
export type GoTypeMapping = TypeMapping<GoOptions, GoDependencyManager>;

export interface GoRenderCompleteModelOptions {
  packageName: string;
}

export class GoGenerator extends AbstractGenerator<
  GoOptions,
  GoRenderCompleteModelOptions
> {
  static defaultOptions: GoOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: GO_DEFAULT_PRESET,
    typeMapping: GoDefaultTypeMapping,
    constraints: GoDefaultConstraints,
    unionAnyModelName: 'ModelinaAnyType',
    unionDictModelName: 'ModelinaDictType',
    unionArrModelName: 'ModelinaArrType'
  };

  static defaultCompleteModelOptions: GoRenderCompleteModelOptions = {
    packageName: 'AsyncapiModels'
  };

  constructor(options?: DeepPartial<GoOptions>) {
    const realizedOptions = GoGenerator.getGoOptions(options);
    super('Go', realizedOptions);
  }

  /**
   * Returns the Go options by merging custom options with default ones.
   */
  static getGoOptions(options?: DeepPartial<GoOptions>): GoOptions {
    const optionsToUse = mergePartialAndDefault(
      GoGenerator.defaultOptions,
      options
    ) as GoOptions;
    //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
    if (options?.dependencyManager === undefined) {
      optionsToUse.dependencyManager = () => {
        return new GoDependencyManager(optionsToUse);
      };
    }
    return optionsToUse;
  }

  /**
   * Wrapper to get an instance of the dependency manager
   */
  getDependencyManager(options: GoOptions): GoDependencyManager {
    return this.getDependencyManagerInstance(options) as GoDependencyManager;
  }

  splitMetaModel(model: MetaModel): MetaModel[] {
    //These are the models that we have separate renderers for
    const metaModelsToSplit: SplitOptions = {
      splitEnum: true,
      splitObject: true,
      splitUnion: true
    };
    return split(model, metaModelsToSplit);
  }

  constrainToMetaModel(
    model: MetaModel,
    options: DeepPartial<GoOptions>
  ): ConstrainedMetaModel {
    const optionsToUse = GoGenerator.getGoOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    return constrainMetaModel<GoOptions, GoDependencyManager>(
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

  render(args: AbstractGeneratorRenderArgs<GoOptions>): Promise<RenderOutput> {
    const optionsToUse = GoGenerator.getGoOptions({
      ...this.options,
      ...args.options
    });
    if (args.constrainedModel instanceof ConstrainedObjectModel) {
      return this.renderStruct(
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
    } else if (args.constrainedModel instanceof ConstrainedUnionModel) {
      return this.renderUnion(
        args.constrainedModel,
        args.inputModel,
        optionsToUse
      );
    }
    Logger.warn(
      `Go generator, cannot generate this type of model, ${args.constrainedModel.name}`
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
   * @param options
   */
  async renderCompleteModel(
    args: AbstractGeneratorRenderCompleteModelArgs<
      GoOptions,
      GoRenderCompleteModelOptions
    >
  ): Promise<RenderOutput> {
    const completeModelOptionsToUse = mergePartialAndDefault(
      GoGenerator.defaultCompleteModelOptions,
      args.completeOptions
    ) as GoRenderCompleteModelOptions;
    const optionsToUse = GoGenerator.getGoOptions({
      ...this.options,
      ...args.options
    });
    const outputModel = await this.render({
      ...args,
      options: optionsToUse
    });
    let importCode = '';
    if (outputModel.dependencies.length > 0) {
      const dependencies = outputModel.dependencies
        .map((dependency) => {
          return `"${dependency}"`;
        })
        .join('\n');
      importCode = `import (  
  ${dependencies}
)`;
    }
    const outputContent = `
package ${completeModelOptionsToUse.packageName}
${importCode}
${outputModel.result}`;
    return RenderOutput.toRenderOutput({
      result: outputContent,
      renderedName: outputModel.renderedName,
      dependencies: outputModel.dependencies
    });
  }

  async renderEnum(
    model: ConstrainedEnumModel,
    inputModel: InputMetaModel,
    options?: DeepPartial<GoOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = GoGenerator.getGoOptions({
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

  async renderStruct(
    model: ConstrainedObjectModel,
    inputModel: InputMetaModel,
    options?: DeepPartial<GoOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = GoGenerator.getGoOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    const presets = this.getPresets('struct');
    const renderer = new StructRenderer(
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
  async renderUnion(
    model: ConstrainedUnionModel,
    inputModel: InputMetaModel,
    options?: DeepPartial<GoOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = GoGenerator.getGoOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    const presets = this.getPresets('union');
    const renderer = new UnionRenderer(
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
