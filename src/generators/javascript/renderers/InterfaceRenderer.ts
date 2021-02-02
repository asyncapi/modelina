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
    // TODO: make from it some helper.
    const required = (this.model.originalSchema as any)?.required || [];
    return Object.entries(properties).map(([name, property]) => {
      const isRequired = required.includes(name);
      return this.renderProperty(name, property, isRequired);
    }).filter(Boolean).join('\n');
  }

  protected renderProperty(name: string, property: CommonModel, isRequired: boolean): string {
    if (property.type === undefined) {
      return "";
    }
    const signature = this.renderTypeSignature(property, !isRequired);
    const content = `${name}${signature};`

    const description = (property.originalSchema as any).description;
    if (description) {
      return `${this.renderDescription(description)}\n${content}`;
    }
    return content;
  }
}