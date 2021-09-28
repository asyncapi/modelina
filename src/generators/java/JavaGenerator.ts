import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions,
} from '../AbstractGenerator';
import { CommonModel, CommonInputModel, RenderOutput } from '../../models';
import { CommonNamingConvention, CommonNamingConventionImplementation, ModelKind, TypeHelpers, FormatHelpers, FileHelpers } from '../../helpers';
import { JavaPreset, JAVA_DEFAULT_PRESET } from './JavaPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { isReservedJavaKeyword } from './Constants';
import * as path from 'path';
export interface JavaOptions extends CommonGeneratorOptions<JavaPreset> {
  collectionType?: 'List' | 'Array';
  namingConvention?: CommonNamingConvention;
}
export interface JavaRenderFullOptions {
  packageName: string
}
export interface FileWriter {
  write(content: string, toFile: string): Promise<void>; 
}
export class JavaGenerator extends AbstractGenerator<JavaRenderFullOptions, JavaOptions> {
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

  render(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const kind = TypeHelpers.extractKind(model);
    if (kind === ModelKind.ENUM) {
      return this.renderEnum(model, inputModel);
    }
    return this.renderClass(model, inputModel);
  }
  async renderFull(model: CommonModel, inputModel: CommonInputModel, options: JavaRenderFullOptions): Promise<RenderOutput> {
    if (isReservedJavaKeyword(options.packageName)) {
      throw new Error(`You cannot use reserved Java keyword (${options.packageName}) as package name, please use another.`);
    }

    const outputModel = await this.render(model, inputModel);
    const modelDependencies = model.getNearestDependencies().map((dependencyModel) => { return `import ${options.packageName}.${FormatHelpers.toPascalCase(dependencyModel)};`;});
    const outputContent = `package ${options.packageName};
${modelDependencies.join('\n')}
${outputModel.dependencies.join('\n')}
${outputModel.result}`; 
    return RenderOutput.toRenderOutput({result: outputContent, dependencies: outputModel.dependencies});
  }

  /**
   * Generates all the models to an output directory. 
   * 
   * This function is invasive, as it overwrite any existing files with the same name as the model.
   * 
   * @param input
   * @param outputDirectory where you want the models generated to
   * @param packageName to use for the models
   */
  public async generateFile(input: Record<string, unknown> | CommonInputModel, outputDirectory: string, options: JavaRenderFullOptions, fileWriter: FileWriter): Promise<OutputModel[]> {
    let generatedModels = await this.generateFull(input, options);
    generatedModels = generatedModels.filter((outputModel) => { return outputModel.model.$id !== undefined; });
    for (const outputModel of generatedModels) {
      const filePath = path.resolve(outputDirectory, `${outputModel.modelName}.java`);
      await fileWriter.write(outputModel.result, filePath);
    }
    return generatedModels;
  }

  async renderClass(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('class');
    const renderer = new ClassRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, dependencies: renderer.dependencies});
  }

  async renderEnum(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('enum'); 
    const renderer = new EnumRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, dependencies: renderer.dependencies});
  }
}
