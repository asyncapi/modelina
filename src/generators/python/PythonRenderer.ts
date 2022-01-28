import { AbstractRenderer } from '../AbstractRenderer';
import { PythonGenerator, PythonOptions } from './PythonGenerator';

import { FormatHelpers } from '../../helpers';
import { CommonModel, CommonInputModel, Preset, PropertyType } from '../../models';
import { DefaultPropertyNames, getUniquePropertyName } from '../../helpers/NameHelpers';
import { isReservedPythonKeyword } from './Constants';

/**
 * Common renderer for Python types
 * 
 * @extends AbstractRenderer
 */
export abstract class PythonRenderer extends AbstractRenderer<PythonOptions, PythonGenerator> {
  constructor(
    options: PythonOptions,
    generator: PythonGenerator,
    presets: Array<[Preset, unknown]>,
    model: CommonModel, 
    inputModel: CommonInputModel,
  ) {
    super(options, generator, presets, model, inputModel);
  }
  
  /**
     * Renders the name of a type based on provided generator option naming convention type function.
     * 
     * This is used to render names of models (example python class) and then later used if that class is referenced from other models.
     * 
     * @param name 
     * @param model 
     */
  nameType(name: string | undefined, model?: CommonModel): string {
    return this.options?.namingConvention?.type 
      ? this.options.namingConvention.type(name, { model: model || this.model, inputModel: this.inputModel, reservedKeywordCallback: isReservedPythonKeyword })
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
      ? this.options.namingConvention.property(propertyName, { model: this.model, inputModel: this.inputModel, property, reservedKeywordCallback: isReservedPythonKeyword })
      : propertyName || '';
  }
  
  renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    const content = lines.map(line => ` ${line}`).join('\n');
    return `"""${content}
    """`;
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
  
