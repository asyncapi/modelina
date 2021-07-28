import { AbstractRenderer } from '../AbstractRenderer';
import { JavaScriptGenerator, JavaScriptOptions } from './JavaScriptGenerator';

import { getUniquePropertyName, FormatHelpers, DefaultPropertyNames } from '../../helpers';
import { CommonModel, CommonInputModel, Preset, PropertyType } from '../../models';
const reservedJavaScriptKeywords = [
  'abstract',
  'arguments',
  'await',
  'boolean',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'double',
  'else',
  'enum',
  'eval',
  'export',
  'extends',
  'false',
  'final',
  'finally',
  'float',
  'for',
  'function',
  'goto',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'int',
  'interface',
  'let',
  'long',
  'native',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'short',
  'static',
  'super',
  'switch',
  'synchronized',
  'this',
  'throw',
  'throws',
  'transient',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'volatile',
  'while',
  'with',
  'yield',
  // Reserved for > ECMAScript 5/6
  'abstract', 
  'boolean', 
  'byte', 
  'char',
  'double', 
  'final', 
  'float', 
  'goto',
  'int', 
  'long', 
  'native', 
  'short',
  'synchronized', 
  'throws', 
  'transient', 
  'volatile'
];
/**
 * Common renderer for JavaScript types
 * 
 * @extends AbstractRenderer
 */
export abstract class JavaScriptRenderer extends AbstractRenderer<JavaScriptOptions, JavaScriptGenerator> {
  constructor(
    options: JavaScriptOptions,
    generator: JavaScriptGenerator,
    presets: Array<[Preset, unknown]>,
    model: CommonModel, 
    inputModel: CommonInputModel,
  ) {
    super(options, generator, presets, model, inputModel);
  }

  static isReservedJavaScriptKeyword(word: string): boolean {
    return reservedJavaScriptKeywords.includes(word);
  }

  /**
   * Renders the name of a type based on provided generator option naming convention type function.
   * 
   * This is used to render names of models (example TS class) and then later used if that class is referenced from other models.
   * 
   * @param name 
   * @param model 
   */
  nameType(name: string | undefined, model?: CommonModel): string {
    return this.options?.namingConvention?.type 
      ? this.options.namingConvention.type(name, { model: model || this.model, inputModel: this.inputModel, isReservedKeyword: JavaScriptRenderer.isReservedJavaScriptKeyword(`${name}`) })
      : name || '';
  }

  /**
   * Renders the name of a property based on provided generator option naming convention property function.
   * 
   * @param propertyName 
   * @param property
   */
  nameProperty(propertyName: string | undefined, property?: CommonModel): string {
    return this.options?.namingConvention?.property 
      ? this.options.namingConvention.property(propertyName, { model: this.model, inputModel: this.inputModel, property, isReservedKeyword: JavaScriptRenderer.isReservedJavaScriptKeyword(`${propertyName}`) })
      : propertyName || '';
  }

  renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    const content = lines.map(line => ` * ${line}`).join('\n');
    return `/**
${content}
 */`;
  }

  async renderProperties(): Promise<string> {
    const properties = this.model.properties || {};
    const content: string[] = [];

    for (const [propertyName, property] of Object.entries(properties)) {
      const rendererProperty = await this.runPropertyPreset(propertyName, property);
      content.push(rendererProperty);
    }

    if (this.model.additionalProperties !== undefined) {
      const propertyName = getUniquePropertyName(this.model, DefaultPropertyNames.additionalProperties);
      const additionalProperty = await this.runPropertyPreset(propertyName, this.model.additionalProperties, PropertyType.additionalProperty);
      content.push(additionalProperty);
    }

    if (this.model.patternProperties !== undefined) {
      for (const [pattern, patternModel] of Object.entries(this.model.patternProperties)) {
        const propertyName = getUniquePropertyName(this.model, `${pattern}${DefaultPropertyNames.patternProperties}`);
        const renderedPatternProperty = await this.runPropertyPreset(propertyName, patternModel, PropertyType.patternProperties);
        content.push(renderedPatternProperty);
      }
    }
    
    return this.renderBlock(content);
  }

  runPropertyPreset(propertyName: string, property: CommonModel, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('property', { propertyName, property, type});
  }
}
