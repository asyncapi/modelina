import { JavaRenderer } from "../JavaRenderer";

import { CommonModel } from "../../../models";
import { FormatHelpers } from "../../../helpers";

/**
 * Renderer for Java's `class` type
 * 
 * @extends JavaRenderer
 */
export class ClassRenderer extends JavaRenderer {
  render(): string {
    return `public class ${this.model.$id} {
${this.indent(this.renderProperties())}

${this.indent(this.renderAccessors())}
}`;
  }

  protected renderProperties(): string {
    const p = this.model.properties || {};
    const props = Object.entries(p).map(([name, property]) => {
      return this.renderProperty(name, property);
    });
    return this.renderBlock(props);
  }

  protected renderProperty(name: string, property: CommonModel): string {
    name = FormatHelpers.toCamelCase(name);
    return `private ${this.renderType(property)} ${name};`;
  }

  protected renderAccessors(): string {
    const properties = this.model.properties || {};
    const accessors = Object.entries(properties).map(([name, property]) => {
      const getter = this.renderGetter(name, property);
      const setter = this.renderSetter(name, property);
      return this.renderBlock([getter, setter]);
    });
    return this.renderBlock(accessors, 2);
  }

  protected renderGetter(name: string, property: CommonModel): string {
    name = FormatHelpers.toCamelCase(name);
    const getterName = FormatHelpers.toPascalCase(name);
    const type = this.renderType(property);
    return `public ${type} get${getterName}() { return this.${name}; }`;
  }

  protected renderSetter(name: string, property: CommonModel): string {
    name = FormatHelpers.toCamelCase(name);
    const setterName = FormatHelpers.toPascalCase(name);
    const type = this.renderType(property);
    return `public void set${setterName}(${type} ${name}) { this.${name} = ${name}; }`;
  }
}
