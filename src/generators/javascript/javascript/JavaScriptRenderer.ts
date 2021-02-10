import { AbstractRenderer } from "../../AbstractRenderer";
import { JavaScriptOptions } from "./JavaScriptGenerator";

import { FormatHelpers } from "../../../helpers";
import { CommonModel, CommonInputModel, Preset } from "../../../models";

/**
 * Common renderer for JavaScript types
 * 
 * @extends AbstractRenderer
 */
export abstract class JavaScriptRenderer extends AbstractRenderer<JavaScriptOptions> {
  constructor(
    protected model: CommonModel, 
    protected inputModel: CommonInputModel,
    options: JavaScriptOptions,
    presets: Array<[Preset, unknown]>,
  ) {
    super(options, presets);
  }

  protected renderProperties(): string {
    const properties = this.model.properties || {};
    const fields = Object.keys(properties).map(name => {
      name = FormatHelpers.toCamelCase(name);
      return this.renderProperty(name);
    }).filter(Boolean);
    return this.renderBlock(fields);
  }

  protected renderProperty(name: string): string {
    return `${name};`;
  }

  protected renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    const content = lines.map(line => ` * ${line}`).join('\n');
    return `/**
${content}
 */`;
  }
}
