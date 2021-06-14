import { AbstractRenderer } from '../AbstractRenderer';
import { TypeScriptOptions } from './TypeScriptGenerator';

import { FormatHelpers } from '../../helpers';
import { CommonModel, CommonInputModel, Preset, PropertyType } from '../../models';
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
      const rendererProperty = await this.runPropertyPreset(propertyName, property, PropertyType.property);
      content.push(rendererProperty);
    }

    if (this.model.additionalProperties !== undefined) {
      const propertyName = findPropertyNameForAdditionalProperties(this.model);
      const additionalProperty = await this.runPropertyPreset(propertyName, this.model.additionalProperties, PropertyType.additionalProperty);
      if (additionalProperty) {
        content.push(additionalProperty);
      }
    }

    return this.renderBlock(content);
  }

  renderProperty(propertyName: string, model: CommonModel, type: PropertyType = PropertyType.property): string {
    const name = FormatHelpers.toCamelCase(propertyName);
    
    if (type === PropertyType.property) {
      const signature = this.renderTypeSignature(model, { isRequired: this.model.isRequired(propertyName) });
      return `${name}${signature};`;
    } else if (type === PropertyType.additionalProperty) {
      const additionalPropertyType = this.renderType(model);
      return `${propertyName}?: Map<string, ${additionalPropertyType}>;`;
    }
    return '';
  }

  runPropertyPreset(propertyName: string, property: CommonModel, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('property', { propertyName, property, type });
  }
}
