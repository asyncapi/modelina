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
    return `class ${this.model.$id} {
${this.indent(await this.renderProperties())}
      
${this.indent(await this.runCtorPreset())}
      
${this.indent(await this.renderAccessors())}
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

    return this.renderBlock(content, 2);
  }

  runGetterPreset(propertyName: string, property: CommonModel): Promise<string> {
    return this.runPreset('getter', { propertyName, property });
  }

  runSetterPreset(propertyName: string, property: CommonModel): Promise<string> {
    return this.runPreset('setter', { propertyName, property });
  }
}

export const TS_DEFAULT_CLASS_PRESET: ClassPreset<ClassRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  ctor({ renderer, model }) {
    const properties = model.properties || {};
    const assigments = Object.keys(properties).map(property => {
      property = FormatHelpers.toCamelCase(property);
      return `this.${property} = input.${property};`;
    });

    return `constructor(input: ${model.$id}Input) {
${renderer.indent(renderer.renderBlock(assigments))}
}`;
  },
  property({ renderer, propertyName, property }) {
    return `private ${renderer.renderProperty(propertyName, property)}`;
  },
  getter({ renderer, propertyName, property }) {
    propertyName = FormatHelpers.toCamelCase(propertyName);
    const signature = renderer.renderTypeSignature(property, false);
    return `get ${propertyName}()${signature} { return this.${propertyName}; }`;
  },
  setter({ renderer, propertyName, property }) {
    propertyName = FormatHelpers.toCamelCase(propertyName);
    const signature = renderer.renderTypeSignature(property, false);
    const arg = `${propertyName}${signature}`;
    return `set ${propertyName}(${arg}) { this.${propertyName} = ${propertyName}; }`;
  },
};
