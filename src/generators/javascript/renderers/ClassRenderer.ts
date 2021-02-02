import { Schema } from "../../../models";
import { TypeScriptRenderer } from "./TypeScriptRenderer";
import { InterfaceRenderer } from "./InterfaceRenderer";

export class ClassRenderer extends TypeScriptRenderer {
  public render(): string {
    const properties = this.renderProperties();
    const ctor = this.renderConstructor();
    const accessors = this.renderAccessors();

    const classContent = `class ${this.modelName} {
${this.indent(properties)}
      
${this.indent(ctor)}
      
${this.indent(accessors)}
}`;

    if (this.options.renderTypes === false) {
      return classContent;
    }
    return `${this.renderInputInterface()}

${classContent}`;
  }

  protected renderInputInterface(): string {    
    const interfaceRenderer = new InterfaceRenderer(this.model, `${this.modelName}Input`, this.inputModel);
    const interfaceValue = interfaceRenderer.render();
    return `${interfaceValue}`;
  }

  protected renderProperties(): string {
    const properties = this.model.properties!;
    // TODO: make from it some helper.
    const required = this.model.originalSchema?.required || [];
    const props = Object.entries(properties).map(([name, property]) => {
      const isRequired = required.includes(name);
      return this.renderProperty(name, property, isRequired);
    }).filter(Boolean);
    return this.renderBlock(props);
  }

  protected renderProperty(name: string, property: Schema, isRequired: boolean): string {
    if (property.type === undefined) {
      return "";
    }

    name = this.options.namingConvention(name);
    const signature = this.renderTypeSignature(property, !isRequired);
    let content = `private ${name}${signature};`
    if (this.options.renderTypes === false) {
      content = `${name}${signature};`
    }

    if (property.description) {
      return `${this.renderDescription(property.description)}\n${content}`;
    }
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

  protected renderGetter(name: string, property: Schema): string {
    if (property.type === undefined) {
      return "";
    }

    const signature = this.renderTypeSignature(property, false);
    return `get ${name}()${signature} { return this.${name}; }`;
  }

  protected renderSetter(name: string, property: Schema): string {
    if (property.type === undefined) {
      return "";
    }

    const signature = this.renderTypeSignature(property, false);
    const arg = `${name}${signature}`
    return `set ${name}(${arg}) { this.${name} = ${name}; }`;
  }
}
