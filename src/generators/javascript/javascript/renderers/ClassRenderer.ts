import { CommonModel } from "../../../../models";
import { JavaScriptRenderer } from "../JavaScriptRenderer";

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
    return `get ${name}() { return this.${name}; }`;
  }

  protected renderSetter(name: string, property: CommonModel): string {
    return `set ${name}(${name}) { this.${name} = ${name}; }`;
  }
}
