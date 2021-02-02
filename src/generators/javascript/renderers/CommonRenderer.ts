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

  protected renderType(model: CommonModel | CommonModel[]): string {
    if (Array.isArray(model)) {
      return model.map(t => this.renderType(t)).join(' | ');
    }
    if(model.$ref !== undefined){
      return model.$ref;
    }
    if (Array.isArray(model.type)) {
      return model.type.map(t => this.renderType(t as any)).join(' | ');
    }

    const type = model.type;
    switch (model.type) {
    case 'string':
      return 'string';
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array': {
      const types = model.items ? this.renderType(model.items) : 'any';
      return `Array<${types}>`;
    }
    default: return type || "any";
    }
  }
  
  protected renderTypeSignature(type: CommonModel | CommonModel[], isOptional: boolean = false): string {
    if (this.options.renderTypes === false) {
      return "";
    }

    const annotation = isOptional ? "?:" : ":";
    return `${annotation} ${this.renderType(type)}`;
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
