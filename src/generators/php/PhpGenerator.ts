import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import { ConstrainedEnumModel, ConstrainedMetaModel, ConstrainedObjectModel, InputMetaModel, MetaModel, RenderOutput } from '../../models';
import { split, TypeMapping } from '../../helpers';
import { PhpPreset, Php_DEFAULT_PRESET } from './PhpPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { isReservedPhpKeyword } from './Constants';
import { Logger } from '../..';
import { constrainMetaModel, Constraints } from '../../helpers';
import { PhpDefaultConstraints, PhpDefaultTypeMapping } from './PhpConstrainer';
import { DeepPartial, mergePartialAndDefault } from '../../utils';

export interface PhpOptions extends CommonGeneratorOptions<PhpPreset> {
  typeMapping: TypeMapping<PhpOptions>;
  constraints: Constraints;
}
export interface PhpRenderCompleteModelOptions {
  packageName: string
}
export class PhpGenerator extends AbstractGenerator<PhpOptions, PhpRenderCompleteModelOptions> {
  static defaultOptions: PhpOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: Php_DEFAULT_PRESET,
    typeMapping: PhpDefaultTypeMapping,
    constraints: PhpDefaultConstraints
  };

  constructor(
    options?: DeepPartial<PhpOptions>,
  ) {
    const realizedOptions = mergePartialAndDefault(PhpGenerator.defaultOptions, options) as PhpOptions;
    super('Php', realizedOptions);
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

  constrainToMetaModel(model: MetaModel): ConstrainedMetaModel {
    return constrainMetaModel<PhpOptions>(
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
    Logger.warn(`Php generator, cannot generate this type of model, ${model.name}`);
    return Promise.resolve(RenderOutput.toRenderOutput({ result: '', renderedName: '', dependencies: [] }));
  }

  /**
   * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
   * 
   * For Php you need to specify which package the model is placed under.
   * 
   * @param model 
   * @param inputModel 
   * @param options used to render the full output
   */
  async renderCompleteModel(model: ConstrainedMetaModel, inputModel: InputMetaModel, options: PhpRenderCompleteModelOptions): Promise<RenderOutput> {
    if (isReservedPhpKeyword(options.packageName)) {
      throw new Error(`You cannot use reserved Php keyword (${options.packageName}) as package name, please use another.`);
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
