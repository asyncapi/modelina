import { AbstractRenderer } from '../AbstractRenderer';
import { TypeScriptOptions } from './TypeScriptGenerator';

import { FormatHelpers } from '../../helpers';
import { CommonModel, CommonInputModel, Preset } from '../../models';
import { findPropertyNameForAdditionalProperties } from '../../helpers/NameHelper';

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
    if (model.enum !== undefined) {
      return model.enum.map(value => typeof value === 'string' ? `"${value}"` : value).join(' | ');
    }
    if (model.$ref !== undefined) {
      return FormatHelpers.toPascalCase(model.$ref);
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
    case 'boolean':
      return 'boolean';
    case 'array': {
      //Check and see if it should be rendered as tuples or array 
      if (Array.isArray(model.items)) {
        const types = model.items.map((item) => {
          return this.renderType(item);
        });
        return `[${types.join(', ')}]`;
      } 
      const arrayType = model.items ? this.renderType(model.items) : 'unknown';
      return `Array<${arrayType}>`;
    }
    default: return type;
    }
  }

  renderTypeSignature(type: CommonModel | CommonModel[], {
    isRequired = true,
    orUndefined = false,
  }: {
    isRequired?: boolean;
    orUndefined?: boolean;
  } = {}): string {
    if (this.options.renderTypes === false) {
      return '';
    }

    const annotation = isRequired ? ':' : '?:';
    let t = this.renderType(type);
    t = orUndefined ? `${t} | undefined` : t;

    return `${annotation} ${t}`;
  }

  renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    return `/**
${lines.map(line => ` * ${line}`).join('\n')}
 */`;
  }

  /**
   * Render all the properties for the model by calling the property preset per property.
   * 
   * @returns 
   */
  async renderProperties(): Promise<string> {
    const properties = this.model.properties || {};
    const content: string[] = [];

    for (const [propertyName, property] of Object.entries(properties)) {
      const rendererProperty = await this.runPropertyPreset(propertyName, property);
      content.push(rendererProperty);
    }

    return this.renderBlock(content);
  }

  /**
   * Renders any additionalProperties if they are present, by calling the additionalProperty preset.
   * 
   * @returns 
   */
  renderAdditionalProperties(): Promise<string> {
    const additionalPropertiesModel = this.model.additionalProperties;
    if (additionalPropertiesModel !== undefined) {
      return this.runAdditionalPropertyPreset(additionalPropertiesModel);
    }
    return Promise.resolve('');
  }

  /**
   * Renders the additionalProperty property.
   * 
   * @param additionalPropertyModel 
   * @returns 
   */
  renderAdditionalProperty(additionalPropertyModel: CommonModel): string {
    const propertyName = findPropertyNameForAdditionalProperties(this.model);
    const additionalPropertyType = this.renderType(additionalPropertyModel);
    return `${propertyName}?: Map<string, ${additionalPropertyType}>;`;
  }

  renderProperty(propertyName: string, property: CommonModel): string {
    const name = FormatHelpers.toCamelCase(propertyName);
    const signature = this.renderTypeSignature(property, { isRequired: this.model.isRequired(propertyName) });
    return `${name}${signature};`;
  }

  runPropertyPreset(propertyName: string, property: CommonModel): Promise<string> {
    return this.runPreset('property', { propertyName, property });
  }
  runAdditionalPropertyPreset(additionalPropertyModel: CommonModel): Promise<string> {
    return this.runPreset('additionalProperties', { additionalPropertyModel });
  }
}
