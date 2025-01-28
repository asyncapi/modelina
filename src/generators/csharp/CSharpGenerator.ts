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
import {
  FormatHelpers,
  TypeMapping,
  Constraints,
  constrainMetaModel,
  split,
  SplitOptions,
  ConstantConstraint,
  EnumKeyConstraint,
  EnumValueConstraint,
  ModelNameConstraint,
  PropertyKeyConstraint
} from '../../helpers';
import { CSharpPreset, CSHARP_DEFAULT_PRESET } from './CSharpPreset';
import { EnumRenderer } from './renderers/EnumRenderer';
import { ClassRenderer } from './renderers/ClassRenderer';
import { RecordRenderer } from './renderers/RecordRenderer';
import { isReservedCSharpKeyword } from './Constants';
import { Logger } from '../../index';
import {
  CSharpDefaultConstraints,
  CSharpDefaultTypeMapping
} from './CSharpConstrainer';
import { DeepPartial, mergePartialAndDefault } from '../../utils/Partials';
import { CSharpDependencyManager } from './CSharpDependencyManager';

export interface CSharpOptions extends CommonGeneratorOptions<CSharpPreset> {
  collectionType: 'List' | 'Array';
  typeMapping: TypeMapping<CSharpOptions, CSharpDependencyManager>;
  constraints: Constraints<CSharpOptions>;
  autoImplementedProperties: boolean;
  modelType: 'class' | 'record';
  handleNullable: boolean;
  enforceRequired: boolean;
}
export type CSharpConstantConstraint = ConstantConstraint<CSharpOptions>;
export type CSharpEnumKeyConstraint = EnumKeyConstraint<CSharpOptions>;
export type CSharpEnumValueConstraint = EnumValueConstraint<CSharpOptions>;
export type CSharpModelNameConstraint = ModelNameConstraint<CSharpOptions>;
export type CSharpPropertyKeyConstraint = PropertyKeyConstraint<CSharpOptions>;
export type CSharpTypeMapping = TypeMapping<
  CSharpOptions,
  CSharpDependencyManager
>;

export interface CSharpRenderCompleteModelOptions {
  namespace: string;
}

/**
 * All the constrained models that do not depend on others to determine the type
 */
const SAFE_MODEL_TYPES: any[] = [
  ConstrainedObjectModel,
  ConstrainedReferenceModel,
  ConstrainedAnyModel,
  ConstrainedFloatModel,
  ConstrainedIntegerModel,
  ConstrainedStringModel,
  ConstrainedBooleanModel,
  ConstrainedEnumModel,
  ConstrainedUnionModel
];

/**
 * Generator for CSharp
 */
export class CSharpGenerator extends AbstractGenerator<
  CSharpOptions,
  CSharpRenderCompleteModelOptions
