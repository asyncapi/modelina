import { TypeScriptRenderer } from "../TypeScriptRenderer";
import { InterfaceRenderer } from "./InterfaceRenderer";

import { CommonModel, Preset } from "../../../../models";
import { FormatHelpers } from "../../../../helpers";

/**
 * Renderer for TypeScript's `class` type
 * 
 * @extends TypeScriptRenderer
 */
export class ClassRenderer extends TypeScriptRenderer {
  public render(): string {
    const clazz = `class ${this.model.$id} {
${this.indent(this.renderProperties(this.model.properties!))}
      
${this.indent(this.renderConstructor())}
      
${this.indent(this.renderAccessors())}
}`;

    if (this.options.renderTypes === true) {
      const renderer = new InterfaceRenderer(this.model, this.inputModel, this.options, []);
      const interfaceValue = renderer.render(`${this.model.$id}Input`);
      return this.renderBlock([interfaceValue, clazz], 2);
    }
    return clazz;
  }

  protected renderConstructor(): string {
    const signature = this.options.renderTypes ? `: ${this.model.$id}Input` : '';
    return `constructor(input${signature}) {
${this.indent(this.renderConstructorBody())}
}`;
  }

  protected renderConstructorBody(): string {
    const properties = this.model.properties!;
    const assigments = Object.keys(properties).map(property => {
      property = FormatHelpers.toCamelCase(property);
      return`this.${property} = input.${property};`
    });
    return this.renderBlock(assigments);
  }

  protected renderAccessors(): string {
    const properties = this.model.properties!;
    const accessors = Object.entries(properties).map(([name, property]) => {
      const getter = this.renderGetter(name, property);
      const setter = this.renderSetter(name, property);
      return this.renderBlock([getter, setter]);
    }).filter(Boolean);

    return this.renderBlock(accessors, 2);
  }

  protected renderGetter(name: string, property: CommonModel): string {
    name = FormatHelpers.toCamelCase(name);
    const signature = this.renderTypeSignature(property, false);
    return `get ${name}()${signature} { return this.${name}; }`;
  }

  protected renderSetter(name: string, property: CommonModel): string {
    name = FormatHelpers.toCamelCase(name);
    const signature = this.renderTypeSignature(property, false);
    const arg = `${name}${signature}`
    return `set ${name}(${arg}) { this.${name} = ${name}; }`;
  }
}
