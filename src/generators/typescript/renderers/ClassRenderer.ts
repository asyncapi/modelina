import { TypeScriptRenderer } from '../TypeScriptRenderer';

import { CommonModel, ClassPreset } from '../../../models';
import { FormatHelpers } from '../../../helpers';

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
      await this.runAdditionalContentPreset(),
    ];

    return `class ${this.model.$id} {
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
      const getter = await this.runGetterPreset(propertyName, property, this.model);
      const setter = await this.runSetterPreset(propertyName, property, this.model);
      content.push(this.renderBlock([getter, setter]));
    }

    if (this.model.additionalProperties !== undefined && this.model.additionalProperties instanceof CommonModel) {
      const getter = `get additionalProperties(): Record<string, ${this.renderType(this.model.additionalProperties)}> { return this._additionalProperties; }`;
      const setter = `set additionalProperties(additionalProperties: Record<string, ${this.renderType(this.model.additionalProperties)}>) { this._additionalProperties = additionalProperties; }`;
      const getSingleProperty = `getAdditionalProperty(key: string): ${this.renderType(this.model.additionalProperties)} { return this._additionalProperties[key]}`;
      const setSingleProperty = `setAdditionalProperty(key: string, value: ${this.renderType(this.model.additionalProperties)}) { this._additionalProperties[key] = value; }`;
      content.push(this.renderBlock([getter, setter, getSingleProperty, setSingleProperty]));
    }

    return this.renderBlock(content, 2);
  }

  runGetterPreset(propertyName: string, property: CommonModel, parentModel: CommonModel): Promise<string> {
    return this.runPreset('getter', { propertyName, property, parentModel });
  }

  runSetterPreset(propertyName: string, property: CommonModel, parentModel: CommonModel): Promise<string> {
    return this.runPreset('setter', { propertyName, property, parentModel });
  }
}

export const TS_DEFAULT_CLASS_PRESET: ClassPreset<ClassRenderer> = {
  async self({ renderer }) {
    return `export ${await renderer.defaultSelf()}`;
  },
  ctor({ renderer, model }) {
    const properties = model.properties || {};
    const assigments = Object.keys(properties).map(property => {
      property = FormatHelpers.toCamelCase(property);
      return `this._${property} = input.${property};`;
    });
    const ctorProperties: string[] = [];
    for (const [propertyName, property] of Object.entries(properties)) {
      const rendererProperty = renderer.renderProperty(propertyName, property, model).replace(';', ',');
      ctorProperties.push(rendererProperty);
    }

    return `constructor(input: {
${renderer.indent(renderer.renderBlock(ctorProperties))}
}) {
${renderer.indent(renderer.renderBlock(assigments))}
}`;
  },
  property({ renderer, propertyName, property, parentModel }) {
    return `private _${renderer.renderProperty(propertyName, property, parentModel)}`;
  },
  additionalProperties({renderer, additionalProperties}) {
    return `private _additionalProperties: Record<string, ${renderer.renderType(additionalProperties)}> = {};`;
  },
  getter({ renderer, propertyName, property }) {
    propertyName = FormatHelpers.toCamelCase(propertyName);
    const signature = renderer.renderTypeSignature(property);
    return `get ${propertyName}()${signature} { return this._${propertyName}; }`;
  },
  setter({ renderer, propertyName, property }) {
    propertyName = FormatHelpers.toCamelCase(propertyName);
    const signature = renderer.renderTypeSignature(property);
    const arg = `${propertyName}${signature}`;
    return `set ${propertyName}(${arg}) { this._${propertyName} = ${propertyName}; }`;
  },
};
