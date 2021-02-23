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

    return `public class ${this.model.$id} {
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
      const rendererProperty = await this.runPropertyPreset(propertyName, property, this.model);
      content.push(rendererProperty);
    }

    if (this.model.additionalProperties !== undefined && this.model.additionalProperties instanceof CommonModel) {
      const additionalType = this.renderType(this.model.additionalProperties);
      const rendererProperty = `private Map<String, ${additionalType}> additionalProperties = new HashMap();`;
      content.push(rendererProperty);
    }

    return this.renderBlock(content);
  }

  async runPropertyPreset(propertyName: string, property: CommonModel, parentModel: CommonModel): Promise<string> {
    return this.runPreset('property', { propertyName, property, parentModel });
  }

  async renderAccessors(): Promise<string> {
    const properties = this.model.properties || {};
    const content: string[] = [];

    for (const [propertyName, property] of Object.entries(properties)) {
      const getter = await this.runGetterPreset(propertyName, property, this.model);
      const setter = await this.runSetterPreset(propertyName, property, this.model);
      content.push(this.renderBlock([getter, setter]));
    }

    if (this.model.additionalProperties !== undefined && this.model.additionalProperties instanceof CommonModel) {
      const additionalPropertyType = this.renderType(this.model.additionalProperties);
      const getter = `public ${additionalPropertyType} getAdditionalProperty(String key):  { return additionalProperties.get(key); }`;
      const setter = `public void setAdditionalProperty(String key, ${additionalPropertyType} value) { additionalProperties.put(key, value); }`;
      content.push(this.renderBlock([getter, setter]));
    }

    return this.renderBlock(content, 2);
  }

  async runGetterPreset(propertyName: string, property: CommonModel, parentModel: CommonModel): Promise<string> {
    return this.runPreset('getter', { propertyName, property, parentModel });
  }

  async runSetterPreset(propertyName: string, property: CommonModel, parentModel: CommonModel): Promise<string> {
    return this.runPreset('setter', { propertyName, property, parentModel });
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
