import {
  AbstractGenerator,
  CommonGeneratorOptions,
  defaultGeneratorOptions,
} from '../AbstractGenerator';
import { CommonModel, CommonInputModel, RenderOutput } from '../../models';
import { TypeHelpers, ModelKind, FormatHelpers } from '../../helpers';
import { GoPreset, GO_DEFAULT_PRESET } from './GoPreset';
import { StructRenderer } from './renderers/StructRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { pascalCaseTransformMerge } from 'change-case';

/**
 * The Go naming convention type
 */
export type GoNamingConvention = {
  type?: (name: string | undefined, ctx: { model: CommonModel, inputModel: CommonInputModel }) => string;
  field?: (name: string | undefined, ctx: { model: CommonModel, inputModel: CommonInputModel, field?: CommonModel }) => string;
};

/**
 * A GoNamingConvention implementation for Go
 */
export const GoNamingConventionImplementation: GoNamingConvention = {
  type: (name: string | undefined) => {
    if (!name) {return '';}
    return FormatHelpers.toPascalCase(name, { transform: pascalCaseTransformMerge });
  },
  field: (fieldName: string | undefined) => {
    if (!fieldName) {return '';}
    return FormatHelpers.toPascalCase(fieldName, { transform: pascalCaseTransformMerge });
  }
};

export interface GoOptions extends CommonGeneratorOptions<GoPreset> {
  namingConvention?: GoNamingConvention;
}

/**
 * Generator for Go
 */
export class GoGenerator extends AbstractGenerator<GoOptions> {
  static defaultOptions: GoOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: GO_DEFAULT_PRESET,
    namingConvention: GoNamingConventionImplementation
  };

  constructor(
    options: GoOptions = GoGenerator.defaultOptions,
  ) {
    super('Go', GoGenerator.defaultOptions, options);
  }

  render(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const kind = TypeHelpers.extractKind(model);
    switch (kind) {
    case ModelKind.OBJECT: 
      return this.renderStruct(model, inputModel);
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

  async renderStruct(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('struct');
    const renderer = new StructRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({ result, dependencies: renderer.dependencies });
  }
}
