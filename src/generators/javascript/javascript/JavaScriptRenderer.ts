import { AbstractRenderer } from "../../AbstractRenderer";
import { JavaScriptGenerator, JavaScriptOptions } from "./JavaScriptGenerator";

import { FormatHelpers } from "../../../helpers";
import { CommonModel, CommonInputModel } from "../../../models";

/**
 * Common renderer for TypeScript types
 * 
 * @extends AbstractRenderer
 */
export abstract class JavaScriptRenderer extends AbstractRenderer<JavaScriptOptions> {
  constructor(
    protected model: CommonModel, 
    protected inputModel: CommonInputModel,
    protected options: JavaScriptOptions = JavaScriptGenerator.defaultOptions,
  ) {
    super({ ...JavaScriptGenerator.defaultOptions, ...options });
  }

  protected renderProperties(): string {
    const properties = this.model.properties || {};
    const fields = Object.keys(properties).map(name => {
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
