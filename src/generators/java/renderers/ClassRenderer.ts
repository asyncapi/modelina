import { JavaRenderer } from '../JavaRenderer';

import { CommonModel, ClassPreset, PropertyType } from '../../../models';
import { DefaultPropertyNames, FormatHelpers, getUniquePropertyName } from '../../../helpers';

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

    if (this.options?.collectionType === 'List') {
      this.addDependency('import java.util.List;');
    }
    if (this.model.additionalProperties !== undefined) {
      this.addDependency('import java.util.Map;');
    }
    
    const formattedName = this.nameType(`${this.model.$id}`);
    return `public class ${formattedName} {
${this.indent(this.renderBlock(content, 2))}
}`;
  }

  runCtorPreset(): Promise<string> {
    return this.runPreset('ctor');
  }

  async renderProperties(): Promise<string> {
    const properties = this.model.properties || {};
    const content: string[] = [];

    for (const [propertyName, property] of Object.entries(properties)) {
      const rendererProperty = await this.runPropertyPreset(propertyName, property);
      content.push(rendererProperty);
    }
    
    if (this.model.additionalProperties !== undefined) {
      const propertyName = getUniquePropertyName(this.model, DefaultPropertyNames.additionalProperties);
      const additionalProperty = await this.runPropertyPreset(propertyName, this.model.additionalProperties, PropertyType.additionalProperty);
      content.push(additionalProperty);
    }

    if (this.model.patternProperties !== undefined) {
      for (const [pattern, patternModel] of Object.entries(this.model.patternProperties)) {
        const propertyName = getUniquePropertyName(this.model, `${pattern}${DefaultPropertyNames.patternProperties}`);
        const renderedPatternProperty = await this.runPropertyPreset(propertyName, patternModel, PropertyType.patternProperties);
        content.push(renderedPatternProperty);
      }
    }

    return this.renderBlock(content);
  }

  runPropertyPreset(propertyName: string, property: CommonModel, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('property', { propertyName, property, type});
  }

  async renderAccessors(): Promise<string> {
    const properties = this.model.properties || {};
    const content: string[] = [];

    for (const [propertyName, property] of Object.entries(properties)) {
      const getter = await this.runGetterPreset(propertyName, property);
      const setter = await this.runSetterPreset(propertyName, property);
      content.push(this.renderBlock([getter, setter]));
    }

    if (this.model.additionalProperties !== undefined) {
      const propertyName = getUniquePropertyName(this.model, DefaultPropertyNames.additionalProperties);
      const getter = await this.runGetterPreset(propertyName, this.model.additionalProperties, PropertyType.additionalProperty);
      const setter = await this.runSetterPreset(propertyName, this.model.additionalProperties, PropertyType.additionalProperty);
      content.push(this.renderBlock([getter, setter]));
    }

    if (this.model.patternProperties !== undefined) {
      for (const [pattern, patternModel] of Object.entries(this.model.patternProperties)) {
        const propertyName = getUniquePropertyName(this.model, `${pattern}${DefaultPropertyNames.patternProperties}`);
        const getter = await this.runGetterPreset(propertyName, patternModel, PropertyType.patternProperties);
        const setter = await this.runSetterPreset(propertyName, patternModel, PropertyType.patternProperties);
        content.push(this.renderBlock([getter, setter]));
      }
    }

    return this.renderBlock(content, 2);
  }

  runGetterPreset(propertyName: string, property: CommonModel, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('getter', { propertyName, property, type});
  }

  runSetterPreset(propertyName: string, property: CommonModel, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('setter', { propertyName, property, type});
  }
}

export const JAVA_DEFAULT_CLASS_PRESET: ClassPreset<ClassRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  property({ renderer, propertyName, property, type }) {
    propertyName = renderer.nameProperty(propertyName, property);
    let propertyType = renderer.renderType(property);
    if (type === PropertyType.additionalProperty || type === PropertyType.patternProperties) {
      propertyType = `Map<String, ${propertyType}>`;
    }
    return `private ${propertyType} ${propertyName};`;
  },
  getter({ renderer, propertyName, property, type }) {
    const formattedPropertyName = renderer.nameProperty(propertyName, property);
    const getterName = `get${FormatHelpers.toPascalCase(propertyName)}`;
    let getterType = renderer.renderType(property);
    if (type === PropertyType.additionalProperty || type === PropertyType.patternProperties) {
      getterType = `Map<String, ${getterType}>`;
    }
    return `public ${getterType} ${getterName}() { return this.${formattedPropertyName}; }`;
  },
  setter({ renderer, propertyName, property, type }) {
    const formattedPropertyName = renderer.nameProperty(propertyName, property);
    const setterName = FormatHelpers.toPascalCase(propertyName);
    let setterType = renderer.renderType(property);
    if (type === PropertyType.additionalProperty || type === PropertyType.patternProperties) {
      setterType = `Map<String, ${setterType}>`;
    }
    return `public void set${setterName}(${setterType} ${formattedPropertyName}) { this.${formattedPropertyName} = ${formattedPropertyName}; }`;
  }
};
