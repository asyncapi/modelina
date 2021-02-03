import { CommonModel } from "../../../models";
import { TypeScriptRenderer } from "../TypeScriptRenderer";

import { InterfaceRenderer } from "./InterfaceRenderer";

/**
 * Renderer for TypeScript's/JavaScript's `class` type
 * 
 * @extends TypeScriptRenderer
 */
export class ClassRenderer extends TypeScriptRenderer {
  public render(): string {
    const properties = this.renderProperties();
    const ctor = this.renderConstructor();
    const accessors = this.renderAccessors();

    const clazz = `class ${this.modelName} {
${this.indent(properties)}
      
${this.indent(ctor)}
      
${this.indent(accessors)}
}`;

    if (this.options.renderTypes === true) {
      const renderer = new InterfaceRenderer(this.model, `${this.modelName}Input`, this.inputModel, this.options);
      const interfaceValue = renderer.render();
      return this.renderBlock([interfaceValue, clazz], 2);
    }
    return clazz;
  }

  protected renderProperties(): string {
    const properties = this.model.properties || {};
    const fields = Object.entries(properties).map(([name, property]) => {
      return this.renderProperty(name, property, false); // false at the moment is only for fallback
    }).filter(Boolean);

    return this.renderBlock(fields);
  }

  protected renderProperty(name: string, property: CommonModel, isRequired: boolean): string {
    if (property.type === undefined) {
      return "";
    }

    const signature = this.renderTypeSignature(property, !isRequired);
    let content = `${name}${signature};`
    return content;
  }

  protected renderConstructor(): string {
    const signature = this.options.renderTypes ? `: ${this.modelName}Input` : '';
    return `constructor(input${signature}) {
${this.indent(this.renderConstructorBody())}
}`;
  }

  protected renderConstructorBody(): string {
    const properties = this.model.properties!;
    const assigments = Object.keys(properties).map(property => `this.${property} = input.${property};`);
    return this.renderBlock(assigments);
  }

  protected renderAccessors(): string {
    const properties = this.model.properties!;
    const accessors = Object.entries(properties).map(([name, property]) => {
      const getter = this.renderGetter(name, property);
      const setter = this.renderSetter(name, property);
      return `${getter}\n${setter}`;
    }).filter(Boolean);

    return this.renderBlock(accessors, 2);
  }

  protected renderGetter(name: string, property: CommonModel): string {
    if (property.type === undefined) {
      return "";
    }

    const signature = this.renderTypeSignature(property, false);
    return `get ${name}()${signature} { return this.${name}; }`;
  }

  protected renderSetter(name: string, property: CommonModel): string {
    if (property.type === undefined) {
      return "";
    }

    const signature = this.renderTypeSignature(property, false);
    const arg = `${name}${signature}`
    return `set ${name}(${arg}) { this.${name} = ${name}; }`;
  }
}
