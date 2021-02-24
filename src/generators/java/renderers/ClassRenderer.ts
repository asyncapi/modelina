import { JavaRenderer } from '../JavaRenderer';

import { CommonModel, ClassPreset } from '../../../models';
import { FormatHelpers } from '../../../helpers';

/**
 * Renderer for Java's `class` type
 * 
 * @extends JavaRenderer
 */
export class ClassRenderer extends JavaRenderer {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runCtorPreset(),
      await this.renderAccessors(),
      await this.runAdditionalContentPreset(),
    ];

    const formattedName = this.model.$id && FormatHelpers.toPascalCase(this.model.$id);
    return `public class ${formattedName} {
${this.indent(this.renderBlock(content, 2))}
}`;
  }

  async runCtorPreset(): Promise<string> {
    return this.runPreset('ctor');
  }

  async renderProperties(): Promise<string> {
    const properties = this.model.properties || {};
    const content: string[] = [];

    for (const [propertyName, property] of Object.entries(properties)) {
      const rendererProperty = await this.runPropertyPreset(propertyName, property);
      content.push(rendererProperty);
    }

    return this.renderBlock(content);
  }

  async runPropertyPreset(propertyName: string, property: CommonModel): Promise<string> {
    return this.runPreset('property', { propertyName, property });
  }

  async renderAccessors(): Promise<string> {
    const properties = this.model.properties || {};
    const content: string[] = [];

    for (const [propertyName, property] of Object.entries(properties)) {
      const getter = await this.runGetterPreset(propertyName, property);
      const setter = await this.runSetterPreset(propertyName, property);
      content.push(this.renderBlock([getter, setter]));
    }

    return this.renderBlock(content, 2);
  }

  async runGetterPreset(propertyName: string, property: CommonModel): Promise<string> {
    return this.runPreset('getter', { propertyName, property });
  }

  async runSetterPreset(propertyName: string, property: CommonModel): Promise<string> {
    return this.runPreset('setter', { propertyName, property });
  }
}

export const JAVA_DEFAULT_CLASS_PRESET: ClassPreset<ClassRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  property({ renderer, propertyName, property }) {
    propertyName = FormatHelpers.toCamelCase(propertyName);
    return `private ${renderer.renderType(property)} ${propertyName};`;
  },
  getter({ renderer, propertyName, property }) {
    propertyName = FormatHelpers.toCamelCase(propertyName);
    const getterName = FormatHelpers.toPascalCase(propertyName);
    const type = renderer.renderType(property);
    return `public ${type} get${getterName}() { return this.${propertyName}; }`;
  },
  setter({ renderer, propertyName, property }) {
    propertyName = FormatHelpers.toCamelCase(propertyName);
    const setterName = FormatHelpers.toPascalCase(propertyName);
    const type = renderer.renderType(property);
    return `public void set${setterName}(${type} ${propertyName}) { this.${propertyName} = ${propertyName}; }`;
  },
};
