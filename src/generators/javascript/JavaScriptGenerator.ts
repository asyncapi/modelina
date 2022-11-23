import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import { ConstrainedMetaModel, ConstrainedObjectModel, InputMetaModel, MetaModel, RenderOutput } from '../../models';
import { TypeMapping, Constraints, split, constrainMetaModel, renderJavaScriptDependency } from '../../helpers';
import { JavaScriptPreset, JS_DEFAULT_PRESET } from './JavaScriptPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { Logger } from '../../';
import { JavaScriptDefaultConstraints, JavaScriptDefaultTypeMapping } from './JavaScriptConstrainer';
import { DeepPartial, mergePartialAndDefault } from '../../utils';
import { CommonRenderCompleteModelOptions, defaultCompleteOptions } from '../AbstractFileGenerator';
export interface JavaScriptOptions extends CommonGeneratorOptions<JavaScriptPreset> {
  typeMapping: TypeMapping<JavaScriptOptions>;
  constraints: Constraints;
  moduleSystem: 'ESM' | 'CJS';
}

export interface JavaScriptRenderCompleteModelOptions extends CommonRenderCompleteModelOptions {
}

/**
 * Generator for JavaScript
 */
export class JavaScriptGenerator extends AbstractGenerator<JavaScriptOptions, JavaScriptRenderCompleteModelOptions> {
  static defaultOptions: JavaScriptOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: JS_DEFAULT_PRESET,
    typeMapping: JavaScriptDefaultTypeMapping,
    constraints: JavaScriptDefaultConstraints,
    moduleSystem: 'ESM'
  };

  static defaultCompleteOptions: JavaScriptRenderCompleteModelOptions = {
    ...defaultCompleteOptions
  }
  
  constructor(
    options?: DeepPartial<JavaScriptOptions>,
  ) {
    const realizedOptions = mergePartialAndDefault(JavaScriptGenerator.defaultOptions, options) as JavaScriptOptions;
    super('JavaScript', realizedOptions);
  }

  /**
   * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
   *
   * @param model
   * @param inputModel
   * @param options
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async renderCompleteModel(model: ConstrainedMetaModel, inputModel: InputMetaModel, options: JavaScriptRenderCompleteModelOptions): Promise<RenderOutput> {
    const outputModel = await this.render(model, inputModel);
    const modelDependencies = model.getNearestDependencies();
    //Ensure model dependencies have their rendered name
    const modelDependencyImports = modelDependencies.map((dependencyModel) => {
      return renderJavaScriptDependency(dependencyModel.name, `./${dependencyModel.name}`, this.options.moduleSystem);
    });
    let modelCode = `${outputModel.result}
export default ${outputModel.renderedName};
`;
    if (this.options.moduleSystem === 'CJS') {
      modelCode = `${outputModel.result}
module.exports = ${outputModel.renderedName};`;
    }
    const outputContent = `${[...modelDependencyImports, ...outputModel.dependencies].join('\n')}

${modelCode}`;
    return RenderOutput.toRenderOutput({ result: outputContent, renderedName: outputModel.renderedName, dependencies: outputModel.dependencies });
  }

  render(model: ConstrainedMetaModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    if (model instanceof ConstrainedObjectModel) {
      return this.renderClass(model, inputModel);
    }
    Logger.warn(`JS generator, cannot generate model for '${model.name}'`);
    return Promise.resolve(RenderOutput.toRenderOutput({result: '', renderedName: '', dependencies: []}));
  }

  splitMetaModel(model: MetaModel): MetaModel[] {
    //These are the models that we have separate renderers for
    const metaModelsToSplit = {
      splitObject: true
    };
    return split(model, metaModelsToSplit);
  }

  constrainToMetaModel(model: MetaModel): ConstrainedMetaModel {
    return constrainMetaModel<JavaScriptOptions>(
      this.options.typeMapping, 
      this.options.constraints, 
      {
        metaModel: model,
        options: this.options,
        constrainedName: '' //This is just a placeholder, it will be constrained within the function
      }
    );
  }

  async renderClass(model: ConstrainedObjectModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    const presets = this.getPresets('class'); 
    const renderer = new ClassRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: renderer.dependencies});
  }
}
