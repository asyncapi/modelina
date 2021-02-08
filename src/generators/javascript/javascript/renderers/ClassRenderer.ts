import { CommonModel } from "../../../../models";
import { JavaScriptRenderer } from "../JavaScriptRenderer";

import { FormatHelpers } from "../../../../helpers";

/**
 * Renderer for JavaScript's `class` type
 * 
 * @extends JavaScriptRenderer
 */
export class ClassRenderer extends JavaScriptRenderer {
  public render(): string {
    return`class ${this.model.$id} {
${this.indent(this.renderProperties())}
      
${this.indent(this.renderConstructor())}
      
${this.indent(this.renderAccessors())}
}`;
  }

  protected renderConstructor(): string {
    return `constructor(input) {
${this.indent(this.renderConstructorBody())}
}`;
  }

  protected renderConstructorBody(): string {
    const properties = this.model.properties!;
    const assigments = Object.keys(properties).map(property => {
      property = FormatHelpers.toCamelCase(property);
      return `this.${property} = input.${property};`
    });
    return this.renderBlock(assigments);
  }

  protected renderAccessors(): string {
    const properties = this.model.properties!;
    const accessors = Object.keys(properties).map(name => {
      name = FormatHelpers.toCamelCase(name);
      const getter = this.renderGetter(name);
      const setter = this.renderSetter(name);
      return this.renderBlock([getter, setter]);
    }).filter(Boolean);
    return this.renderBlock(accessors, 2);
  }

  protected renderGetter(name: string): string {
    return `get ${name}() { return this.${name}; }`;
  }

  protected renderSetter(name: string): string {
    return `set ${name}(${name}) { this.${name} = ${name}; }`;
  }
}