> {
  static defaultOptions: CSharpOptions = {
    ...defaultGeneratorOptions,
    collectionType: 'Array',
    defaultPreset: CSHARP_DEFAULT_PRESET,
    typeMapping: CSharpDefaultTypeMapping,
    constraints: CSharpDefaultConstraints,
    autoImplementedProperties: false,
    handleNullable: false,
    modelType: 'class',
    enforceRequired: false,
    // Temporarily set
    dependencyManager: () => {
      return {} as CSharpDependencyManager;
    }
  };

  static defaultCompleteModelOptions: CSharpRenderCompleteModelOptions = {
    namespace: 'Asyncapi.Models'
  };

  constructor(options?: DeepPartial<CSharpOptions>) {
    const realizedOptions = CSharpGenerator.getCSharpOptions(options);
    super('CSharp', realizedOptions);
  }

  /**
   * Returns the CSharp options by merging custom options with default ones.
   */
  static getCSharpOptions(options?: DeepPartial<CSharpOptions>): CSharpOptions {
    const optionsToUse = mergePartialAndDefault(
      this.defaultOptions,
      options
    ) as CSharpOptions;
    //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
    if (options?.dependencyManager === undefined) {
      optionsToUse.dependencyManager = () => {
        return new CSharpDependencyManager(optionsToUse);
      };
    }
    return optionsToUse;
  }

  /**
   * Wrapper to get an instance of the dependency manager
   */
  getDependencyManager(options: CSharpOptions): CSharpDependencyManager {
    return this.getDependencyManagerInstance(
      options
    ) as CSharpDependencyManager;
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
    options: DeepPartial<CSharpOptions>
  ): ConstrainedMetaModel {
    const optionsToUse = CSharpGenerator.getCSharpOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    return constrainMetaModel<CSharpOptions, CSharpDependencyManager>(
      this.options.typeMapping,
      this.options.constraints,
      {
        metaModel: model,
        dependencyManager: dependencyManagerToUse,
        options: this.options,
        constrainedName: '' //This is just a placeholder, it will be constrained within the function,
      },
      SAFE_MODEL_TYPES
    );
  }

  /**
   * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
   *
   * For CSharp we need to specify which namespace the model is placed under.
   *
   * @param model
   * @param inputModel
   * @param options used to render the full output
   */
  async renderCompleteModel(
    args: AbstractGeneratorRenderCompleteModelArgs<
      CSharpOptions,
      CSharpRenderCompleteModelOptions
    >
  ): Promise<RenderOutput> {
    const completeModelOptionsToUse = mergePartialAndDefault(
      CSharpGenerator.defaultCompleteModelOptions,
      args.completeOptions
    ) as CSharpRenderCompleteModelOptions;
    const optionsToUse = CSharpGenerator.getCSharpOptions({
      ...this.options,
      ...args.options
    });
    if (isReservedCSharpKeyword(completeModelOptionsToUse.namespace)) {
      throw new Error(
        `You cannot use reserved CSharp keyword (${completeModelOptionsToUse.namespace}) as namespace, please use another.`
      );
    }

    const outputModel = await this.render({
      ...args,
      options: optionsToUse
    });

    const outputDependencies =
      outputModel.dependencies.length === 0
        ? ''
        : `${outputModel.dependencies.join('\n')}\n\n`;

    const outputContent = `${outputDependencies}
namespace ${completeModelOptionsToUse.namespace}
{
${FormatHelpers.indent(
  outputModel.result,
  optionsToUse.indentation?.size,
  optionsToUse.indentation?.type
)}
}`;

    return RenderOutput.toRenderOutput({
      result: outputContent,
      renderedName: outputModel.renderedName,
      dependencies: outputModel.dependencies
    });
  }

  render(
    args: AbstractGeneratorRenderArgs<CSharpOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = CSharpGenerator.getCSharpOptions({
      ...this.options,
      ...args.options
    });
    if (args.constrainedModel instanceof ConstrainedObjectModel) {
      if (this.options.modelType === 'record') {
        return this.renderRecord(
          args.constrainedModel,
          args.inputModel,
          optionsToUse
        );
      }
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
      `C# generator, cannot generate this type of model, ${args.constrainedModel.name}`
    );
    return Promise.resolve(
      RenderOutput.toRenderOutput({
        result: '',
        renderedName: '',
        dependencies: []
      })
    );
  }

  async renderEnum(
    model: ConstrainedEnumModel,
    inputModel: InputMetaModel,
    options?: Partial<CSharpOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = CSharpGenerator.getCSharpOptions({
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

  async renderClass(
    model: ConstrainedObjectModel,
    inputModel: InputMetaModel,
    options?: Partial<CSharpOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = CSharpGenerator.getCSharpOptions({
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

  async renderRecord(
    model: ConstrainedObjectModel,
    inputModel: InputMetaModel,
    options?: Partial<CSharpOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = CSharpGenerator.getCSharpOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    const presets = this.getPresets('record');
    const renderer = new RecordRenderer(
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
