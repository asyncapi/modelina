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
import { split, SplitOptions, TypeMapping } from '../../helpers';
import { JavaPreset, JAVA_DEFAULT_PRESET } from './JavaPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { isReservedJavaKeyword } from './Constants';
import { Logger } from '../../';
import { constrainMetaModel, Constraints } from '../../helpers';
import {
  JavaDefaultConstraints,
  JavaDefaultTypeMapping
} from './JavaConstrainer';
import { DeepPartial, mergePartialAndDefault } from '../../utils/Partials';
import { JavaDependencyManager } from './JavaDependencyManager';

export interface JavaOptions extends CommonGeneratorOptions<JavaPreset> {
  collectionType: 'List' | 'Array';
  typeMapping: TypeMapping<JavaOptions, JavaDependencyManager>;
  constraints: Constraints;
}
export type JavaTypeMapping = TypeMapping<JavaOptions, JavaDependencyManager>;
export interface JavaRenderCompleteModelOptions {
  packageName: string;
}
export class JavaGenerator extends AbstractGenerator<
  JavaOptions,
  JavaRenderCompleteModelOptions
> {
  static defaultOptions: JavaOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: JAVA_DEFAULT_PRESET,
    collectionType: 'Array',
    typeMapping: JavaDefaultTypeMapping,
    constraints: JavaDefaultConstraints
  };

  static defaultCompleteModelOptions: JavaRenderCompleteModelOptions = {
    packageName: 'Asyncapi.Models'
  };

  constructor(options?: DeepPartial<JavaOptions>) {
    const realizedOptions = JavaGenerator.getJavaOptions(options);
    super('Java', realizedOptions);
  }

  /**
   * Returns the Java options by merging custom options with default ones.
   */
  static getJavaOptions(options?: DeepPartial<JavaOptions>): JavaOptions {
    const optionsToUse = mergePartialAndDefault(
      JavaGenerator.defaultOptions,
      options
    ) as JavaOptions;
    //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
    if (options?.dependencyManager === undefined) {
      optionsToUse.dependencyManager = () => {
        return new JavaDependencyManager(optionsToUse);
      };
    }
    return optionsToUse;
  }

  /**
   * Wrapper to get an instance of the dependency manager
   */
  getDependencyManager(options: JavaOptions): JavaDependencyManager {
    return this.getDependencyManagerInstance(options) as JavaDependencyManager;
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
    options: DeepPartial<JavaOptions>
  ): ConstrainedMetaModel {
    const optionsToUse = JavaGenerator.getJavaOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    return constrainMetaModel<JavaOptions, JavaDependencyManager>(
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
    inputModel: InputMetaModel,
    options?: DeepPartial<JavaOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = JavaGenerator.getJavaOptions({
      ...this.options,
      ...options
    });
    if (model instanceof ConstrainedObjectModel) {
      return this.renderClass(model, inputModel, optionsToUse);
    } else if (model instanceof ConstrainedEnumModel) {
      return this.renderEnum(model, inputModel, optionsToUse);
    }
    Logger.warn(
      `Java generator, cannot generate this type of model, ${model.name}`
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
   * For Java you need to specify which package the model is placed under.
   *
   * @param model
   * @param inputModel
   * @param options used to render the full output
   */
  async renderCompleteModel(
    model: ConstrainedMetaModel,
    inputModel: InputMetaModel,
    completeModelOptions: Partial<JavaRenderCompleteModelOptions>,
    options: DeepPartial<JavaOptions>
  ): Promise<RenderOutput> {
    const completeModelOptionsToUse = mergePartialAndDefault(
      JavaGenerator.defaultCompleteModelOptions,
      completeModelOptions
    ) as JavaRenderCompleteModelOptions;
    const optionsToUse = JavaGenerator.getJavaOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);

    this.assertPackageIsValid(completeModelOptionsToUse);

    const outputModel = await this.render(model, inputModel, optionsToUse);
    const modelDependencies = dependencyManagerToUse.renderAllModelDependencies(
      model,
      completeModelOptionsToUse.packageName
    );
    const outputContent = `package ${completeModelOptionsToUse.packageName};
${modelDependencies}
${outputModel.dependencies.join('\n')}
${outputModel.result}`;
    return RenderOutput.toRenderOutput({
      result: outputContent,
      renderedName: outputModel.renderedName,
      dependencies: outputModel.dependencies
    });
  }

  private assertPackageIsValid(options: JavaRenderCompleteModelOptions) {
    const reservedWords = options.packageName
      .split('.')
      .filter((subpackage) => isReservedJavaKeyword(subpackage, true));

    if (reservedWords.length > 0) {
      throw new Error(
        `You cannot use '${
          options.packageName
        }' as a package name, contains reserved keywords: [${reservedWords.join(
          ', '
        )}]`
      );
    }
  }

  async renderClass(
    model: ConstrainedObjectModel,
    inputModel: InputMetaModel,
    options?: DeepPartial<JavaOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = JavaGenerator.getJavaOptions({
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
    options?: DeepPartial<JavaOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = JavaGenerator.getJavaOptions({
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
