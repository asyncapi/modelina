import {
  AbstractGenerator,
  CommonGeneratorOptions,
  defaultGeneratorOptions,
} from '../AbstractGenerator';
import { CommonModel, CommonInputModel, RenderOutput } from '../../models';
import { TypeHelpers, ModelKind } from '../../helpers';
import { GoPreset, GO_DEFAULT_PRESET } from './GoPreset';
import { StructRenderer } from './renderers/StructRenderer';
import { FormatHelpers } from '../../helpers/FormatHelpers';
import { pascalCaseTransformMerge } from 'pascal-case';

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
      const typeName = model.$id && FormatHelpers.toPascalCase(model.$id, { transform: pascalCaseTransformMerge });
      const result = `// ${typeName} represents an enum\ntype ${typeName} interface{}`;
      return Promise.resolve(RenderOutput.toRenderOutput({ result, dependencies: [] }));
    }
    }

    return Promise.resolve(RenderOutput.toRenderOutput({ result: '', dependencies: [] }));
  }

  async renderStruct(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('struct');
    const renderer = new StructRenderer(this.options, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({ result, dependencies: renderer.dependencies });
  }
}
