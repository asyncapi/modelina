import { AbstractRenderer } from '../AbstractRenderer';
import { TypeScriptGenerator, TypeScriptOptions } from './TypeScriptGenerator';

import { FormatHelpers } from '../../helpers';
import { CommonModel, ConstrainedMetaModel, InputMetaModel, Preset } from '../../models';
import { DefaultPropertyNames, getUniquePropertyName } from '../../helpers/NameHelpers';
import { isReservedTypeScriptKeyword } from './Constants';

/**
 * Common renderer for TypeScript types
 * 
 * @extends AbstractRenderer
 */
export abstract class TypeScriptRenderer<RendererModelType extends ConstrainedMetaModel> extends AbstractRenderer<TypeScriptOptions, TypeScriptGenerator, RendererModelType> {
  constructor(
    options: TypeScriptOptions,
    generator: TypeScriptGenerator,
    presets: Array<[Preset, unknown]>,
    model: RendererModelType, 
    inputModel: InputMetaModel,
  ) {
    super(options, generator, presets, model, inputModel);
  }

  renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    const renderedLines = lines.map(line => ` * ${line}`).join('\n');
    return `/**
${renderedLines}
 */`;
  }

  /**
   * Render all the properties for the model by calling the property preset per property.
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

  renderProperty(property: ConstrainedMetaModel): string {
    return `${property.name}: ${property.type};`;
  }

  runPropertyPreset(propertyName: string, property: ConstrainedMetaModel): Promise<string> {
    return this.runPreset('property', { propertyName, property });
  }
}
