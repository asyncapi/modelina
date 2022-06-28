import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import { ConstrainedEnumModel, ConstrainedMetaModel, ConstrainedObjectModel, InputMetaModel, MetaModel, RenderOutput } from '../../models';
import { split, TypeMapping } from '../../helpers';
import { JavaPreset, JAVA_DEFAULT_PRESET } from './JavaPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { isReservedJavaKeyword } from './Constants';
import { Logger } from '../../';
import { constrainMetaModel, Constraints } from '../../helpers/ConstrainHelpers';
import { JavaDefaultConstraints, JavaDefaultTypeMapping } from './JavaConstrainer';

export interface JavaOptions extends CommonGeneratorOptions<JavaPreset> {
  collectionType: 'List' | 'Array';
  typeMapping: TypeMapping<JavaOptions>;
  constraints: Constraints;
}
export interface JavaRenderCompleteModelOptions {
  packageName: string
}
export class JavaGenerator extends AbstractGenerator<JavaOptions, JavaRenderCompleteModelOptions> {
  static defaultOptions: JavaOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: JAVA_DEFAULT_PRESET,     
    collectionType: 'Array',
    typeMapping: JavaDefaultTypeMapping,
    constraints: JavaDefaultConstraints
  };

  constructor(
    options: Partial<JavaOptions> = JavaGenerator.defaultOptions,
  ) {
    const realizedOptions = {...JavaGenerator.defaultOptions, ...options};

    super('Java', realizedOptions);
  }

  splitMetaModel(model: MetaModel): MetaModel[] {
    //These are the models that we have separate renderers for
    const metaModelsToSplit = {
      splitEnum: true, 
      splitObject: true
    };
    return split(model, metaModelsToSplit);
  }

  constrainToMetaModel(model: MetaModel): ConstrainedMetaModel {
    return constrainMetaModel(
      this.options.typeMapping, 
      this.options.constraints, 
      {
        metaModel: model,
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
  render(model: ConstrainedMetaModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    if (model instanceof ConstrainedObjectModel) {
      return this.renderClass(model, inputModel);
    } else if (model instanceof ConstrainedEnumModel) {
      return this.renderEnum(model, inputModel);
    } 
    Logger.warn(`Java generator, cannot generate this type of model, ${model.name}`);
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
  async renderCompleteModel(model: ConstrainedMetaModel, inputModel: InputMetaModel, options: JavaRenderCompleteModelOptions): Promise<RenderOutput> {
    if (isReservedJavaKeyword(options.packageName)) {
      throw new Error(`You cannot use reserved Java keyword (${options.packageName}) as package name, please use another.`);
    }

    const outputModel = await this.render(model, inputModel);
    const modelDependencies = model.getNearestDependencies().map((dependencyModel) => {
      return `import ${options.packageName}.${dependencyModel.name};`;
    });
    const outputContent = `package ${options.packageName};
${modelDependencies.join('\n')}
${outputModel.dependencies.join('\n')}
${outputModel.result}`; 
    return RenderOutput.toRenderOutput({result: outputContent, renderedName: outputModel.renderedName, dependencies: outputModel.dependencies});
  }

  async renderClass(model: ConstrainedObjectModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    const presets = this.getPresets('class');
    const renderer = new ClassRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: renderer.dependencies});
  }

  async renderEnum(model: ConstrainedEnumModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    const presets = this.getPresets('enum'); 
    const renderer = new EnumRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: renderer.dependencies});
  }
}
