import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import { CommonModel, CommonInputModel, RenderOutput } from '../../models';
import { CommonNamingConvention, CommonNamingConventionImplementation, ModelKind, TypeHelpers } from '../../helpers';
import { JavaPreset, JAVA_DEFAULT_PRESET } from './JavaPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { isReservedJavaKeyword } from './Constants';
import { Logger } from '../../';
export interface JavaOptions extends CommonGeneratorOptions<JavaPreset> {
  collectionType?: 'List' | 'Array';
  namingConvention?: CommonNamingConvention;
}
export interface JavaRenderCompleteModelOptions {
  packageName: string
}
export class JavaGenerator extends AbstractGenerator<JavaOptions, JavaRenderCompleteModelOptions> {
  static defaultOptions: JavaOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: JAVA_DEFAULT_PRESET,     
    collectionType: 'Array',
    namingConvention: CommonNamingConventionImplementation
  };

  constructor(
    options: JavaOptions = JavaGenerator.defaultOptions,
  ) {
    super('Java', JavaGenerator.defaultOptions, options);
  }

  /**
   * Render a scattered model, where the source code and library and model dependencies are separated.
   * 
   * @param model 
   * @param inputModel 
   */
  render(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const kind = TypeHelpers.extractKind(model);
    // We don't support union in Java generator, however, if union is an object, we render it as a class.
    if (kind === ModelKind.OBJECT || (kind === ModelKind.UNION && model.type?.includes('object'))) {
      return this.renderClass(model, inputModel);
    } else if (kind === ModelKind.ENUM) {
      return this.renderEnum(model, inputModel);
    }
    Logger.warn(`Java generator, cannot generate this type of model, ${JSON.stringify(model)}`);
    return Promise.resolve(RenderOutput.toRenderOutput({ result: '', renderedName: '', dependencies: [] }));
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
  async renderCompleteModel(model: CommonModel, inputModel: CommonInputModel, options: JavaRenderCompleteModelOptions): Promise<RenderOutput> {
    if (isReservedJavaKeyword(options.packageName)) {
      throw new Error(`You cannot use reserved Java keyword (${options.packageName}) as package name, please use another.`);
    }

    const outputModel = await this.render(model, inputModel);
    const modelDependencies = model.getNearestDependencies().map((dependencyModelName) => { 
      const formattedDependencyModelName = this.options.namingConvention?.type ? this.options.namingConvention.type(dependencyModelName, {inputModel, model: inputModel.models[String(dependencyModelName)], reservedKeywordCallback: isReservedJavaKeyword}) : dependencyModelName;
      return `import ${options.packageName}.${formattedDependencyModelName};`;
    });
    const outputContent = `package ${options.packageName};
${modelDependencies.join('\n')}
${outputModel.dependencies.join('\n')}
${outputModel.result}`; 
    return RenderOutput.toRenderOutput({result: outputContent, renderedName: outputModel.renderedName, dependencies: outputModel.dependencies});
  }

  async renderClass(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('class');
    const renderer = new ClassRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    const renderedName = renderer.nameType(model.$id, model);
    return RenderOutput.toRenderOutput({result, renderedName, dependencies: renderer.dependencies});
  }

  async renderEnum(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('enum'); 
    const renderer = new EnumRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    const renderedName = renderer.nameType(model.$id, model);
    return RenderOutput.toRenderOutput({result, renderedName, dependencies: renderer.dependencies});
  }
}
