import { AbstractRenderer } from "../../AbstractRenderer";
import { TypeScriptGenerator, TypeScriptOptions } from "./TypeScriptGenerator";

import { FormatHelpers } from "../../../helpers";
import { CommonModel, CommonInputModel } from "../../../models";

/**
 * Common renderer for TypeScript types
 * 
 * @extends AbstractRenderer
 */
export abstract class TypeScriptRenderer extends AbstractRenderer<TypeScriptOptions> {
  constructor(
    protected model: CommonModel, 
    protected inputModel: CommonInputModel,
    protected options: TypeScriptOptions = TypeScriptGenerator.defaultOptions,
  ) {
    super({ ...TypeScriptGenerator.defaultOptions, ...options });
  }

  protected renderType(model: CommonModel | CommonModel[]): string {
    if (Array.isArray(model)) {
      return model.map(t => this.renderType(t)).join(' | ');
    }
    if (model.$ref !== undefined) {
      return model.$ref;
    }
    if (Array.isArray(model.type)) {
      return model.type.map(t => this.renderPrimitiveType(t, model)).join(' | ');
    }
    return this.renderPrimitiveType(model.type, model);
  }

  protected renderPrimitiveType(type: string | undefined, model: CommonModel): string {
    if (type === undefined) {
      return "any";
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
        const types = model.items ? this.renderType(model.items) : 'unknown';
        return `Array<${types}>`;
      }
      default: return type;
    }
  }

  protected renderTypeSignature(type: CommonModel | CommonModel[], isOptional: boolean = false): string {
    if (this.options.renderTypes === false) {
      return "";
    }
    const annotation = isOptional ? "?:" : ":";
    return `${annotation} ${this.renderType(type)}`;
  }

  protected renderProperties(): string {
    const p = this.model.properties || {};
    const props = Object.entries(p).map(([name, property]) => {
      return this.renderProperty(name, property, true); // false at the moment is only for fallback
    }).filter(Boolean);
    return this.renderBlock(props);
  }

  protected renderProperty(name: string, property: CommonModel, isOptional: boolean): string {
    const signature = this.renderTypeSignature(property, isOptional);
    let content = `${name}${signature};`
    return content;
  }

  protected renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    const content = lines.map(line => ` * ${line}`).join('\n');
    return `/**
${content}
 */`;
  }
}
