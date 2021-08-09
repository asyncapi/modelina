import {
  AbstractGenerator,
  CommonGeneratorOptions,
  defaultGeneratorOptions,
} from '../AbstractGenerator';
import { CommonModel, CommonInputModel, RenderOutput } from '../../models';
import { TypeHelpers, ModelKind, CommonNamingConvention, CommonNamingConventionImplementation } from '../../helpers';
import { CSharpPreset, CSHARP_DEFAULT_PRESET } from './CSharpPreset';
import { EnumRenderer } from './renderers/EnumRenderer';
import { ClassRenderer } from './renderers/ClassRenderer';

export interface CSharpOptions extends CommonGeneratorOptions<CSharpPreset> {
  namingConvention?: CommonNamingConvention;
}

/**
 * Generator for CSharp
 */
export class CSharpGenerator extends AbstractGenerator<CSharpOptions> {
  static defaultOptions: CSharpOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: CSHARP_DEFAULT_PRESET,
    namingConvention: CommonNamingConventionImplementation
  };

  constructor(
    options: CSharpOptions = CSharpGenerator.defaultOptions,
  ) {
    super('CSharp', CSharpGenerator.defaultOptions, options);
  }

  render(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const kind = TypeHelpers.extractKind(model);
    switch (kind) {
    case ModelKind.OBJECT: 
      return this.renderClass(model, inputModel);
    case ModelKind.ENUM: 
      return this.renderEnum(model, inputModel);
    }

    return Promise.resolve(RenderOutput.toRenderOutput({ result: '', dependencies: [] }));
  }

  async renderEnum(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('enum');
    const renderer = new EnumRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({ result, dependencies: renderer.dependencies });
  }

  async renderClass(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('class');
    const renderer = new ClassRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({ result, dependencies: renderer.dependencies });
  }
}
