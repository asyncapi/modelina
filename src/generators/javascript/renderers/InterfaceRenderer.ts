import { TypeScriptRenderer } from "../TypeScriptRenderer";
import { CommonModel } from "../../../models";

/**
 * Renderer for TypeScript's `interface` type
 * 
 * @extends TypeScriptRenderer
 */
export class InterfaceRenderer extends TypeScriptRenderer {
  public render(): string {
    return `interface ${this.modelName} {
${this.indent(this.renderProperties())}
}`;
  }

  protected renderProperties(): string {
    const properties = this.model.properties || {};
    return Object.entries(properties).map(([name, property]) => {
      return this.renderProperty(name, property, false); // false at the moment is only for fallback
    }).filter(Boolean).join('\n');
  }

  protected renderProperty(name: string, property: CommonModel, isRequired: boolean): string {
    if (property.type === undefined) {
      return "";
    }

    const signature = this.renderTypeSignature(property, !isRequired);
    let content = `${name}${signature};`
    return content;
  }
}