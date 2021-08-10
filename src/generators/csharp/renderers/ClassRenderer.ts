import { CSharpRenderer } from '../CSharpRenderer';
import { ClassPreset, CommonModel, PropertyType } from '../../../models';
import { DefaultPropertyNames, getUniquePropertyName } from '../../../helpers';
import { pascalCase } from 'change-case';

/**
 * Renderer for CSharp's `struct` type
 * 
 * @extends CSharpRenderer
 */
export class ClassRenderer extends CSharpRenderer {
  public async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runCtorPreset(),
      await this.renderAccessors(),
      await this.runAdditionalContentPreset(),
    ];
    
    if (this.model.additionalProperties !== undefined || this.model.patternProperties !== undefined) {
      this.addDependency('using System.Collections.Generic;');
    }

    const formattedName = this.nameType(this.model.$id);
    return `public class ${formattedName} {
${this.indent(this.renderBlock(content, 2))}
}`;
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

  async accessorFactory(property: CommonModel, propertyName: string, type: PropertyType): Promise<string> {
    const formattedAccessorName = pascalCase(this.nameProperty(propertyName, property));
    let propertyType = this.renderType(property);
    if (type === PropertyType.additionalProperty || type === PropertyType.patternProperties) {
      propertyType = `Dictionary<string, ${propertyType}>`;
    }
    return `public ${propertyType} ${formattedAccessorName} 
{
  ${await this.runGetterPreset(propertyName, property, type)}
  ${await this.runSetterPreset(propertyName, property, type)}
}`;
  }
  async renderAccessors(): Promise<string> {
    const properties = this.model.properties || {};
    const content: string[] = [];

    for (const [propertyName, property] of Object.entries(properties)) {
      content.push(await this.accessorFactory(property, propertyName, PropertyType.property));
    }

    if (this.model.additionalProperties !== undefined) {
      const propertyName = getUniquePropertyName(this.model, DefaultPropertyNames.additionalProperties);
      content.push(await this.accessorFactory(this.model.additionalProperties, propertyName, PropertyType.additionalProperty));
    }

    if (this.model.patternProperties !== undefined) {
      for (const [pattern, patternModel] of Object.entries(this.model.patternProperties)) {
        const propertyName = getUniquePropertyName(this.model, `${pattern}${DefaultPropertyNames.patternProperties}`);
        content.push(await this.accessorFactory(patternModel, propertyName, PropertyType.patternProperties));
      }
    }

    return this.renderBlock(content, 2);
  }

  runCtorPreset(): Promise<string> {
    return this.runPreset('ctor');
  }

  runPropertyPreset(propertyName: string, property: CommonModel, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('property', { propertyName, property, type});
  }

  runGetterPreset(propertyName: string, property: CommonModel, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('getter', { propertyName, property, type});
  }

  runSetterPreset(propertyName: string, property: CommonModel, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('setter', { propertyName, property, type});
  }
}

export const CSHARP_DEFAULT_CLASS_PRESET: ClassPreset<ClassRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  property({ renderer, propertyName, property, type }) {
    propertyName = renderer.nameProperty(propertyName, property);
    let propertyType = renderer.renderType(property);
    if (type === PropertyType.additionalProperty || type === PropertyType.patternProperties) {
      propertyType = `Dictionary<string, ${propertyType}>`;
    }
    return `private ${propertyType} ${propertyName};`;
  },
  getter({ renderer, propertyName, property }) {
    const formattedPropertyName = renderer.nameProperty(propertyName, property);
    return `get { return ${formattedPropertyName}; }`;
  },
  setter({ renderer, propertyName, property }) {
    const formattedPropertyName = renderer.nameProperty(propertyName, property);
    return `set { ${formattedPropertyName} = value; }`;
  }
};
