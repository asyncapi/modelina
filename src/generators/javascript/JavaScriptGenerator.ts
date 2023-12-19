import {
  AbstractGenerator,
  AbstractGeneratorRenderArgs,
  AbstractGeneratorRenderCompleteModelArgs,
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import {
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  InputMetaModel,
  MetaModel,
  RenderOutput
} from '../../models';
import {
  TypeMapping,
  Constraints,
  split,
  constrainMetaModel,
  SplitOptions,
  ConstantConstraint,
  EnumKeyConstraint,
  EnumValueConstraint,
  ModelNameConstraint,
  PropertyKeyConstraint
} from '../../helpers';
import { JavaScriptPreset, JS_DEFAULT_PRESET } from './JavaScriptPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { Logger } from '../../';
import {
  JavaScriptDefaultConstraints,
  JavaScriptDefaultTypeMapping
} from './JavaScriptConstrainer';
import { DeepPartial, mergePartialAndDefault } from '../../utils';
import { JavaScriptDependencyManager } from './JavaScriptDependencyManager';
export interface JavaScriptOptions
  extends CommonGeneratorOptions<JavaScriptPreset> {
  typeMapping: TypeMapping<JavaScriptOptions, JavaScriptDependencyManager>;
  constraints: Constraints<JavaScriptOptions>;
  moduleSystem: 'ESM' | 'CJS';
}
export type JavaScriptConstantConstraint =
  ConstantConstraint<JavaScriptOptions>;
export type JavaScriptEnumKeyConstraint = EnumKeyConstraint<JavaScriptOptions>;
export type JavaScriptEnumValueConstraint =
  EnumValueConstraint<JavaScriptOptions>;
export type JavaScriptModelNameConstraint =
  ModelNameConstraint<JavaScriptOptions>;
export type JavaScriptPropertyKeyConstraint =
  PropertyKeyConstraint<JavaScriptOptions>;
export type JavaScriptTypeMapping = TypeMapping<
  JavaScriptOptions,
  JavaScriptDependencyManager
>;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface JavaScriptRenderCompleteModelOptions {}

/**
 * Generator for JavaScript
 */
export class JavaScriptGenerator extends AbstractGenerator<
  JavaScriptOptions,
  JavaScriptRenderCompleteModelOptions
> {
  static defaultOptions: JavaScriptOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: JS_DEFAULT_PRESET,
    typeMapping: JavaScriptDefaultTypeMapping,
    constraints: JavaScriptDefaultConstraints,
    moduleSystem: 'ESM'
  };

  static defaultCompleteModelOptions: JavaScriptRenderCompleteModelOptions = {};

  constructor(options?: DeepPartial<JavaScriptOptions>) {
    const realizedOptions = JavaScriptGenerator.getJavaScriptOptions(options);
    super('JavaScript', realizedOptions);
  }

  /**
   * Returns the JavaScript options by merging custom options with default ones.
   */
  static getJavaScriptOptions(
    options?: DeepPartial<JavaScriptOptions>
  ): JavaScriptOptions {
    const optionsToUse = mergePartialAndDefault(
      JavaScriptGenerator.defaultOptions,
      options
    ) as JavaScriptOptions;
    //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
    if (options?.dependencyManager === undefined) {
      optionsToUse.dependencyManager = () => {
        return new JavaScriptDependencyManager(optionsToUse);
      };
    }
    return optionsToUse;
  }

  /**
   * Wrapper to get an instance of the dependency manager
   */
  getDependencyManager(
    options: JavaScriptOptions
  ): JavaScriptDependencyManager {
    return this.getDependencyManagerInstance(
      options
    ) as JavaScriptDependencyManager;
  }

  /**
   * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
   *
   * @param model
   * @param inputModel
   * @param options
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async renderCompleteModel(
    args: AbstractGeneratorRenderCompleteModelArgs<
      JavaScriptOptions,
      JavaScriptRenderCompleteModelOptions
    >
  ): Promise<RenderOutput> {
    //const completeModelOptionsToUse = mergePartialAndDefault(JavaScriptGenerator.defaultCompleteModelOptions, completeModelOptions) as JavaScriptRenderCompleteModelOptions;
    const optionsToUse = JavaScriptGenerator.getJavaScriptOptions({
      ...this.options,
      ...args.options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    const outputModel = await this.render({
      ...args,
      options: optionsToUse
    });
    const modelDependencies = args.constrainedModel.getNearestDependencies();
    //Ensure model dependencies have their rendered name
    const modelDependencyImports = modelDependencies.map((dependencyModel) => {
      return dependencyManagerToUse.renderDependency(
        dependencyModel.name,
        `./${dependencyModel.name}`
      );
    });
    let modelCode = `${outputModel.result}
export default ${outputModel.renderedName};
`;
    if (optionsToUse.moduleSystem === 'CJS') {
      modelCode = `${outputModel.result}
module.exports = ${outputModel.renderedName};`;
    }
    const outputContent = `${[
      ...modelDependencyImports,
      ...outputModel.dependencies
    ].join('\n')}

${modelCode}`;
    return RenderOutput.toRenderOutput({
      result: outputContent,
      renderedName: outputModel.renderedName,
      dependencies: outputModel.dependencies
    });
  }

  render(
    args: AbstractGeneratorRenderArgs<JavaScriptOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = JavaScriptGenerator.getJavaScriptOptions({
      ...this.options,
      ...args.options
    });
    if (args.constrainedModel instanceof ConstrainedObjectModel) {
      return this.renderClass(
        args.constrainedModel,
        args.inputModel,
        optionsToUse
      );
    }
    Logger.warn(
      `JS generator, cannot generate model for '${args.constrainedModel.name}'`
    );
    return Promise.resolve(
      RenderOutput.toRenderOutput({
        result: '',
        renderedName: '',
        dependencies: []
      })
    );
  }

  splitMetaModel(model: MetaModel): MetaModel[] {
    //These are the models that we have separate renderers for
    const metaModelsToSplit: SplitOptions = {
      splitObject: true
    };
    return split(model, metaModelsToSplit);
  }

  constrainToMetaModel(
    model: MetaModel,
    options: DeepPartial<JavaScriptOptions>
  ): ConstrainedMetaModel {
    const optionsToUse = JavaScriptGenerator.getJavaScriptOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    return constrainMetaModel<JavaScriptOptions, JavaScriptDependencyManager>(
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

  async renderClass(
    model: ConstrainedObjectModel,
    inputModel: InputMetaModel,
    options?: DeepPartial<JavaScriptOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = JavaScriptGenerator.getJavaScriptOptions({
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
}
