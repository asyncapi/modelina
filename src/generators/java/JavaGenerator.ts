import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions,
} from '../AbstractGenerator';
import { CommonModel, CommonInputModel, RenderOutput, OutputModel } from '../../models';
import { CommonNamingConvention, CommonNamingConventionImplementation, ModelKind, TypeHelpers, FileHelpers, FormatHelpers } from '../../helpers';
import { JavaPreset, JAVA_DEFAULT_PRESET } from './JavaPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import * as path from 'path';
import { isReservedJavaKeyword } from './Constants';
export interface JavaOptions extends CommonGeneratorOptions<JavaPreset> {
  collectionType?: 'List' | 'Array';
  namingConvention?: CommonNamingConvention;
}

export class JavaGenerator extends AbstractGenerator<JavaOptions> {
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

  /**
   * Generates all the models to an output directory. 
   * 
   * This function is invasive, as it overwrite any existing files with the same name as the model.
   * 
   * @param input
   * @param outputDirectory where you want the models generated to
   * @param packageName for the models
   */
  public async generateToFile(input: Record<string, unknown> | CommonInputModel, outputDirectory: string, packageName: string): Promise<OutputModel[]> {
    const generatedModels = await this.generateFullOutput(input, packageName);
    for (const outputModel of generatedModels) {
      const outputFilePath = path.resolve(outputDirectory, `${FormatHelpers.toPascalCase(outputModel.model.$id || 'undefined')}.java`);
      await FileHelpers.writeToFile(outputModel.result, outputFilePath);
    }
    return Promise.resolve(generatedModels);
  }

  /**
   * Generates the full output of a model, instead of a scattered model.
   * 
   * OutputModels result is no longer the model itself, but including package, package dependencies and model dependencies.
   * 
   * @param input 
   * @param packageName for the models
   */
  public async generateFullOutput(input: Record<string, unknown> | CommonInputModel, packageName: string): Promise<OutputModel[]> {
    if (isReservedJavaKeyword(packageName)) {
      return Promise.reject(`You cannot use reserved Java keyword (${packageName}) as package name, please use another.`);
    }

    const fullOutputModels = [];
    const generatedModels = await this.generate(input);
    for (const outputModel of generatedModels) {
      const modelDependencies = outputModel.model.getNearestDependencies().map((dependencyModel) => { return `import ${packageName}.${FormatHelpers.toPascalCase(dependencyModel || 'undefined')};`;});
      const outputContent = `package ${packageName};
${modelDependencies.join('\n')}
${outputModel.dependencies.join('\n')}
${outputModel.result}
`; 
      const newOutputModel = new OutputModel(outputContent, outputModel.model, outputModel.modelName, outputModel.inputModel, outputModel.dependencies);
      fullOutputModels.push(newOutputModel);
    }
    return Promise.resolve(fullOutputModels);
  }
}
