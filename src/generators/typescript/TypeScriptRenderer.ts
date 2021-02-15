import { AbstractRenderer } from '../AbstractRenderer';
import { TypeScriptOptions } from './TypeScriptGenerator';

import { FormatHelpers } from '../../helpers';
import { CommonModel, CommonInputModel, Preset } from '../../models';

/**
 * Common renderer for TypeScript types
 * 
 * @extends AbstractRenderer
 */
export abstract class TypeScriptRenderer extends AbstractRenderer<TypeScriptOptions> {
  constructor(
    options: TypeScriptOptions,
    presets: Array<[Preset, unknown]>,
    model: CommonModel, 
    inputModel: CommonInputModel,
  ) {
    super(options, presets, model, inputModel);
  }

  renderType(model: CommonModel | CommonModel[]): string {
    if (Array.isArray(model)) {
      return model.map(t => this.renderType(t)).join(' | ');
    }
    if (model.$ref !== undefined) {
      return model.$ref;
    }
    if (Array.isArray(model.type)) {
      return model.type.map(t => this.toTsType(t, model)).join(' | ');
    }
    return this.toTsType(model.type, model);
  }

  toTsType(type: string | undefined, model: CommonModel): string {
    if (type === undefined) {
      return 'any';
    }
    switch (type) {
    case 'string':
      return 'string';
    case 'integer':
    case 'number':
      return 'number';
    case 'bigint':
      return 'bigint';
    case 'boolean':
      return 'boolean';
    case 'array': {
      const types = model.items ? this.renderType(model.items) : 'unknown';
      return `Array<${types}>`;
    }
    default: return type;
    }
  }

  renderTypeSignature(type: CommonModel | CommonModel[], isOptional = false): string {
    if (this.options.renderTypes === false) {
      return '';
    }
    const annotation = isOptional ? '?:' : ':';
    return `${annotation} ${this.renderType(type)}`;
  }

  renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    return `/**
${lines.map(line => ` * ${line}`).join('\n')}
 */`;
  }

  async renderProperties(): Promise<string> {
    const properties = this.model.properties || {};
    const content: string[] = [];

    for (const [propertyName, property] of Object.entries(properties)) {
      const rendererProperty = await this.runPropertyPreset(propertyName, property);
      content.push(rendererProperty);
    }

    return this.renderBlock(content);
  }

  renderProperty(propertyName: string, property: CommonModel): string {
    propertyName = FormatHelpers.toCamelCase(propertyName);
    const signature = this.renderTypeSignature(property, true);
    return `${propertyName}${signature};`;
  }

  async runPropertyPreset(propertyName: string, property: CommonModel): Promise<string> {
    return this.runPreset('property', { propertyName, property });
  }
}
