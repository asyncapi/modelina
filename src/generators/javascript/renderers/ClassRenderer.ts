import { JavaScriptRenderer } from '../JavaScriptRenderer';

import { CommonModel, ClassPreset } from '../../../models';
import { FormatHelpers } from '../../../helpers';

/**
 * Renderer for JavaScript's `class` type
 * 
 * @extends JavaScriptRenderer
 */
export class ClassRenderer extends JavaScriptRenderer {
  public async defaultSelf(): Promise<string> {
    return `class ${this.model.$id} {
${this.indent(await this.renderProperties())}
      
${this.indent(await this.runCtorPreset())}
      
${this.indent(await this.renderAccessors())}
}`;
  }

  async runCtorPreset(): Promise<string> {
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

    return this.renderBlock(content, 2);
  }

  async runGetterPreset(propertyName: string, property: CommonModel, parentModel: CommonModel): Promise<string> {
    return this.runPreset('getter', { propertyName, property, parentModel });
  }

  async runSetterPreset(propertyName: string, property: CommonModel, parentModel: CommonModel): Promise<string> {
    return this.runPreset('setter', { propertyName, property, parentModel });
  }
}

export const JS_DEFAULT_CLASS_PRESET: ClassPreset<ClassRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  ctor({ renderer, model }) {
    const properties = model.properties || {};
    const assigments = Object.keys(properties).map(property => {
      property = FormatHelpers.toCamelCase(property);
      return `this.${property} = input.${property};`;
    });
    const body = renderer.renderBlock(assigments);

    return `constructor(input) {
${renderer.indent(body)}
}`;
  },
  property({ propertyName }) {
    propertyName = FormatHelpers.toCamelCase(propertyName);
    return `${propertyName};`;
  },
  getter({ propertyName }) {
    propertyName = FormatHelpers.toCamelCase(propertyName);
    return `get ${propertyName}() { return this.${propertyName}; }`;
  },
  setter({ propertyName }) {
    propertyName = FormatHelpers.toCamelCase(propertyName);
    return `set ${propertyName}(${propertyName}) { this.${propertyName} = ${propertyName}; }`;
  },
};
