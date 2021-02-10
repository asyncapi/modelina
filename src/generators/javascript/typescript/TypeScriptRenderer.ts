import { AbstractRenderer } from "../../AbstractRenderer";
import { TypeScriptOptions } from "./TypeScriptGenerator";

import { FormatHelpers } from "../../../helpers";
import { CommonModel, CommonInputModel, Preset } from "../../../models";

/**
 * Common renderer for TypeScript types
 * 
 * @extends AbstractRenderer
 */
export abstract class TypeScriptRenderer extends AbstractRenderer<TypeScriptOptions> {
  constructor(
    protected model: CommonModel, 
    protected inputModel: CommonInputModel,
    options: TypeScriptOptions,
    presets: Array<[Preset, unknown]>,
  ) {
    super(options, presets);
  }

  protected renderType(model: CommonModel | CommonModel[]): string {
    if (Array.isArray(model)) {
      return model.map(t => this.renderType(t)).join(' | ');
    }
    if (model.$ref !== undefined) {
      return model.$ref;
    }
    if (Array.isArray(model.type)) {
      return model.type.map(t => this.toTsType(t, model)).join(' | ');
    }
    return this.toTsType(model.type, model);
  }

  protected toTsType(type: string | undefined, model: CommonModel): string {
    if (type === undefined) {
      return "any";
    }
    switch (type) {
      case 'string':
        return 'string';
      case 'integer':
      case 'number':
        return 'number';
      case 'bigint':
        return 'bigint';
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

  protected renderProperties(properties: Record<string, CommonModel>): string {
    const props = Object.entries(properties || {}).map(([name, property]) => {
      name = FormatHelpers.toCamelCase(name);
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
    return `/**
${lines.map(line => ` * ${line}`).join('\n')}
 */`;
  }
}
