import {
  AbstractGenerator,
  CommonGeneratorOptions,
  defaultGeneratorOptions,
} from '../AbstractGenerator';
import { CommonModel, CommonInputModel, RenderOutput } from '../../models';
import { TypeHelpers, ModelKind } from '../../helpers';
import { GoPreset, GO_DEFAULT_PRESET } from './GoPreset';
import { StructRenderer } from './renderers/StructRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';

export type GoOptions = CommonGeneratorOptions<GoPreset>

/**
 * Generator for Go
 */
export class GoGenerator extends AbstractGenerator<GoOptions> {
  static defaultOptions: GoOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: GO_DEFAULT_PRESET,
  };

  constructor(
    options: GoOptions = GoGenerator.defaultOptions,
  ) {
    super('Go', GoGenerator.defaultOptions, options);
  }

  render(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const kind = TypeHelpers.extractKind(model);
    switch (kind) {
    case ModelKind.OBJECT: {
      return this.renderStruct(model, inputModel);
    }
    case ModelKind.ENUM: {
      return this.renderEnum(model, inputModel);
    }
    }

    return Promise.resolve(RenderOutput.toRenderOutput({ result: '', dependencies: [] }));
  }

  async renderEnum(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('enum');
    const renderer = new EnumRenderer(this.options, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({ result, dependencies: renderer.dependencies });
  }

  async renderStruct(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('struct');
    const renderer = new StructRenderer(this.options, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({ result, dependencies: renderer.dependencies });
  }
}
