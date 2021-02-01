import { AbstractRenderer } from "../../AbstractRenderer";
import { TypeScriptGenerator, TypeScriptOptions } from "../TypeScriptGenerator";

import { FormatHelpers } from "../../../helpers";
import { CommonModel, CommonInputModel } from "../../../models";

export abstract class TypeScriptRenderer extends AbstractRenderer<TypeScriptOptions> {
  constructor(
    protected model: CommonModel, 
    protected modelName: string, 
    protected inputModel: CommonInputModel,
    protected options: TypeScriptOptions = TypeScriptGenerator.defaultOptions,
  ) {
    super({ ...TypeScriptGenerator.defaultOptions, ...options });
  }

  protected renderDescription(desc: string): string {
    return this.renderComments(desc);
  }

  protected renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    const content = lines.map(line => ` * ${line}`).join('\n');
    return `/**
${content}
 */`;
  }

  protected renderType(type: string): string {
    switch (type) {
    case 'string':
      return 'string';
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'object':
      return 'any';
    case 'array': 
      return 'Array<any>';
    default: return type;
    }
  }
  
  protected renderTypeSignature(type: string | string[], isOptional: boolean = false): string {
    // FOR JS
    if (this.options.renderTypes === false) {
      return "";
    }

    if (!Array.isArray(type)) {
      type = [type];
    }
    const types = type.map(t => this.renderType(t)).join(' | ');
    const annotation = isOptional ? "?:" : ":";

    return `${annotation} ${types}`;
  }

  protected renderImport(what: string | string[], from: string): string {
    if (Array.isArray(what)) {
      what = `{ ${what.join(', ')} }`
    } 
    return `import ${what} from ${from}`;
  }
  
  protected renderExport(what: string | string[], from?: string): string {
    if (Array.isArray(what)) {
      what = `{ ${what.join(', ')} }`
    }
    if (from) {
      return `export ${what} from ${from}`;
    }
    return `export ${what}`;
  }
}
