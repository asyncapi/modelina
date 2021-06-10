import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions,
} from '../AbstractGenerator';
import { CommonModel, CommonInputModel, RenderOutput } from '../../models';
import { ModelKind, TypeHelpers } from '../../helpers';
import { JavaPreset, JAVA_DEFAULT_PRESET } from './JavaPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';

export type JavaOptions = CommonGeneratorOptions<JavaPreset>

export class JavaGenerator extends AbstractGenerator<JavaOptions> {
  static defaultOptions: JavaOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: JAVA_DEFAULT_PRESET,
  };

  constructor(
    options: JavaOptions = JavaGenerator.defaultOptions,
  ) {
    super('Java', JavaGenerator.defaultOptions, options);
  }

  render(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const kind = TypeHelpers.extractKind(model);
    switch (kind) {
    case ModelKind.ENUM: {
      return this.renderEnum(model, inputModel);
    }
    default: return this.renderClass(model, inputModel);
    }
  }

  async renderClass(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('class');
    const renderer = new ClassRenderer(this.options, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, dependencies: renderer.dependencies});
  }

  async renderEnum(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('enum'); 
    const renderer = new EnumRenderer(this.options, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, dependencies: renderer.dependencies});
  }
}
