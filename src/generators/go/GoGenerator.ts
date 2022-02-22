import {
  AbstractGenerator,
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import { CommonModel, CommonInputModel, RenderOutput } from '../../models';
import { TypeHelpers, ModelKind, FormatHelpers } from '../../helpers';
import { GoPreset, GO_DEFAULT_PRESET } from './GoPreset';
import { StructRenderer } from './renderers/StructRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { pascalCaseTransformMerge } from 'change-case';
import { Logger } from '../../utils/LoggingInterface';

/**
 * The Go naming convention type
 */
export type GoNamingConvention = {
  type?: (name: string | undefined, ctx: { model: CommonModel, inputModel: CommonInputModel, reservedKeywordCallback?: (name: string) => boolean }) => string;
  field?: (name: string | undefined, ctx: { model: CommonModel, inputModel: CommonInputModel, field?: CommonModel, reservedKeywordCallback?: (name: string) => boolean }) => string;
};

/**
 * A GoNamingConvention implementation for Go
 */
export const GoNamingConventionImplementation: GoNamingConvention = {
  type: (name: string | undefined, ctx) => {
    if (!name) { return ''; }
    let formattedName = FormatHelpers.toPascalCase(name, { transform: pascalCaseTransformMerge });
    if (ctx.reservedKeywordCallback !== undefined && ctx.reservedKeywordCallback(formattedName)) {
      formattedName = FormatHelpers.toPascalCase(`reserved_${formattedName}`);
    }
    return formattedName;
  },
  // eslint-disable-next-line sonarjs/no-identical-functions
  field: (name: string | undefined, ctx) => {
    if (!name) { return ''; }
    let formattedName = FormatHelpers.toPascalCase(name, { transform: pascalCaseTransformMerge });
    if (ctx.reservedKeywordCallback !== undefined && ctx.reservedKeywordCallback(formattedName)) {
      formattedName = FormatHelpers.toPascalCase(`reserved_${formattedName}`);
      if (Object.keys(ctx.model.properties || {}).includes(formattedName)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return GoNamingConventionImplementation.field!(`reserved_${formattedName}`, ctx);
      }
    }
    return formattedName;
  }
};

export interface GoOptions extends CommonGeneratorOptions<GoPreset> {
  namingConvention?: GoNamingConvention;
}

export interface GoRenderCompleteModelOptions {
  packageName: string
}

/**
 * Generator for Go
 */
export class GoGenerator extends AbstractGenerator<GoOptions, GoRenderCompleteModelOptions> {
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
    case ModelKind.UNION:
      // We don't support union in Go generator, however, if union is an object, we render it as a struct.
      if (!model.type?.includes('object')) { break; }
      return this.renderStruct(model, inputModel);
    case ModelKind.OBJECT:
      return this.renderStruct(model, inputModel);
    case ModelKind.ENUM:
      return this.renderEnum(model, inputModel);
    }
    Logger.warn(`Go generator, cannot generate this type of model, ${model.$id}`);
    return Promise.resolve(RenderOutput.toRenderOutput({ result: '', renderedName: '', dependencies: [] }));
  }

  /**
   * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
   *
   * @param model
   * @param inputModel
   * @param options
   */
  async renderCompleteModel(model: CommonModel, inputModel: CommonInputModel, options: GoRenderCompleteModelOptions): Promise<RenderOutput> {
    const outputModel = await this.render(model, inputModel);
    let importCode = '';
    if (outputModel.dependencies.length > 0) {
      const dependencies = outputModel.dependencies.map((dependency) => { return `"${dependency}"`; }).join('\n');
      importCode = `import (  
  ${dependencies}
)`;
    }
    const outputContent = `
package ${options.packageName}
${importCode}
${outputModel.result}`;
    return RenderOutput.toRenderOutput({ result: outputContent, renderedName: outputModel.renderedName, dependencies: outputModel.dependencies });
  }

  async renderEnum(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('enum');
    const renderer = new EnumRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    const renderedName = renderer.nameType(model.$id, model);
    return RenderOutput.toRenderOutput({ result, renderedName, dependencies: renderer.dependencies });
  }

  async renderStruct(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('struct');
    const renderer = new StructRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    const renderedName = renderer.nameType(model.$id, model);
    return RenderOutput.toRenderOutput({ result, renderedName, dependencies: renderer.dependencies });
  }
}
