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
      const isRequired = this.isPropertyRequired(name, this.model);
      return this.renderProperty(name, property, isRequired);
    }).filter(Boolean).join('\n');
  }

  protected renderProperty(name: string, property: CommonModel, isRequired: boolean): string {
    if (property.type === undefined) {
      return "";
    }

    const signature = this.renderTypeSignature(property, !isRequired);
    let content = `${name}${signature};`

    const description = this.renderDescription(property);
    if (description) {
      content = `${description}\n${content}`;
    }
    return content;
  }
}