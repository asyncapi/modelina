import { Schema } from "../../../models";
import { TypeScriptRenderer } from "./TypeScriptRenderer";

export class InterfaceRenderer extends TypeScriptRenderer {
  public render(): string {
    const properties = this.renderProperties();
    return `interface ${this.modelName} {
${this.indent(properties)}
}`;
  }

  protected renderProperties(): string {
    const properties = this.model.properties!;
    // TODO: make from it some helper.
    const required = this.model.originalSchema?.required || [];
    return Object.entries(properties).map(([name, property]) => {
      const isRequired = required.includes(name);
      return this.renderProperty(name, property, isRequired);
    }).filter(Boolean).join('\n');
  }

  protected renderProperty(name: string, property: Schema, isRequired: boolean): string {
    if (property.type === undefined) {
      return "";
    }

    name = this.options.namingConvention(name);
    const signature = this.renderTypeSignature(property, !isRequired);
    const content = `${name}${signature};`

    if (property.description) {
      return `${this.renderDescription(property.description)}\n${content}`;
    }
    return content;
  }
}
