import { CSharpRenderer } from '../CSharpRenderer';
import { CommonModel, PropertyType } from '../../../models';
import { DefaultPropertyNames, getUniquePropertyName } from '../../../helpers';
import { pascalCase } from 'change-case';
import { CsharpClassPreset } from '../CSharpPreset';
import { CSharpOptions } from '../CSharpGenerator';

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
      const rendererProperty = await this.runPropertyPreset(propertyName, property, this.options);
      content.push(rendererProperty);
    }

    if (this.model.additionalProperties !== undefined) {
      const propertyName = getUniquePropertyName(this.model, DefaultPropertyNames.additionalProperties);
      const additionalProperty = await this.runPropertyPreset(propertyName, this.model.additionalProperties, this.options, PropertyType.additionalProperty);
      content.push(additionalProperty);
    }

    if (this.model.patternProperties !== undefined) {
      for (const [pattern, patternModel] of Object.entries(this.model.patternProperties)) {
        const propertyName = getUniquePropertyName(this.model, `${pattern}${DefaultPropertyNames.patternProperties}`);
        const renderedPatternProperty = await this.runPropertyPreset(propertyName, patternModel, this.options, PropertyType.patternProperties);
        content.push(renderedPatternProperty);
      }
    }

    return this.renderBlock(content);
  }

  async renderAccessors(): Promise<string> {
    const properties = this.model.properties || {};
    const content: string[] = [];

    for (const [propertyName, property] of Object.entries(properties)) {
      content.push(await this.runAccessorPreset(propertyName, property, this.options, PropertyType.property));
    }

    if (this.model.additionalProperties !== undefined) {
      const propertyName = getUniquePropertyName(this.model, DefaultPropertyNames.additionalProperties);
      content.push(await this.runAccessorPreset(propertyName, this.model.additionalProperties, this.options, PropertyType.additionalProperty));
    }

    if (this.model.patternProperties !== undefined) {
      for (const [pattern, patternModel] of Object.entries(this.model.patternProperties)) {
        const propertyName = getUniquePropertyName(this.model, `${pattern}${DefaultPropertyNames.patternProperties}`);
        content.push(await this.runAccessorPreset(propertyName, patternModel, this.options, PropertyType.patternProperties));
      }
    }

    return this.renderBlock(content, 2);
  }

  runCtorPreset(): Promise<string> {
    return this.runPreset('ctor');
  }

  runAccessorPreset(propertyName: string, property: CommonModel, options?: any, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('accessor', { propertyName, property, options, type });
  }

  runPropertyPreset(propertyName: string, property: CommonModel, options?: any, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('property', { propertyName, property, options, type });
  }

  runGetterPreset(propertyName: string, property: CommonModel, options?: any, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('getter', { propertyName, property, options, type });
  }

  runSetterPreset(propertyName: string, property: CommonModel, options?: any, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('setter', { propertyName, property, options, type });
  }
}

export const CSHARP_DEFAULT_CLASS_PRESET: CsharpClassPreset = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  async property({ renderer, propertyName, options, property, type }) {
    propertyName = renderer.nameProperty(propertyName, property);
    let propertyType = renderer.renderType(property);
    if (type === PropertyType.additionalProperty || type === PropertyType.patternProperties) {
      propertyType = `Dictionary<string, ${propertyType}>`;
    }
    if (options?.useShortHandAccessors) {
      const getter = await renderer.runGetterPreset(propertyName, property, options, type);
      const setter = await renderer.runSetterPreset(propertyName, property, options, type);
      return `public ${propertyType} ${pascalCase(propertyName)} { ${getter} ${setter} }`;
    }
    return `private ${propertyType} ${propertyName};`;
  },
  async accessor({ renderer, propertyName, options, property, type }) {
    const formattedAccessorName = pascalCase(renderer.nameProperty(propertyName, property));
    let propertyType = renderer.renderType(property);
    if (type === PropertyType.additionalProperty || type === PropertyType.patternProperties) {
      propertyType = `Dictionary<string, ${propertyType}>`;
    }
    if (options?.useShortHandAccessors) return '';

    return `public ${propertyType} ${formattedAccessorName} 
{
  ${await renderer.runGetterPreset(propertyName, property, options, type)}
  ${await renderer.runSetterPreset(propertyName, property, options, type)}
}`;
  },
  getter({ renderer, propertyName, options, property }) {
    if (options?.useShortHandAccessors) return 'get;';
    const formattedPropertyName = renderer.nameProperty(propertyName, property);
    return `get { return ${formattedPropertyName}; }`;
  },
  setter({ renderer, propertyName, options, property }) {
    if (options?.useShortHandAccessors) return 'set;';
    const formattedPropertyName = renderer.nameProperty(propertyName, property);
    return `set { ${formattedPropertyName} = value; }`;
  }
};
