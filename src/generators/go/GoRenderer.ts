import { AbstractRenderer } from '../AbstractRenderer';
import { GoOptions } from './GoGenerator';
import { CommonModel, CommonInputModel, Preset } from '../../models';
import { FormatHelpers } from '../../helpers/FormatHelpers';
import { pascalCaseTransformMerge } from "pascal-case";

/**
 * Common renderer for Go types
 * 
 * @extends AbstractRenderer
 */
export abstract class GoRenderer extends AbstractRenderer<GoOptions> {
  constructor(
    options: GoOptions,
    presets: Array<[Preset, unknown]>,
    model: CommonModel,
    inputModel: CommonInputModel,
  ) {
    super(options, presets, model, inputModel);
  }

  async renderFields(): Promise<string> {
    const fields = this.model.properties || {};
    const content: string[] = [];

    for (const [fieldName, field] of Object.entries(fields)) {
      const renderField = await this.runFieldPreset(fieldName, field);
      content.push(renderField);
    }

    return this.renderBlock(content);
  }

  runFieldPreset(fieldName: string, field: CommonModel): Promise<string> {
    return this.runPreset('field', { fieldName, field });
  }

  renderType(model: CommonModel): string {
    if (model.$ref !== undefined) {
      return FormatHelpers.toPascalCase(model.$ref, { transform: pascalCaseTransformMerge });
    }

    if (Array.isArray(model.type)) {
        return model.type.length > 1 ? '[]interface{}' : '[]'+this.toGoType(model.type[0], model);
    }

    return this.toGoType(model.type, model);
  }

  toGoType(type: string | undefined, model: CommonModel): string {
    if (type === undefined) {
      return 'interface{}';
    }

    switch (type) {
      case 'string':
        return 'string';
      case 'integer':
      case 'number':
        return 'int';
      case 'boolean':
        return 'bool';
      case 'object':
        return 'struct{}'
      case 'array': {
        if (Array.isArray(model.items)) {
          return model.items.length > 1? '[]interface{}' : '[]'+this.renderType(model.items[0]);
        }
        const arrayType = model.items ? this.renderType(model.items) : 'interface{}';
        return `[]${arrayType}`;
      }
      default: return type;
    }
  }
}
