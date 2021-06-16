import { TypeScriptRenderer } from '../TypeScriptRenderer';

import { CommonModel, ClassPreset, PropertyType } from '../../../models';
import { findPropertyNameForAdditionalProperties, FormatHelpers } from '../../../helpers';

/**
 * Renderer for TypeScript's `class` type
 * 
 * @extends TypeScriptRenderer
 */
export class ClassRenderer extends TypeScriptRenderer {
  public async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runCtorPreset(),
      await this.renderAccessors(),
      await this.runAdditionalContentPreset()
    ];

    const formattedName = this.model.$id && FormatHelpers.toPascalCase(this.model.$id);
    return `class ${formattedName} {
${this.indent(this.renderBlock(content, 2))}
}`;
  }

  runCtorPreset(): Promise<string> {
    return this.runPreset('ctor');
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
      const propertyName = findPropertyNameForAdditionalProperties(this.model);
      const getter = await this.runGetterPreset(propertyName, this.model.additionalProperties, PropertyType.additionalProperty);
      const setter = await this.runSetterPreset(propertyName, this.model.additionalProperties, PropertyType.additionalProperty);
      content.push(this.renderBlock([getter, setter]));
    }

    return this.renderBlock(content, 2);
  }

  runGetterPreset(propertyName: string, property: CommonModel, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('getter', { propertyName, property, type });
  }

  runSetterPreset(propertyName: string, property: CommonModel, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('setter', { propertyName, property, type });
  }
}

export const TS_DEFAULT_CLASS_PRESET: ClassPreset<ClassRenderer> = {
  async self({ renderer }): Promise<string> {
    return `export ${await renderer.defaultSelf()}`;
  },
  ctor({ renderer, model }) : string {
    const properties = model.properties || {};
    const assignments = Object.keys(properties).map(property => {
      property = FormatHelpers.toCamelCase(property);
      return `this._${property} = input.${property};`;
    });
    const ctorProperties: string[] = [];
    for (const [propertyName, property] of Object.entries(properties)) {
      const rendererProperty = renderer.renderProperty(propertyName, property).replace(';', ',');
      ctorProperties.push(rendererProperty);
    }

    return `constructor(input: {
${renderer.indent(renderer.renderBlock(ctorProperties))}
}) {
${renderer.indent(renderer.renderBlock(assignments))}
}`;
  },
  property({ renderer, propertyName, property, type }): string {
    return `private _${renderer.renderProperty(propertyName, property, type)}`;
  },
  getter({ renderer, model, propertyName, property, type }): string {
    const isRequired = model.isRequired(propertyName);
    propertyName = FormatHelpers.toCamelCase(propertyName);
    let signature = ''; 
    if (type === PropertyType.property) {
      signature = renderer.renderTypeSignature(property, { orUndefined: !isRequired });
    } else if (type === PropertyType.additionalProperty) {
      const additionalPropertyType = renderer.renderType(property);
      signature = `: Map<String, ${additionalPropertyType}> | undefined`;
    }
    return `get ${propertyName}()${signature} { return this._${propertyName}; }`;
  },
  setter({ renderer, model, propertyName, property, type }): string {
    const isRequired = model.isRequired(propertyName);
    propertyName = FormatHelpers.toCamelCase(propertyName);
    let signature = ''; 
    if (type === PropertyType.property) {
      signature = renderer.renderTypeSignature(property, { orUndefined: !isRequired });
    } else if (type === PropertyType.additionalProperty) {
      const additionalPropertyType = renderer.renderType(property);
      signature = `: Map<String, ${additionalPropertyType}> | undefined`;
    }
    return `set ${propertyName}(${propertyName}${signature}) { this._${propertyName} = ${propertyName}; }`;
  },
};
