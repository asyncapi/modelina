import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions,
} from '../AbstractGenerator';
import { CommonModel, CommonInputModel } from '../../models';
import { TypeHelpers, ModelKind } from '../../helpers';

import { JavaScriptPreset, JS_DEFAULT_PRESET } from './JavaScriptPreset';

import { ClassRenderer } from './renderers/ClassRenderer';

export type JavaScriptOptions = CommonGeneratorOptions<JavaScriptPreset>

/**
 * Generator for JavaScript
 */
export class JavaScriptGenerator extends AbstractGenerator<JavaScriptOptions> {
  static defaultOptions: JavaScriptOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: JS_DEFAULT_PRESET,
  };

  constructor(
    options: JavaScriptOptions = JavaScriptGenerator.defaultOptions,
  ) {
    super('JavaScript', JavaScriptGenerator.defaultOptions, options);
  }

  render(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const kind = TypeHelpers.extractKind(model);
    if (kind === ModelKind.OBJECT) {
      return this.renderClass(model, inputModel);
    }
    return Promise.resolve('');
  }

  renderClass(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const presets = this.getPresets('class'); 
    const renderer = new ClassRenderer(this.options, presets, model, inputModel);
    return renderer.runSelfPreset();
  }
}
