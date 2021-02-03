import { CommonModel } from "../../../models";
import { JavaRenderer } from "../JavaRenderer";

/**
 * Renderer for Java's `class` type
 * 
 * @extends JavaRenderer
 */
export class ClassRenderer extends JavaRenderer {
  render(): string {
    const properties = this.renderProperties();
    const accessors = this.renderAccessors();

    return `public class ${this.model.$id} {
${this.indent(properties)}

${this.indent(accessors)}
}`;
  }

  protected renderProperties(): string {
    const properties = this.model.properties || {};
    const fields = Object.entries(properties).map(([name, property]) => {
      return this.renderProperty(name, property);
    }).filter(Boolean);

    return this.renderBlock(fields);
  }

  protected renderProperty(name: string, property: CommonModel): string {
    if (property.type === undefined) {
      return "";
    }
    return `private ${this.renderType(property)} ${name};`;
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

    const getterName = name.charAt(0).toUpperCase() + name.slice(1);
    const type = this.renderType(property);
    return `public ${type} get${getterName}() { return this.${name}; }`;
  }

  protected renderSetter(name: string, property: CommonModel): string {
    if (property.type === undefined) {
      return "";
    }

    const setterName = name.charAt(0).toUpperCase() + name.slice(1);
    const type = this.renderType(property);
    return `public void set${setterName}(${type} value) { this.${name} = value; }`;
  }
}
