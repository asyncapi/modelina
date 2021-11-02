import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import { CommonModel, CommonInputModel, RenderOutput } from '../../models';
import { TypeHelpers, ModelKind, CommonNamingConvention, CommonNamingConventionImplementation } from '../../helpers';
import { JavaScriptPreset, JS_DEFAULT_PRESET } from './JavaScriptPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { Logger } from '../../';
export interface JavaScriptOptions extends CommonGeneratorOptions<JavaScriptPreset> {
  namingConvention?: CommonNamingConvention
}

/**
 * Generator for JavaScript
 */
export class JavaScriptGenerator extends AbstractGenerator<JavaScriptOptions> {
  static defaultOptions: JavaScriptOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: JS_DEFAULT_PRESET,
    namingConvention: CommonNamingConventionImplementation
  };

  constructor(
    options: JavaScriptOptions = JavaScriptGenerator.defaultOptions,
  ) {
    super('JavaScript', JavaScriptGenerator.defaultOptions, options);
  }

  renderCompleteModel(): Promise<RenderOutput> {
    throw new Error('Method not implemented.');
  }

  render(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const kind = TypeHelpers.extractKind(model);
    if (kind === ModelKind.OBJECT) {
      return this.renderClass(model, inputModel);
    }
    Logger.warn(`JS generator, cannot generate model for '${model.$id}'`);
    return Promise.resolve(RenderOutput.toRenderOutput({result: '', renderedName: '', dependencies: []}));
  }

  async renderClass(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('class'); 
    const renderer = new ClassRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    const renderedName = renderer.nameType(model.$id, model);
    return RenderOutput.toRenderOutput({result, renderedName, dependencies: renderer.dependencies});
  }
}
