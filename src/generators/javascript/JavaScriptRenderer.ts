import { AbstractRenderer } from '../AbstractRenderer';
import { JavaScriptOptions } from './JavaScriptGenerator';

import { FormatHelpers } from '../../helpers';
import { CommonModel, CommonInputModel, Preset } from '../../models';

/**
 * Common renderer for JavaScript types
 * 
 * @extends AbstractRenderer
 */
export abstract class JavaScriptRenderer extends AbstractRenderer<JavaScriptOptions> {
  constructor(
    options: JavaScriptOptions,
    presets: Array<[Preset, unknown]>,
    model: CommonModel, 
    inputModel: CommonInputModel,
  ) {
    super(options, presets, model, inputModel);
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

    return this.renderBlock(content);
  }

  async runPropertyPreset(propertyName: string, property: CommonModel): Promise<string> {
    return this.runPreset('property', { propertyName, property });
  }
}
