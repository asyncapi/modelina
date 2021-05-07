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

  /**
   * Render CommonModel(s) to TS types
   * 
   * @param model(s) to render type for
   */
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

  /**
   * Renders CommonModel type to TS type
   * 
   * @param type from CommonModel to transform to TS type
   * @param model used for array types to generate correct array of types
   */
  toTsType(commonModelType: string | undefined, model: CommonModel): string {
    if (commonModelType === undefined) {
      return 'any';
    }
    switch (commonModelType) { 
    case 'string':
      return 'string';
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array': {
      const types = model.items ? this.renderType(model.items) : 'unknown';
      return `Array<${types}>`;
    }
    default: return commonModelType;
    }
  }

  /**
   * Renders a CommonModel type signature
   * @param type 
   * @param param1 
   */
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
   * Render all properties
   */
  async renderProperties(): Promise<string> {
    const properties = this.model.properties || {};
    const content: string[] = [];

    for (const [propertyName, property] of Object.entries(properties)) {
      const rendererProperty = await this.runPropertyPreset(propertyName, property);
      content.push(rendererProperty);
    }
    
    if (this.model.additionalProperties instanceof CommonModel) {
      const getter = await this.runPropertyPreset(this.options.additionalPropertiesName ?? 'additionalProperties', this.model.additionalProperties);
      const setter = await this.runPropertyPreset(this.options.additionalPropertiesName ?? 'additionalProperties', this.model.additionalProperties);
      content.push(this.renderBlock([getter, setter]));
    }

    return this.renderBlock(content);
  }

  /**
   * Render a single property signature for TS. 
   * @param propertyName 
   * @param property 
   * @param wrappedType used to wrap the property type in another TS type
   */
  renderProperty(propertyName: string, property: CommonModel, wrappedType?: string): string {
    const name = FormatHelpers.toCamelCase(propertyName);
    let signature = this.renderTypeSignature(property, { isRequired: this.model.isRequired(propertyName) });
    if(wrappedType !== undefined){
      signature = `${wrappedType}${signature}>`
    }
    return `${name}${signature};`;
  }

  async runPropertyPreset(propertyName: string, property: CommonModel): Promise<string> {
    return this.runPreset('property', { propertyName, property });
  }
}
